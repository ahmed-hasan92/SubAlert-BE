require('dotenv').config();

const port = process.env.PORT;
const express = require('express');
const dataBase = require('./dataBase');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const path = require('path');
const cronJob = require('./jobs/updateSubscriptionStatus');
const passport = require('passport');
const { localStrategy, jwtStrategy } = require('./middlewares/passport');
const userRoutes = require('./api/user/user.routes');
const subscriptionRoutes = require('./api/subscription/subscription.routes');

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use(passport.initialize());
passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

app.use('/api', userRoutes);
app.use('/api', subscriptionRoutes);

app.use('/media', express.static(path.join(__dirname, 'media')));

app.use(errorHandler);
app.use(notFound);

dataBase();
app.listen(port, () => {
  console.log(`The app is running on port: ${port}`);
  cronJob.start();
});
