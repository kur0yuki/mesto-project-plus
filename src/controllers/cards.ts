import { Request, Response } from 'express';
import { Error } from 'mongoose';
import Card from '../models/card';
import getErrorResponse from '../ErrorMessage';

const returnedFields = {
  __v: 0,
};

export const getCards = (req: Request, res: Response) => {
  Card.find({}).populate('owner', returnedFields).select(returnedFields)
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user }).then((card) => {
    card.populate('owner', returnedFields).then((populatedCard) => {
      const { owner, createdAt, likes } = populatedCard;
      res.send({
        name, link, owner, createdAt, likes, _id: populatedCard.id,
      });
    });
  }).catch((e) => {
    if (e instanceof Error.ValidationError) {
      return res.status(400).send(getErrorResponse('Переданы некорректные данные'));
    }
    return res.status(500).send(getErrorResponse('Ошибка сервера'));
  });
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId, returnedFields).populate('owner', returnedFields)
    .then((card) => {
      if (!card) return res.status(404).send(getErrorResponse('Запрашивая карточка не найдена'));
      return res.send(card);
    })
    .catch(() => {
      res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};

export const addLike = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, { new: true }).select(returnedFields).populate('owner', returnedFields)
    .then((card) => {
      if (!card) return res.status(404).send(getErrorResponse('Запрашивая карточка не найдена'));
      return res.send(card);
    })
    .catch(() => {
      res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};

export const removeLike = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, { new: true }).select(returnedFields).populate('owner', returnedFields)
    .then((card) => {
      if (!card) return res.status(404).send(getErrorResponse('Запрашивая карточка не найдена'));
      return res.send(card);
    })
    .catch(() => {
      res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};
