import { useEffect, useState } from 'react';
import { listenTransactions, Transaction } from '@services/transaction.service';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenTransactions(list => {
      setTransactions(list);
      setLoading(false);
    });

    return unsub;
  }, []);

  return { transactions, loading };
};
