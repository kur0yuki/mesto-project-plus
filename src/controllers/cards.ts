import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import Card from '../models/card';
import updater from './updater';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import ForbiddenError from '../errors/ForbiddenError';

const returnedFields = {
  __v: 0,
};
const populatedFields = 'owner likes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).populate(populatedFields, returnedFields).select(returnedFields)
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user }).then((card) => {
    card.populate(populatedFields, returnedFields).then((populatedCard) => {
      const { owner, createdAt, likes } = populatedCard;
      res.send({
        name, link, owner, createdAt, likes, _id: populatedCard.id,
      });
    });
  }).catch((e) => {
    if (e instanceof Error.ValidationError) {
      return next(new BadRequestError());
    }
    return next(e);
  });
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId, returnedFields).orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) return next(new ForbiddenError());
      return card.populate(populatedFields, returnedFields)
        .then((populatedCard) => populatedCard.delete())
        .then((deletedCard) => res.send(deletedCard))
        .catch(next);
    })
    .catch((e) => {
      if (e instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }
      return next(e);
    });
};

export const addLike = (req: Request, res: Response, next: NextFunction) => {
  updater(Card, req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, res, next, 'Запрашиваемая карточка не найдена', returnedFields, populatedFields);
};

export const removeLike = (req: Request, res: Response, next: NextFunction) => {
  updater(Card, req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, res, next, 'Запрашиваемая карточка не найдена', returnedFields, populatedFields);
};
