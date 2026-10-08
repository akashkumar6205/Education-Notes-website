import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes.js';
// import notesRoutes from './routes/notes.routes.js';
import notesRoutes from './routes/notes.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', notesRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Notes API Server is running' });
});

// Error handling
app.use(errorHandler);

export default app;

