import { Request, Response } from 'express';
import * as CategoryService from '../services/category.service';
import catchAsync from '../utils/catchAsync';

export const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();

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
    const category = await CategoryService.getCategoryById(id);

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  },
);

export const getPostsByCategoryId = catchAsync(
  async (req: Request, res: Response) => {
    const { category_id } = req.params;
    const id = parseInt(category_id);

    const posts = await CategoryService.getPostsByCategoryId(id);

    const formattedPosts = posts ? posts.map(CategoryService.formatPost) : [];

    res.status(200).json({
      status: 'success',
      results: (posts ?? []).length,
      data: {
        posts: formattedPosts,
      },
    });
  },
);

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const category = await CategoryService.createCategory(title, description);

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
    const { title, description } = req.body;

    const category = await CategoryService.updateCategory(
      id,
      title,
      description,
    );

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

    await CategoryService.deleteCategory(id);

    res.status(204).json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  },
);
