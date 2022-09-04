const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  SALT_ROUND,
  JWT_SECRET,
  JWT_STORAGE_TIME,
} = require("../configs/index");
const { ConflictError, NotFoundError, RequestError } = require("../errors");

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, SALT_ROUND)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
      })
    )
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("User with this email already exists"));
      } else if (err.name === "ValidationError" || err.name === "CastError") {
        next(new RequestError("Bad request"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(`There is no user with id ${req.params.id}`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new RequestError("Data is not valid or Bad request"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: JWT_STORAGE_TIME,
      });
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(`There is no user with ${req.params.id}`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new RequestError("Data is not valid or Bad request"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  updateUser,
  getUserInfo,
};
