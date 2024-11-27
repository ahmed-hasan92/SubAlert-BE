const express = require('express');
const passport = require('passport');
const {
  addSubscription,
  getMySubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require('./subscription.controllers');
const upload = require('../../middlewares/multer');

const router = express.Router();

router.post(
  '/subscription',
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  addSubscription,
);

router.get(
  '/subscription',
  passport.authenticate('jwt', { session: false }),
  getMySubscriptions,
);

router.get(
  '/subscription/:subscriptionId',
  passport.authenticate('jwt', { session: false }),
  getSubscriptionById,
);

router.put(
  '/subscription/:subscriptionId',
  passport.authenticate('jwt', { session: false }),
  updateSubscription,
);

router.delete(
  '/subscription/:subscriptionId',
  passport.authenticate('jwt', { session: false }),
  deleteSubscription,
);

module.exports = router;
