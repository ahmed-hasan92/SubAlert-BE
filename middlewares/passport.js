const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { fromAuthHeaderAsBearerToken } = require('passport-jwt').ExtractJwt;

const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false), { message: 'Wrong email address' };
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return done(null, false), { message: 'Wrong Password' };
      }
      return done(null, user);
    } catch (error) {
      done(error);
    }
  },
);

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },

  async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload._id });

      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  },
);

module.exports = { localStrategy, jwtStrategy };
