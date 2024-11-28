const { model, Schema } = require('mongoose');

const subscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  notificationsSent: {
    expiringSoon: { type: Boolean, default: false }, // Tracks "expiring soon" notifications
    expired: { type: Boolean, default: false }, // Tracks "expired" notifications
  },
});

// Middleware to update status before saving
subscriptionSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.status = currentDate > this.expiryDate ? 'expired' : 'active';
  next();
});

module.exports = model('Subscription', subscriptionSchema);
