const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movie');

const { login, createUser } = require('../controllers/users');
const { signUpValidation, signInValidation } = require('../middlewares/validation');
const NotFound = require('../errors/allErrors');

router.post('/signup', celebrate(signUpValidation), createUser); // joi valid
router.post('/signin', celebrate(signInValidation), login); // joi valid

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
