const Movie = require('../models/movie');
const { MongoServerError } = require('mongoose').mongo;
const { HTTP_CREATED } = require('../utils/constants');
const { NotFoundError, ForbiddenError, DuplicateError } = require('../utils/errors');
const { noVersionKeyProjection, noVersionKeyOptions } = require('../utils/utils');

function checkMovieNotNull(movie, movieId) {
  if (!movie) {
    throw new NotFoundError(`Запрашиваемый фильм не найден. MovieId: ${movieId}`);
  }
}

function checkDuplicateError(error) {
  if (error instanceof MongoServerError && error.code === 11000) {
    return new DuplicateError('Фильм с таким movieId уже зарегистрирован у пользователя');
  }
  return error;
}

function checkMovieOwner(movie, userId) {
  if (movie.owner.id !== userId) {
    throw new ForbiddenError(`Фильм принадлежит другому пользователю. MovieId:${movie._id}.`);
  }
}

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie
    .find({ owner: _id }, noVersionKeyProjection)
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const { _id } = req.user;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: _id,
    })
    .then((movie) => {
      const result = movie.toJSON(noVersionKeyOptions);
      res.status(HTTP_CREATED).send(result);
    })
    .catch((error) => next(checkDuplicateError(error)));
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.user;
  const { movieId } = req.params;

  Movie
    .findById(movieId)
    .populate('owner')
    .then((movie) => {
      checkMovieNotNull(movie, movieId);
      checkMovieOwner(movie, _id);
      return movie.deleteOne().then(() => res.send({ message: 'Фильм удалён' }));
    })
    .catch(next);
};
