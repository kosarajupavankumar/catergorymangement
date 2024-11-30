import { Request, Response } from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getTree,
} from '../services/categoryService';

class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const category = await createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await updateCategory(id, req.body);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getCategoriesTree(req: Request, res: Response) {
    try {
      const categories = await getTree();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new CategoryController();
