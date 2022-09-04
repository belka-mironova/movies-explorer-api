const express = require('express');
const userControllers = require('../controller/users');
const { validateUserData} = require('../middlewares/validations');

const userRoutes = express.Router();

userRoutes.get('/me', userControllers.getUserInfo);
userRoutes.patch('/me', validateUserData, userControllers.updateUser);

module.exports = {
  userRoutes,
};
