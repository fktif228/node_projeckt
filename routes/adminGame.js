const express = require('express');
const controller =require('../controllers/adminGame');
const passport= require('passport');
const router = express.Router();

// localhost:5000/api/admin/add_business
router.post('/add_business', passport.authenticate('jwt', {session: false}), controller.addBusiness);

// localhost:5000/api/admin/add_question
router.post('/add_question', passport.authenticate('jwt', {session: false}), controller.addQuestion);

// localhost:5000/api/admin/output_business
router.post('/output_business', passport.authenticate('jwt', {session: false}), controller.outputBusiness);

// localhost:5000/api/admin/output_question
router.post('/output_question', passport.authenticate('jwt', {session: false}), controller.outputQuestion);

// localhost:5000/api/admin/delete_vse
router.post('/delete_vse', passport.authenticate('jwt', {session: false}), controller.deleteVse);

module.exports = router;