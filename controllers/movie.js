const Movie = require('../models/movies');
const { BadRequest, NotFound, Forbidden } = require('../errors/allErrors');

// показать все сохраненные фильмы
const getMyMovies = (req, res, next) => {
  const idUser = req.user._id;
  Movie.find({ owner: idUser })
    .then((allMovies) => res.send(allMovies))
    .catch(next);
};/// ///POPULATE вспомнить зачем

/* const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
}; */

// const idUser = req.user;
// const idUser = req.user._id;
// owner: req.user._id

// создать фильм
const postMovie = (req, res, next) => {
  const idUser = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: idUser,
  })
    .then((newMovie) => res.status(200).send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные при сохранении фильма'));
      }
      return next(err);
    });
};

// удалить фильм
const deleteMovie = (req, res, next) => {
  const idUser = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFound('По указанному id фильм не найден'));
        return;
      }
      if (movie.owner.toString() === idUser) {
        Movie.deleteOne(movie._id)
          .then(() => {
            res.send({ message: 'Фильм удален' });
          }).catch((err) => {
            next(err);
          });
      } else {
        next(new Forbidden('У Вас нет прав на удаление данного фильма'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMyMovies, postMovie, deleteMovie,
};
