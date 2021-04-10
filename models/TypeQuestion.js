const {Schema, model} = require('mongoose');


const questionSchema = new Schema({
    id_business: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    lvl: {
        type: Number,
        required: true
    },
    type_response: {
        type: String,
        required: false
    },
    rate: {
        type: Number,
        required: true
    }
});

module.exports = model('type_question', questionSchema);