const express = require('express');
const controller =require('../controllers/category');
const passport= require('passport');
const router = express.Router();

// localhost:5000/api/auth/login
router.post('/uuii', passport.authenticate('jwt', {session: false}), controller.by);

module.exports = router;
