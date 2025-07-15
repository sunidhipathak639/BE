// ./routes/task.routes.ts
import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
