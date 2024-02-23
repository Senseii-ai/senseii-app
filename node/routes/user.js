const express = require('express');
const addNewUser = require('../controller/user');

const router = express.Router();

router.route('/').get(addNewUser);

module.exports = router;
