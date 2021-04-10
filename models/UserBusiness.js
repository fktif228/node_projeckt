const {Schema, model} = require('mongoose');


const userBusinessSchema = new Schema({
    id_user: {
        type: String,
        required: true
    },
    id_business: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = model('user_business', userBusinessSchema);