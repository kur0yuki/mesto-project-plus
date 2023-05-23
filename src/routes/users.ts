import { Router } from 'express';
import {
  createUser, getUserById, getUserInfo, getUsers, login, updateUser, updateUserAvatar,
} from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
router.get('/', getUsers);
router.patch('/me', updateUser);
router.get('/me', getUserInfo);
router.get('/:userId', getUserById);
router.patch('/me/avarar', updateUserAvatar);

export default router;
