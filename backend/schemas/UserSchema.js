const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional, not required for Google logins
  googleId: { type: String }, // Optional, only for Google logins
  theme: { type: String, default: "light" },
  currency: { type: String, default: "INR" },
  chartType: { type: String, default: "candle" },
  notifications: { type: Boolean, default: true },
  funds: { type: Number, default: 100000.00 },
  usedMargin: { type: Number, default: 0.00 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = { UserSchema };
