const User = require('../../models/User');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const tokenExpirey = process.env.JWT_TOKEN_EXP;

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, secretKey, {
    expiresIn: tokenExpirey,
  });
  return token;
};

exports.register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(403).json('This email is already exist!');
    }

    req.body.password = await hashPassword(req.body.password);

    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.getMyData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json('User data unavailable!');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
