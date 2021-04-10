const express = require('express');
const controller =require('../controllers/business');
const passport= require('passport');
const router = express.Router();

// localhost:5000/api/game/new_business
router.post('/new_business',
    passport.authenticate('jwt', {session: false}),
    controller.createNewBusiness);

// localhost:5000/api/game/output_business
router.post('/output_business',
    passport.authenticate('jwt', {session: false}),
    controller.outputBusiness);

// localhost:5000/api/game/add_answer
// Добавление ответа
router.post('/add_answer',
    passport.authenticate('jwt', {session: false}),
    controller.addAnswer);

// localhost:5000/api/game/checked_answer
// Получение трех ответов для оценки
router.post('/checked_answer',
    passport.authenticate('jwt', {session: false}),
    controller.checkedAnswer);

// localhost:5000/api/game/hand_check_answer
// Передача трех оцененных ответа
router.post('/hand_check_answer',
    passport.authenticate('jwt', {session: false}),
    controller.handCheckAnswer);

module.exports = router;
