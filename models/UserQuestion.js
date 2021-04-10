const {Schema, model} = require('mongoose');


const userQuestionSchema = new Schema({
    id_user_business: {
        type: String,
        required: true
    },
    id_question: {
        type: String,
        required: true
    },
    lvl: {
        type: Number,
        required: true
    },
    answer: {
        type: String,
        required: false,
    },
    number_checks: {
        type: Number,
        required: true
    },
    scores: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    check: {
        type: String,
        required: false
    },
    number_review: {
        type: Number,
        required: false
    }
});

module.exports = model('user_question', userQuestionSchema);