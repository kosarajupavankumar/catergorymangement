import mongoose from 'mongoose';
import CategoryModel from '../models/categoryModel';

export async function createCategory(data: {
  name: string;
  parentId?: mongoose.Types.ObjectId;
}) {
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

  return category.save();
}

export async function updateCategory(id: string, data: { name?: string }) {
  return CategoryModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteCategory(id: string) {
  const category = await CategoryModel.findById(id);
  if (!category) throw new Error('Category not found');
  if (category.parentId) {
    const parent = await CategoryModel.findById(category.parentId);
    (parent?.children as mongoose.Types.Array<mongoose.Types.ObjectId>).pull(
      category._id as mongoose.Types.ObjectId,
    );
    await parent?.save();
  }
  await CategoryModel.deleteOne({ _id: id });
}

export async function getTree() {
  const buildTree = (
    categories: mongoose.Document[],
    parentId: mongoose.Types.ObjectId | null = null,
  ): any =>
    categories
      .filter((cat) => String((cat as any).parentId) === String(parentId))
      .map((cat) => ({
        ...cat.toObject(),
        children: buildTree(categories, cat._id as mongoose.Types.ObjectId),
      }));

  const allCategories = await CategoryModel.find();
  return buildTree(allCategories);
}
