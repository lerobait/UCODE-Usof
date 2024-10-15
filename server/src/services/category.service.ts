import { Category } from '../../database/models/Category';
import AppError from '../utils/appError';

export const getAllCategories = async () => {
  return await Category.findAll();
};

export const getCategoryById = async (categoryId: number) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
};

export const createCategory = async (title: string, description?: string) => {
  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const existingCategory = await Category.findOne({ where: { title } });
  if (existingCategory) {
    throw new AppError('Category with this title already exists', 400);
  }

  return await Category.create({ title, description: description ?? '' });
};

export const updateCategory = async (
  categoryId: number,
  title?: string,
  description?: string,
) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  if (title) {
    const existingCategory = await Category.findOne({ where: { title } });
    if (existingCategory && existingCategory.id !== categoryId) {
      throw new AppError('Category with this title already exists', 400);
    }
    category.title = title;
  }

  if (description) {
    category.description = description;
  }

  await category.save();
  return category;
};

export const deleteCategory = async (categoryId: number) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  await category.destroy();
};
