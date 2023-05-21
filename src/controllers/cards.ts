import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { constants } from 'http2';
import Card from '../models/card';
import getErrorResponse from '../ErrorMessage';
import updater from './updater';

const returnedFields = {
  __v: 0,
};
const populatedFields = 'owner likes';

export const getCards = (req: Request, res: Response) => {
  Card.find({}).populate(populatedFields, returnedFields).select(returnedFields)
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
    });
};

export const createCard = (req: Request, res: Response) => {
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
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send(getErrorResponse('Переданы некорректные данные'));
    }
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
  });
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId, returnedFields)
    .orFail().populate(populatedFields, returnedFields)
    .then((card) => res.send(card))
    .catch((e) => {
      if (e instanceof Error.DocumentNotFoundError) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send(getErrorResponse('Запрашиваемая карточка не найдена'));
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
    });
};

export const addLike = (req: Request, res: Response) => {
  updater(Card, req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, res, 'Запрашиваемая карточка не найдена', returnedFields, populatedFields);
};

export const removeLike = (req: Request, res: Response) => {
  updater(Card, req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, res, 'Запрашиваемая карточка не найдена', returnedFields, populatedFields);
};
