const Movie = require('../models/movie');
const { RequestError, NotFoundError, ForbiddenError } = require('../errors');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const usersMovies = movies.filter((movie) => movie.owner.equals(req.user._id));
      res.send({ data: usersMovies });
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
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
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new RequestError('Data is not valid or Bad request'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(`There is no movie with id ${req.params.movieId}`);
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('You can delete only your movies'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'The movie was deleted' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
