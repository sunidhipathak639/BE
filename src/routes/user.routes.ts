import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role';
import { getAllUsers, deleteUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authenticate, getAllUsers);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
