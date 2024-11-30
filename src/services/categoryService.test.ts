import mongoose from 'mongoose';
import * as categoryService from '../services/categoryService';
import CategoryModel from '../models/categoryModel';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Category Service', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: 'test' });
  });

  afterAll(async () => {
    // Disconnect from the database
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clear the database after each test
    await CategoryModel.deleteMany();
  });

  test('should create a category without a parent', async () => {
    const data = { name: 'Electronics' };
    const category = await categoryService.createCategory(data);

    expect(category).toHaveProperty('_id');
    expect(category.name).toBe(data.name);
    expect(category.parentId).toBeNull();
  });

  test('should create a subcategory with a parent', async () => {
    const parentCategory = await categoryService.createCategory({
      name: 'Electronics',
    });

    const subCategoryData = { name: 'Phones', parentId: parentCategory._id };
    const subCategory = await categoryService.createCategory(subCategoryData);

    const updatedParent = await CategoryModel.findById(parentCategory._id);

    expect(subCategory).toHaveProperty('_id');
    expect(subCategory.name).toBe(subCategoryData.name);
    expect(subCategory.parentId?.toString()).toBe(
      parentCategory._id.toString(),
    );
    expect(updatedParent?.children).toContainEqual(subCategory._id);
  });

  test('should update a category name', async () => {
    const category = await categoryService.createCategory({
      name: 'Electronics',
    });

    const updatedCategory = await categoryService.updateCategory(category._id, {
      name: 'Updated Electronics',
    });

    expect(updatedCategory).toBeTruthy();
    expect(updatedCategory?.name).toBe('Updated Electronics');
  });

  test('should delete a category and update parent', async () => {
    const parentCategory = await categoryService.createCategory({
      name: 'Electronics',
    });

    const subCategory = await categoryService.createCategory({
      name: 'Phones',
      parentId: parentCategory._id,
    });

    await categoryService.deleteCategory(subCategory._id.toString());

    const updatedParent = await CategoryModel.findById(parentCategory._id);
    const deletedSubCategory = await CategoryModel.findById(subCategory._id);

    expect(deletedSubCategory).toBeNull();
    expect(updatedParent?.children).not.toContainEqual(subCategory._id);
  });

  test('should retrieve the category tree', async () => {
    const electronics = await categoryService.createCategory({
      name: 'Electronics',
    });

    // Creating subcategories without storing them in variables
    await categoryService.createCategory({
      name: 'Phones',
      parentId: electronics._id,
    });
    const laptops = await categoryService.createCategory({
      name: 'Laptops',
      parentId: electronics._id,
    });
    await categoryService.createCategory({
      name: 'Accessories',
      parentId: laptops._id,
    });

    const tree = await categoryService.getTree();

    expect(tree.length).toBe(1);
    expect(tree[0].name).toBe('Electronics');
    expect(tree[0].children.length).toBe(2);
    expect(tree[0].children[0].name).toBe('Phones');
    expect(tree[0].children[1].children[0].name).toBe('Accessories');
  });
});
