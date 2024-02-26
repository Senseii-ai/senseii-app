const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email must be provided'],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Users', UserSchema);
