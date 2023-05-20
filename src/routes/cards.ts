import { Router } from 'express';
import {
  addLike, createCard, deleteCardById, getCards, removeLike,
} from '../controllers/cards';

const router = Router();
router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

export default router;
