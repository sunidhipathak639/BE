import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
  assignTaskToUser,
  getAssignedTasksPaginated
} from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Routes
router.post('/', authenticate, createTask); // Create Task
router.get('/', authenticate, getTasks);    // Get All Tasks (Paginated or All)
router.get('/:id', authenticate, getTaskById); // Get Task by ID
router.put('/:id', authenticate, updateTask);  // Update Task
router.delete('/:id', authenticate, deleteTask); // Delete Task

// Optional: Get Tasks by Project ID
router.get('/project/:projectId', authenticate, getTasksByProject);
router.put("/:taskId/assign",authenticate, assignTaskToUser);
router.get("/assigned",authenticate, getAssignedTasksPaginated);


export default router;
