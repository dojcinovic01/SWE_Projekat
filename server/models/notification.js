const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  }
});
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;