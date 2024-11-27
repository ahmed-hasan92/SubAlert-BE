const express = require('express');
const { register, login } = require('./user.controllers');
const passport = require('passport');

const router = express.Router();

router.post('/user/register', register);

router.post(
  '/user/login',
  passport.authenticate('local', { session: false }),
  login,
);

module.exports = router;
