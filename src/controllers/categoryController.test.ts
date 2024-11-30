import request from 'supertest';
import app from '../app';
import mongoConnection from '../config/dbConfig';
import CategoryModel from '../models/categoryModel';

beforeAll(async () => {
  await mongoConnection.connect();
});

afterAll(async () => {
  await CategoryModel.deleteMany({});
  await mongoConnection.disconnect();
});

describe('CategoryController', () => {
  let categoryId: string;

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics' });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Electronics');
      categoryId = response.body._id;
    });

    it('should return an error if category creation fails', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: 'Updated Electronics' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Electronics');
    });

    it('should return an error if category update fails', async () => {
      const response = await request(app)
        .put('/api/categories/invalidId')
        .send({ name: 'Invalid Update' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete an existing category', async () => {
      const response = await request(app).delete(`/api/categories/${categoryId}`);

      expect(response.status).toBe(204);
    });

    it('should return an error if category deletion fails', async () => {
      const response = await request(app).delete('/api/categories/invalidId');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/categories/tree', () => {
    it('should retrieve the category tree', async () => {
      const response = await request(app).get('/api/categories/tree');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return an error if category tree retrieval fails', async () => {
      jest.spyOn(CategoryModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(app).get('/api/categories/tree');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
});
