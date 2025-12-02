import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory as deleteCategoryService,
  listenCategories,
  updateCategory as updateCategoryService,
} from '../app/services/category.service';
import { Category } from '../app/type/types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenCategories(
      list => {
        setCategories(list);
        setLoading(false);
      },  
      err => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const addCategory = createCategory;

  const updateCategory = updateCategoryService;
  const deleteCategory = deleteCategoryService;
  
  
  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};
