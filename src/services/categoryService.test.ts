import categoryModel from '../models/categoryModel';
import { createCategory, updateCategory, deleteCategory, getTree } from './categoryService';

jest.mock('../models/categoryModel');

describe('Category Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a category successfully', async () => {
    const categoryData = { name: 'Test Category' };
    const savedCategory = { _id: '1', ...categoryData, save: jest.fn() };
    (categoryModel as jest.Mocked<typeof categoryModel>).mockImplementation(() => savedCategory);

    const result = await createCategory(categoryData);

    expect(result).toEqual(savedCategory);
    expect(savedCategory.save).toHaveBeenCalled();
  });

  it('should handle error during category creation', async () => {
    const categoryData = { name: 'Test Category' };
    (categoryModel as jest.Mocked<typeof categoryModel>).mockImplementation(() => {
      throw new Error('Error creating category');
    });

    await expect(createCategory(categoryData)).rejects.toThrow('Error creating category');
  });

  it('should update a category successfully', async () => {
    const categoryId = '1';
    const updateData = { name: 'Updated Category' };
    const updatedCategory = { _id: categoryId, ...updateData };
    (categoryModel as jest.Mocked<typeof categoryModel>).findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCategory);

    const result = await updateCategory(categoryId, updateData);

    expect(result).toEqual(updatedCategory);
    expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(categoryId, updateData, { new: true });
  });

  it('should handle error during category update', async () => {
    const categoryId = '1';
    const updateData = { name: 'Updated Category' };
    (categoryModel as jest.Mocked<typeof categoryModel>).findByIdAndUpdate = jest.fn().mockImplementation(() => {
      throw new Error('Error updating category');
    });

    await expect(updateCategory(categoryId, updateData)).rejects.toThrow('Error updating category');
  });

  it('should delete a category successfully', async () => {
    const categoryId = '1';
    const category = { _id: categoryId, parentId: null, children: [] };
    (categoryModel as jest.Mocked<typeof categoryModel>).findById = jest.fn().mockResolvedValue(category);
    (categoryModel as jest.Mocked<typeof categoryModel>).deleteOne = jest.fn().mockResolvedValue({});

    await deleteCategory(categoryId);

    expect(categoryModel.findById).toHaveBeenCalledWith(categoryId);
    expect(categoryModel.deleteOne).toHaveBeenCalledWith({ _id: categoryId });
  });

  it('should handle error during category deletion', async () => {
    const categoryId = '1';
    (categoryModel as jest.Mocked<typeof categoryModel>).findById = jest.fn().mockImplementation(() => {
      throw new Error('Error deleting category');
    });

    await expect(deleteCategory(categoryId)).rejects.toThrow('Error deleting category');
  });

  it('should retrieve the category tree successfully', async () => {
    const categories = [
      { _id: '1', name: 'Category 1', parentId: null, children: [] },
      { _id: '2', name: 'Category 2', parentId: '1', children: [] },
    ];
    (categoryModel as jest.Mocked<typeof categoryModel>).find = jest.fn().mockResolvedValue(categories);

    const result = await getTree();

    expect(result).toEqual([
      {
        _id: '1',
        name: 'Category 1',
        parentId: null,
        children: [
          { _id: '2', name: 'Category 2', parentId: '1', children: [] },
        ],
      },
    ]);
  });

  it('should handle error during category tree retrieval', async () => {
    (categoryModel as jest.Mocked<typeof categoryModel>).find = jest.fn().mockImplementation(() => {
      throw new Error('Error retrieving category tree');
    });

    await expect(getTree()).rejects.toThrow('Error retrieving category tree');
  });
});
