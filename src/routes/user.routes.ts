import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role';
import { getAllUsers, deleteUser } from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/', authorizeRoles('admin'), getAllUsers);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

export default router;
