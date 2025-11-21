import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '../../../../components/icon';
import { ICONS, COLORS } from '../../../../constants/constants';

const AddCategory: React.FC = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<'form' | 'icon' | 'color'>('form');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const renderIconSelection = () => (
     <View style={styles.container}>
        <View style={styles.header}>
             <TouchableOpacity onPress={() => setStep('form')} style={styles.iconButton}>
                <MaterialIcons name="arrow-back" size={24} color="#111418" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chọn biểu tượng</Text>
            <View style={{width: 40}} />
        </View>
        <View style={styles.searchContainer}>
             <View style={styles.searchBar}>
                <MaterialIcons name="search" size={24} color="#9ca3af" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Tìm kiếm biểu tượng" placeholderTextColor="#9ca3af" />
             </View>
        </View>
        <ScrollView contentContainerStyle={styles.gridContent}>
            <Text style={styles.sectionTitle}>Ăn uống</Text>
            <View style={styles.grid}>
                {ICONS.map(icon => (
                    <TouchableOpacity 
                        key={icon} 
                        onPress={() => setSelectedIcon(icon)}
                        style={[styles.gridItem, selectedIcon === icon && styles.gridItemActive]}
                    >
                        <MaterialIcons name={icon as any} size={32} color={selectedIcon === icon ? '#3c83f6' : '#374151'} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
        <View style={styles.bottomAction}>
             <TouchableOpacity onPress={() => setStep('form')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Xác nhận</Text>
             </TouchableOpacity>
        </View>
     </View>
  );

  const renderColorSelection = () => (
     <View style={styles.container}>
        <View style={styles.header}>
             <TouchableOpacity onPress={() => setStep('form')} style={styles.iconButton}>
                <MaterialIcons name="arrow-back" size={24} color="#111418" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chọn màu sắc</Text>
            <View style={{width: 40}} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.colorGrid}>
                {COLORS.map(color => (
                    <TouchableOpacity 
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        style={[styles.colorItem, { backgroundColor: color }, selectedColor === color && styles.colorItemActive]}
                    />
                ))}
                 <TouchableOpacity style={[styles.colorItem, styles.addColorItem]}>
                    <MaterialIcons name="add" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </View>
        </ScrollView>
         <View style={styles.bottomAction}>
             <TouchableOpacity onPress={() => setStep('form')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Xác nhận</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => setStep('form')} style={styles.textButton}>
                <Text style={styles.textButtonText}>Hủy</Text>
             </TouchableOpacity>
         </View>
     </View>
  );

  if (step === 'icon') return renderIconSelection();
  if (step === 'color') return renderColorSelection();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111418" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm danh mục</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Icon danh mục</Text>
            <TouchableOpacity onPress={() => setStep('icon')} style={styles.selectInput}>
              <View style={styles.selectIconBox}>
                <MaterialIcons name={(selectedIcon as any) || 'category'} size={20} color="#6b7280" />
              </View>
              <Text style={styles.selectText}>Chọn biểu tượng</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.label}>Tên danh mục</Text>
            <TextInput style={styles.textInput} placeholder="Ví dụ: Cà phê, Quần áo" placeholderTextColor="#9ca3af" />
          </View>

          <View>
            <Text style={styles.label}>Màu sắc danh mục</Text>
            <TouchableOpacity onPress={() => setStep('color')} style={styles.selectInput}>
              <View style={[styles.colorPreview, { backgroundColor: selectedColor || '#e5e7eb' }]} />
              <Text style={styles.selectText}>Chọn màu sắc</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.label}>Ngân sách danh mục</Text>
            <View style={styles.moneyInputWrapper}>
              <TextInput style={styles.moneyInput} placeholder="Nhập ngân sách (tùy chọn)" placeholderTextColor="#9ca3af" keyboardType="numeric" />
              <Text style={styles.currencySymbol}>₫</Text>
            </View>
          </View>
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Lưu danh mục</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.textButton}>
            <Text style={styles.textButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(245, 247, 248, 0.9)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111418',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  gridContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111418',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  gridItemActive: {
    backgroundColor: 'rgba(60, 131, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3c83f6',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  colorItemActive: {
    borderWidth: 4,
    borderColor: 'rgba(60, 131, 246, 0.3)',
  },
  addColorItem: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(245, 247, 248, 0.95)',
  },
  form: {
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  selectIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectText: {
    flex: 1,
    color: '#6b7280',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111418',
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
  },
  moneyInputWrapper: {
    justifyContent: 'center',
  },
  moneyInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    height: 48,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 16,
    color: '#111418',
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    color: '#6b7280',
    fontSize: 16,
  },
  formActions: {
    marginTop: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3c83f6',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    color: '#3c83f6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddCategory;