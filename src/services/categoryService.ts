import mongoose from 'mongoose';
import CategoryModel from '../models/categoryModel';
import logger from '../config/logger';

export async function createCategory(data: {
  name: string;
  parentId?: mongoose.Types.ObjectId;
}) {
  logger.info('Creating category', { data });

  const category = new CategoryModel({
    name: data.name,
    parentId: data.parentId || null,
  });

  if (data.parentId) {
    const parent = await CategoryModel.findById(data.parentId);
    if (parent) {
      parent.children.push(category._id as mongoose.Types.ObjectId);
      await parent.save();
    }
  }

  const savedCategory = await category.save();
  logger.info('Category created successfully', { category: savedCategory });
  return savedCategory;
}

export async function updateCategory(id: string, data: { name?: string }) {
  logger.info('Updating category', { id, data });

  const updatedCategory = await CategoryModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  logger.info('Category updated successfully', { category: updatedCategory });
  return updatedCategory;
}

export async function deleteCategory(id: string) {
  logger.info('Deleting category', { id });

  const category = await CategoryModel.findById(id);
  if (!category) {
    logger.error('Category not found', { id });
    throw new Error('Category not found');
  }

  if (category.parentId) {
    const parent = await CategoryModel.findById(category.parentId);
    (parent?.children as mongoose.Types.Array<mongoose.Types.ObjectId>).pull(
      category._id as mongoose.Types.ObjectId,
    );
    await parent?.save();
  }

  await CategoryModel.deleteOne({ _id: id });
  logger.info('Category deleted successfully', { id });
}

export async function getTree() {
  logger.info('Retrieving category tree');

  const buildTree = (
    categories: mongoose.Document[],
    parentId: mongoose.Types.ObjectId | null = null,
  ): any =>
    categories
      .filter(
        (cat) => (cat as any).parentId?.toString() === parentId?.toString(),
      )
      .map((cat) => ({
        ...cat.toObject(),
        children: buildTree(categories, cat._id as mongoose.Types.ObjectId),
      }));

  try {
    const allCategories = await CategoryModel.find();
    const tree = buildTree(allCategories);
    logger.info('Category tree retrieved successfully', { tree });
    return tree;
  } catch (error) {
    logger.error('Error retrieving category tree:', (error as Error).message);
    throw new Error('Error retrieving category tree');
  }
}
