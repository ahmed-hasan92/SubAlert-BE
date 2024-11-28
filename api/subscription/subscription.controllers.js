const Notification = require('../../models/Notification');
const Subscription = require('../../models/Subscription');
const User = require('../../models/User');

exports.addSubscription = async (req, res, next) => {
  try {
    const subscriptionName = req.body.name.trim().toLowerCase(); // Normalize input to lowercase
    const existingSubscription = await Subscription.findOne({
      name: { $regex: new RegExp(`^${subscriptionName}$`, 'i') }, // Case-insensitive search
      user: req.user._id,
    });

    if (existingSubscription) {
      return res.status(403).json('This subscription already exists!');
    }

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }

    const newSubscription = await Subscription.create({
      name: req.body.name.trim(), // Save the original case for display purposes
      image: imagePath,
      startDate: req.body.startDate,
      expiryDate: req.body.expiryDate,
      amount: req.body.amount,
      user: req.user._id,
    });

    const newNotification = await Notification.create({
      user: req.user._id,
      subscription: newSubscription._id,
      message: `A new subscription: ${newSubscription.name} has been added`,
    });

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          subscriptions: newSubscription._id,
          notifications: newNotification._id,
        },
      },
    );

    res.status(201).json('A new subscription has been successfully added');
  } catch (error) {
    next(error);
  }
};

exports.getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id });

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json('There are no available subscriptions');
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptionById = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    const existingSubscription = await Subscription.findById(subscriptionId);

    if (!existingSubscription) {
      return res.status(404).json('This subscription is not found!');
    }

    res.status(200).json(existingSubscription);
  } catch (error) {
    next(error);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const existingSubscription = await Subscription.findById(subscriptionId);

    if (!existingSubscription) {
      return res.status(404).json('This subscription is not found!');
    }

    if (!existingSubscription.user.equals(req.user._id)) {
      return res
        .status(403)
        .json('You do not have any permission to make this action');
    }

    existingSubscription.name = req.body.name || existingSubscription.name;
    existingSubscription.amount =
      req.body.amount || existingSubscription.amount;
    existingSubscription.startDate =
      req.body.startDate || existingSubscription.startDate;
    existingSubscription.expiryDate =
      req.body.expiryDate || existingSubscription.expiryDate;

    await existingSubscription.save();

    res.status(200).json('Updated!');
  } catch (error) {
    next(error);
  }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const existingSubscription = await Subscription.findById(subscriptionId);

    if (!existingSubscription) {
      return res.status(404).json('This subscription is not found!');
    }

    if (!existingSubscription.user.equals(req.user._id)) {
      return res
        .status(403)
        .json('You do not have any permission to make this action');
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { subscriptions: existingSubscription._id },
    });

    await existingSubscription.deleteOne();
    res
      .status(200)
      .json(
        `The subscription: ${existingSubscription.name} has been successfully deleted!`,
      );
  } catch (error) {
    next(error);
  }
};
