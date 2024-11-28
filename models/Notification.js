const { model, Schema } = require('mongoose');

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Notification', notificationSchema);
