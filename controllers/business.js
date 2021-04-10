const errorHandler = require('../utils/errorHandler');
const errorLog = require('../utils/errorLog');
const typeBusiness = require('../models/TypeBusiness');
const typeQuestion = require('../models/TypeQuestion');
const userBusiness = require('../models/UserBusiness');
const userQuestion = require('../models/UserQuestion');
const checked = require('../models/Checked');

const number_review = 3;
const number_answer = 3;


// Создание нового бизнеса, и вопроса к бизнесу
module.exports.createNewBusiness = async function(req, res) {
    const newBusiness = new userBusiness({
        id_user: req.user.id,
        id_business: req.body.id_new_business,
        name: req.body.name_new_business,
    });

    const question = await typeQuestion.findOne({
        id_business: req.body.id_new_business,
        lvl: 1
    });

    const newQuestion = new userQuestion({
        id_user_business: newBusiness.id,
        id_question: question.id,
        lvl: 0,
        answer: "",
        number_checks: 0,
        scores: 0,
        status: "expected_answer", // ожидается ответ
        number_review: 0
    });

    try {
        await newBusiness.save();
        await newQuestion.save();
        res.status(201).json({
            newBusiness,
            newQuestion
        });
    } catch(e) {
        errorHandler(res, e);
    }
}

// получения всех бизнесов по id (или получение одного бизнеса по его айди + его вопроса)
module.exports.outputBusiness = async function(req, res) {
    let answer;
    if (req.body.id_user_business) {
        let user_business = await userBusiness.findOne({
            _id: req.body.id_user_business,
            id_user: req.user.id
        });
        let user_question = await userQuestion.findOne({
            id_user_business: req.body.id_user_business,
        });
        answer = {
            user_business: user_business,
            user_question: user_question
        }
    } else {
        answer = await userBusiness.find({id_user: req.user.id});
    }
    res.status(201).json(answer);
}

//addAnswer
module.exports.addAnswer = async function(req, res) {
    const user_business = await userBusiness.findOne({_id: req.body.id_user_business});

    if (user_business && user_business.id_user === req.user.id) {
        const user_question = await userQuestion.findOne({
            id_user_business: req.body.id_user_business
        });
        if (user_question.status === "expected_answer"){

            user_question.answer = req.body.answer;
            user_question.status = "check";
            user_question.check = "true";
            user_question.number_review = 0;

            try {
                user_question.save();
                res.status(201).json(user_question);
            } catch(e) {
                errorHandler(res, e);
            }
        }
    } else {
        res.status(404).json();
    }
}

Array.prototype.shuffle = function(b) {
    var i = this.length, j, t;
    while( i ) {
        j = Math.floor( ( i-- ) * Math.random() );
        t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
};

// checkedAnswer
module.exports.checkedAnswer = async function(req, res) {
    const user_question = await userQuestion.findOne({_id: req.body.id_user_question})
    const user_business = await userBusiness.findOne({_id: user_question.id_user_business});

    if (user_business.id_user === req.user.id && user_question.check === "true" &&
        user_question.number_review < number_review) {
        let answers = await userQuestion.find({
            status: "check",
            lvl: user_question.lvl
        });

        answers = answers.shuffle();

        let answers_checked = [];
        for (let i = 0; i < number_answer; i++){
            const check = new checked({
                id_answer: answers[i]._id,
                id_checked: req.user.id
            });
            try {
                await check.save();
            } catch(e) {
                errorLog(res, e);
            }
            answers_checked.push({
                id: answers[i]._id,
                answer: answers[i].answer
            });
        }

        try {
            res.status(201).json(answers_checked);
        } catch(e) {
            errorHandler(res, e);
        }

    } else {
        res.status(404).json();
    }
}

//  {answer_id: ["2044", "2043", "2042"], win: "2044"}
module.exports.handCheckAnswer = async function(req, res) {
    for (let i = 0; i < number_answer; i++){
        const check = await checked.findOne({id_answer: req.body.answer_id[i]});
        if (check && check.id_checked === req.user.id) {
            const checked_answer = await userQuestion.findOne({_id: req.body.answer_id[i]});
            checked_answer.number_checks = Number.parseInt(checked_answer.number_checks) + 1;
            console.log(req.body.win);
            console.log(checked_answer._id);
            if (req.body.win == checked_answer._id) {
                console.log("wiinnn");
                checked_answer.scores = Number.parseInt(checked_answer.scores) + 1;
            }
            if (checked_answer.number_checks === 3) {
                checked_answer.status = "appreciated" // ответ оцененн
                if (checked_answer.check === "false") {
                    // повышаем лвл, отчищаем ненужные ячейки
                    /*
                        добавляем ответ в сохраненные
                     */
                    checked_answer.check = "false";
                    checked_answer.lvl = Number.parseInt(checked_answer.lvl) + 1;
                    checked_answer.answer = "";
                    const checked_business = await userBusiness.findOne({_id: checked_answer.id_user_business});
                    const question = await typeQuestion.findOne({
                        lvl: checked_answer.lvl,
                        id_business: checked_business.id_business
                    });
                    checked_answer.id_question = question._id;
                    checked_answer.number_checks = 0;
                    checked_answer.scores = 0;
                    checked_answer.number_review = 0;
                }
            }
            try {
                await checked_answer.save();
            } catch (e) {
                errorLog(res, e);
            }
        }
    }

    const user_question_secondary = await userQuestion.findOne({_id: req.body.win});
    const user_business_secondary = await userBusiness.findOne({_id: user_question_secondary.id_user_business});
    const user_business = await userBusiness.findOne({
        id_user: req.user.id,
        id_business: user_business_secondary.id_business
    });
    const user_question = await userQuestion.findOne({id_user_business: user_business._id});
    user_question.number_review = Number.parseInt(user_question.number_review) + 1;
    if (user_question.number_review === 3) {
        // повышаем лвл, отчищаем ненужные ячейки
        /*
            добавляем ответ в сохраненные
        */
        user_question.check = "false";
        user_question.lvl = Number.parseInt(user_question.lvl) + 1;
        user_question.answer = "";
        const question = await typeQuestion.findOne({
            lvl: user_question.lvl,
            id_business: user_business_secondary.id_business
        });
        user_question.id_question = question._id;
        user_question.number_checks = 0;
        user_question.scores = 0;
        user_question.number_review = 0;
    }

    try {
        await user_question.save();
        res.status(201).json(user_question);
    } catch (e) {
        errorHandler(res, e);
    }
}