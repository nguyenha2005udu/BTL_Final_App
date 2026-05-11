import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../app/services/firebase/firebaseConfig"; // ← chỉnh đường dẫn cho phù hợp

/* ───────────────────────── types ───────────────────────── */
interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isBanned: boolean;
  createdAt: any;
}

const PAGE_SIZE = 8;

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  /* ── kiểm tra quyền admin ── */
  useEffect(() => {
    const checkAdmin = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) { setAccessDenied(true); setLoading(false); return; }

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (!snap.exists() || snap.data()?.role !== "admin") {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      fetchUsers();
    };
    checkAdmin();
  }, []);

  /* ── fetch toàn bộ users ── */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setUsers(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name ?? "—",
          email: d.data().email ?? "—",
          role: d.data().role ?? "user",
          isBanned: d.data().isBanned ?? false,
          createdAt: d.data().createdAt,
        }))
      );
    } catch (e) {
      showToast("Lỗi tải dữ liệu", false);
    } finally {
      setLoading(false);
    }
  };

  /* ── helpers ── */
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("vi-VN");
  };

  /* ── đổi quyền ── */
  const toggleRole = async (user: AppUser) => {
    setActionLoading(user.id + "_role");
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await updateDoc(doc(db, "users", user.id), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      showToast(`Đã chuyển ${user.name} thành ${newRole}`, true);
    } catch {
      showToast("Cập nhật thất bại", false);
    } finally {
      setActionLoading(null);
    }
  };

  /* ── khóa / mở tài khoản ── */
  const toggleBan = async (user: AppUser) => {
    setActionLoading(user.id + "_ban");
    const newBan = !user.isBanned;
    try {
      await updateDoc(doc(db, "users", user.id), { isBanned: newBan });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: newBan } : u))
      );
      showToast(
        newBan ? `Đã khóa tài khoản ${user.name}` : `Đã mở khóa ${user.name}`,
        true
      );
    } catch {
      showToast("Cập nhật thất bại", false);
    } finally {
      setActionLoading(null);
    }
  };

  /* ── pagination ── */
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paged = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ════════════════════════ RENDER ════════════════════════ */

  /* Access Denied */
  if (accessDenied)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center p-10 bg-gray-900 rounded-2xl border border-red-500/30 shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-400">Chỉ tài khoản Admin mới có quyền xem trang này.</p>
        </div>
      </div>
    );

  /* Loading skeleton */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all
            ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.ok ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            👥 Quản lý người dùng
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Tổng cộng <span className="text-indigo-400 font-semibold">{users.length}</span> tài khoản
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors flex items-center gap-2"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 text-left">Người dùng</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-center">Quyền</th>
                <th className="px-6 py-4 text-center">Ngày tạo</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paged.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
              {paged.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-800/40 transition-colors ${user.isBanned ? "opacity-60" : ""
                    }`}
                >
                  {/* Avatar + Tên */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>

                  {/* Role badge */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                        ${user.role === "admin"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                  </td>

                  {/* Ngày tạo */}
                  <td className="px-6 py-4 text-center text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                        ${user.isBanned
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-red-400" : "bg-emerald-400"}`} />
                      {user.isBanned ? "Đã khóa" : "Hoạt động"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Đổi quyền */}
                      <button
                        onClick={() => toggleRole(user)}
                        disabled={actionLoading === user.id + "_role"}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {actionLoading === user.id + "_role"
                          ? "..."
                          : user.role === "admin" ? "→ User" : "→ Admin"}
                      </button>

                      {/* Khóa / Mở */}
                      <button
                        onClick={() => toggleBan(user)}
                        disabled={actionLoading === user.id + "_ban"}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                          ${user.isBanned
                            ? "bg-emerald-600/20 hover:bg-emerald-600/40 border-emerald-500/30 text-emerald-400"
                            : "bg-red-600/20 hover:bg-red-600/40 border-red-500/30 text-red-400"
                          }`}
                      >
                        {actionLoading === user.id + "_ban"
                          ? "..."
                          : user.isBanned ? "🔓 Mở khóa" : "🔒 Khóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900/50">
            <p className="text-xs text-gray-500">
              Trang {page}/{totalPages} — hiển thị {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, users.length)} / {users.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-2 py-1 rounded text-xs text-gray-400 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded text-xs text-gray-400 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ‹ Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                    acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={i} className="px-2 text-gray-600 text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-7 rounded text-xs font-medium transition-colors
                        ${page === p
                          ? "bg-indigo-600 text-white"
                          : "text-gray-400 hover:bg-gray-700"
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded text-xs text-gray-400 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Sau ›
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-2 py-1 rounded text-xs text-gray-400 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
