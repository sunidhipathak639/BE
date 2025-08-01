import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
  assignTaskToUser,
  getAssignedTasksPaginated,
} from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role'; // Import authorization middleware

const router = express.Router();

// Routes

// Create Task: Only Admin and Project Manager can create tasks
router.post('/', authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), createTask);

// Get All Tasks: Everyone can view tasks (can be paginated or filtered)
router.get('/', authenticate, getTasks);

// Get Task by ID: Everyone can view a specific task
router.get('/:id', authenticate, getTaskById);

// Update Task: Only Admin and Project Manager can update tasks
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), updateTask);

// Delete Task: Only Admin and Project Manager can delete tasks
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), deleteTask);

// Get Tasks by Project ID: Everyone can view tasks by project (can be paginated or filtered)
router.get('/project/:projectId', authenticate, getTasksByProject);

// Assign Task: Only Admin and Project Manager can assign tasks
router.put("/:taskId/assign", authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), assignTaskToUser);

// Get Assigned Tasks (Paginated): Users can see tasks assigned to them
router.get("/assigned", authenticate, getAssignedTasksPaginated);

export default router;
