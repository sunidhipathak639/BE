import express from 'express';
import {
  createComment,
  getComments,
  getCommentById,
  getCommentsByTask,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/', getComments);
router.get('/task/:taskId', getCommentsByTask);
router.get('/:id', getCommentById);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
