import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parentId?: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

export default mongoose.model<ICategory>('Category', CategorySchema);
