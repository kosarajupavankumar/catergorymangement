import express from 'express';
import bodyParser from 'body-parser';
import categoryRoutes from './routes/categoryRoutes';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/api/categories', categoryRoutes);

export default app;
