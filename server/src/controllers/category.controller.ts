import { Request, Response } from 'express';
import { Category } from '../../database/models/Category';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await Category.findAll();

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories,
      },
    });
  },
);

export const getCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { category_id } = req.params;

    const id = parseInt(category_id);
    if (isNaN(id)) {
      throw new AppError('Invalid category ID', 400);
    }

    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  },
);

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!title) {
      throw new AppError('Title is required', 400);
    }

    const existingCategory = await Category.findOne({ where: { title } });
    if (existingCategory) {
      throw new AppError('Category with this title already exists', 400);
    }

    const category = await Category.create({ title, description });

    res.status(201).json({
      status: 'success',
      data: {
        category,
      },
    });
  },
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { category_id } = req.params;

    const id = parseInt(category_id);
    if (isNaN(id)) {
      throw new AppError('Invalid category ID', 400);
    }

    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const { title, description } = req.body;

    if (title) {
      const existingCategory = await Category.findOne({ where: { title } });
      if (existingCategory && existingCategory.id !== id) {
        throw new AppError('Category with this title already exists', 400);
      }
      category.title = title;
    }

    if (description) {
      category.description = description;
    }

    await category.save();

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  },
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { category_id } = req.params;

    const id = parseInt(category_id);
    if (isNaN(id)) {
      throw new AppError('Invalid category ID', 400);
    }

    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await category.destroy();

    res.status(204).json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  },
);
