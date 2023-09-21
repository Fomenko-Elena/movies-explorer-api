const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieIdParam, validateMovie } = require('./validation');

router.get('/', getMovies);
router.post('/', validateMovie, addMovie);
router.delete('/:movieId', validateMovieIdParam, deleteMovie);

module.exports = router;
