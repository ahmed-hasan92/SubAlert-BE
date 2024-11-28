const Notification = require('../../models/Notification');
const User = require('../../models/User');

exports.getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    if (!notifications || notifications.length === 0) {
      return res.status(404).json('There are no notifications available');
    }

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.getNotificationById = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const existingNotification = await Notification.findById(notificationId);
    if (!existingNotification) {
      return res.status(404).json('This notification is no longer existed');
    }

    existingNotification.isRead = true;
    await existingNotification.save();

    res.status(200).json(existingNotification);
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const existingNotification = await Notification.findById(notificationId);
    if (!existingNotification) {
      return res.status(404).json('This notification is no longer existed');
    }
    if (!existingNotification.user.equals(req.user._id)) {
      return res
        .status(403)
        .json("You don't have the permission to make this action!");
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { notifications: existingNotification._id },
    });
    await existingNotification.deleteOne();
    res.status(200).json('Deleted');
  } catch (error) {
    next(error);
  }
};
