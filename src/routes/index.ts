import { Request, Response, Router } from 'express';
import http2 from 'http2';
import cardRouter from './cards';
import userRouter from './users';
import getErrorResponse from '../ErrorMessage';
import auth from '../middlewares/auth';

const router = Router();
router.use('/users', userRouter);
router.use(auth);
router.use('/cards', cardRouter);

router.use('*', (req: Request, res: Response) => res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send(getErrorResponse('Страница не найдена')));

export default router;
