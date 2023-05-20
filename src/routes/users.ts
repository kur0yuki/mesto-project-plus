import { Router } from 'express';
import {
  createUser, getUserById, getUsers, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avarar', updateUserAvatar);

export default router;
