const movieRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { getMyMovies, postMovie, deleteMovie } = require('../controllers/movie');
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

movieRouter.get('/movies', getMyMovies);
movieRouter.post('/movies', celebrate(createMovieValidation), postMovie);
movieRouter.delete('/movies/:movieId', celebrate(deleteMovieValidation), deleteMovie);

module.exports = movieRouter;
/// написать JOI валидация и подключить
