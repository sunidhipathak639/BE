import express from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role';
import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
} from '../controllers/project.controller';

const router = express.Router();

router.get('/', authenticate, getAllProjects); // Everyone can view projects
router.post('/', authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), createProject); // Only Admin & Project Manager can create projects
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), updateProject); // Only Admin & Project Manager can update projects
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'PROJECT_MANAGER'), deleteProject); // Only Admin & Project Manager can delete projects

export default router;
