import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role';
import { getAllUsers, deleteUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorizeRoles('ADMIN'), getAllUsers);
router.patch('/:id', authorizeRoles('ADMIN'), updateUser);
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

export default router;
