const express = require('express');
const passport = require('passport');
const {
  getAllNotifications,
  getNotificationById,
  deleteNotification,
} = require('./notification.controllers');

const router = express.Router();

router.get(
  '/notification',
  passport.authenticate('jwt', { session: false }),
  getAllNotifications,
);

router.get(
  '/notification/:notificationId',
  passport.authenticate('jwt', { session: false }),
  getNotificationById,
);

router.delete(
  '/notification/:notificationId',
  passport.authenticate('jwt', { session: false }),
  deleteNotification,
);

module.exports = router;
