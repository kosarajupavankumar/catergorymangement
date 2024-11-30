import mongoose from 'mongoose';
import { createCategory, updateCategory, deleteCategory, getTree } from './categoryService';
import CategoryModel from '../models/categoryModel';

jest.mock('../models/categoryModel');

describe('Category Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const categoryData = { name: 'Test Category' };
      const savedCategory = { _id: '1', ...categoryData, save: jest.fn() };
      (CategoryModel as any).mockImplementation(() => savedCategory);

      const result = await createCategory(categoryData);

      expect(result).toEqual(savedCategory);
      expect(savedCategory.save).toHaveBeenCalled();
    });

    it('should handle error during category creation', async () => {
      const categoryData = { name: 'Test Category' };
      (CategoryModel as any).mockImplementation(() => {
        throw new Error('Error creating category');
      });

      await expect(createCategory(categoryData)).rejects.toThrow('Error creating category');
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const categoryId = '1';
      const updateData = { name: 'Updated Category' };
      const updatedCategory = { _id: categoryId, ...updateData };
      (CategoryModel.findByIdAndUpdate as any).mockResolvedValue(updatedCategory);

      const result = await updateCategory(categoryId, updateData);

      expect(result).toEqual(updatedCategory);
      expect(CategoryModel.findByIdAndUpdate).toHaveBeenCalledWith(categoryId, updateData, { new: true });
    });

    it('should handle error during category update', async () => {
      const categoryId = '1';
      const updateData = { name: 'Updated Category' };
      (CategoryModel.findByIdAndUpdate as any).mockImplementation(() => {
        throw new Error('Error updating category');
      });

      await expect(updateCategory(categoryId, updateData)).rejects.toThrow('Error updating category');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      const categoryId = '1';
      const category = { _id: categoryId, parentId: null, children: [] };
      (CategoryModel.findById as any).mockResolvedValue(category);
      (CategoryModel.deleteOne as any).mockResolvedValue({});

      await deleteCategory(categoryId);

      expect(CategoryModel.findById).toHaveBeenCalledWith(categoryId);
      expect(CategoryModel.deleteOne).toHaveBeenCalledWith({ _id: categoryId });
    });

    it('should handle error during category deletion', async () => {
      const categoryId = '1';
      (CategoryModel.findById as any).mockImplementation(() => {
        throw new Error('Error deleting category');
      });

      await expect(deleteCategory(categoryId)).rejects.toThrow('Error deleting category');
    });
  });

  describe('getTree', () => {
    it('should retrieve the category tree successfully', async () => {
      const categories = [
        { _id: '1', name: 'Category 1', parentId: null, children: [] },
        { _id: '2', name: 'Category 2', parentId: '1', children: [] },
      ];
      (CategoryModel.find as any).mockResolvedValue(categories);

      const result = await getTree();

      expect(result).toEqual([
        { _id: '1', name: 'Category 1', parentId: null, children: [{ _id: '2', name: 'Category 2', parentId: '1', children: [] }] },
      ]);
      expect(CategoryModel.find).toHaveBeenCalled();
    });

    it('should handle error during category tree retrieval', async () => {
      (CategoryModel.find as any).mockImplementation(() => {
        throw new Error('Error retrieving category tree');
      });

      await expect(getTree()).rejects.toThrow('Error retrieving category tree');
    });
  });
});
