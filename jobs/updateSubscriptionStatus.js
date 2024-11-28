const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const User = require('../models/User');

const sendSubscriptionNotifications = async () => {
  try {
    const currentDate = new Date();
    const twoDaysFromNow = new Date();

    twoDaysFromNow.setDate(currentDate.getDate() + 2);

    const subscriptionsExpiringSoon = await Subscription.find({
      expiryDate: { $gte: currentDate, $lte: twoDaysFromNow },
      status: 'active',
      'notificationsSent.expiringSoon': false,
    });

    for (const subscription of subscriptionsExpiringSoon) {
      const notification = await Notification.create({
        user: subscription.user,
        subscription: subscription._id,
        message: `Your subscription to ${subscription.name} will expire in 2 days.`,
      });

      await User.findByIdAndUpdate(subscription.user, {
        $push: { notifications: notification._id },
      });

      subscription.notificationsSent.expiringSoon = true;
      await subscription.save();
    }

    const expiredSubscriptions = await Subscription.find({
      expiryDate: { $lte: currentDate },
      status: 'active',
      'notificationsSent.expired': false,
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = 'expired';
      await subscription.save();

      const notification = await Notification.create({
        user: subscription.user,
        subscription: subscription._id,
        message: `Your subscription to ${subscription.name} has expired.`,
      });

      await User.findByIdAndUpdate(subscription.user, {
        $push: { notifications: notification._id },
      });

      subscription.notificationsSent.expired = true;
      await subscription.save();
    }
    console.log('All notifications processed successfully.');
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

const subscriptionNotificationJob = cron.schedule('*/1 * * * *', async () => {
  console.log('Running subscription notification job...');
  await sendSubscriptionNotifications();
});

module.exports = subscriptionNotificationJob;
