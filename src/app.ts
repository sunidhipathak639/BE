import express from 'express';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes'

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Welcome to the API');
});
// below your auth routes
app.use('/api/projects', projectRoutes);
// Mount auth route
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
