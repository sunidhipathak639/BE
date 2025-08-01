import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role';
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authenticate, getAllUsers); // Only Admin can get all users
router.patch('/:id', authorizeRoles('ADMIN'), updateUser); // Only Admin can update user
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser); // Only Admin can delete user

export default router;
