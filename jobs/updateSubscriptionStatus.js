const cron = require('node-cron');
const Subscription = require('../models/Subscription');

// Define the cron job
const updateSubscriptionStatusJob = cron.schedule('0 0 * * *', async () => {
  try {
    const currentDate = new Date();

    await Subscription.updateMany(
      {
        expiryDate: { $lt: currentDate },
        status: 'active',
      },
      { $set: { status: 'expired' } },
    );

    console.log('Subscription statuses updated successfully');
  } catch (error) {
    console.error('Error updating subscription statuses:', error);
  }
});

// Export the job
module.exports = updateSubscriptionStatusJob;
