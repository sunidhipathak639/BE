import { Router } from 'express';
import {
  createSubtask,
  getSubtasks,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
} from '../controllers/subtask.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createSubtask);
router.get('/', getSubtasks);
router.get('/:id', getSubtaskById);
router.put('/:id', authenticate, updateSubtask);
router.delete('/:id', authenticate, deleteSubtask);

export default router;
