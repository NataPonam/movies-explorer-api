const userRouter = require('express').Router();
const { celebrate } = require('celebrate');

const {
  createUser, currentUser, updateUser,
} = require('../controllers/users');
const { updateUserProfileValidation } = require('../middlewares/validation');

userRouter.post('/users', createUser);
userRouter.get('/users/me', currentUser); // получить свой профиль
userRouter.patch('/users/me', celebrate(updateUserProfileValidation), updateUser); // изменить свой профиль

module.exports = userRouter;
