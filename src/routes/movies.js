const express = require('express');
const movieControllers = require('../controller/movies');
const { validateMovieData, validateMovieId } = require('../middlewares/validations');

const movieRoutes = express.Router();

movieRoutes.get('/', movieControllers.getMovies);
movieRoutes.post('/', validateMovieData, movieControllers.addMovie);
movieRoutes.delete('/:_id', validateMovieId, movieControllers.deleteMovie);

module.exports = {
  movieRoutes,
};
