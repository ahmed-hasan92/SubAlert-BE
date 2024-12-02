const express = require('express');
const { register, login, getMyData } = require('./user.controllers');
const passport = require('passport');

const router = express.Router();

router.post('/user/register', register);

router.post(
  '/user/login',
  passport.authenticate('local', { session: false }),
  login,
);

router.get(
  '/user/mydata',
  passport.authenticate('jwt', { session: false }),
  getMyData,
);

module.exports = router;
