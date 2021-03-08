const express = require('express');

const router = express.Router();

router.use('/fastfinger',require('./auth'));

router.use('/fastfinger',require('./game'));

module.exports = router;