const Card = require('../models/card');
const { httpStatusCodes } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const newCard = await Card.create(
      { name: req.body.name, link: req.body.link, owner: req.user },
    );
    return res.status(httpStatusCodes.created).json(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new BadRequestError(`Переданы некорректные данные при создании карточки. ${errors.join(', ')}`));
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      return next(new NotFoundError('Карточка c указанным id не найдена!'));
    }

    if (card.owner.toHexString() === req.user._id) {
      await Card.findByIdAndRemove(id);
      return res.json({ message: 'Карточка удалена' });
    }
    return next(new ForbiddenError('Удаление карточек, добавленных другими пользователями запрещено!'));
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id карточки!'));
    }
    return next(err);
  }
};

const handleCardLike = (action) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { [action]: { likes: req.user._id } },
      { new: true },
    );

    if (!query) {
      return next(new NotFoundError('Карточка c указанным id не найдена!'));
    }
    const updatedCard = await Card.findById(id);
    return res.json(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для обработки лайка!'));
    }
    return next(err);
  }
};

module.exports = {
  getCards, createCard, deleteCard, handleCardLike,
};
