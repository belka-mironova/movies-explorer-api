const router = require('express').Router();
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors');
const { login, createUser } = require('../controller/users');
const { validateUserSignUp, validateAuthentication } = require('../middlewares/validations');

router.post('/signup', validateUserSignUp, createUser);
router.post('/signin', validateAuthentication, login);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Route doesnt exist'));
});

module.exports = router;
