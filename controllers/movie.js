const Movie = require('../models/movies');
const { BadRequest, NotFound, Forbidden } = require('../errors/allErrors');
const { MOVIE_ID_NOT_FOUND, NO_DELETE_MOVIE, BAD_REQUEST } = require('../utils/errorTypes');

// показать все сохраненные фильмы
const getMyMovies = (req, res, next) => {
  const idUser = req.user._id;
  Movie.find({ owner: idUser })
    .then((allMovies) => res.send(allMovies))
    .catch(next);
};

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
        return next(new BadRequest(BAD_REQUEST));
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
        next(new NotFound(MOVIE_ID_NOT_FOUND));
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
        next(new Forbidden(NO_DELETE_MOVIE));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST));
      }
      return next(err);
    });
};

module.exports = {
  getMyMovies, postMovie, deleteMovie,
};
