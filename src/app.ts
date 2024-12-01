import express from 'express';
import bodyParser from 'body-parser';
import categoryRoutes from './routes/categoryRoutes';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/api/categories', categoryRoutes);

export default app;
