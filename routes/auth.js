const express = require('express')
const { register, login } = require('../Controller/auth');


const router = express.Router()

// Register
router.post('/register', register);

//login
router.post('/login', login);

module.exports = router;
