import express from 'express';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes'
import commentRoutes from './routes/comment.routes';
import subtaskRoutes from './routes/subtask.routes';
import notificationRoutes from './routes/notification.routes';

import { errorHandler } from './middlewares/errorHandler';
import cors from "cors";




const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('🚀 Welcome to the API');
});
// below your auth routes
app.use('/api/projects', projectRoutes);
// Mount auth route
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subtasks', subtaskRoutes);

app.use('/api/notifications', notificationRoutes)
app.use(errorHandler);
export default app;
