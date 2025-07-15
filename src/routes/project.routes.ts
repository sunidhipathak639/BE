import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // Protect all routes

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
