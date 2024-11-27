const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
});

module.exports = model('User', userSchema);
