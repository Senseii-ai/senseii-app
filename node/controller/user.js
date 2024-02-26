const UserSchema = require('../models/users');

const addNewUser = async (req, res) => {
  const user = new UserSchema({
    email: 'prateeksingh9741@gmailll.com',
    password: '12345',
  });

  await user.save();
  res.send('User Added successfully');
};

module.exports = addNewUser;
