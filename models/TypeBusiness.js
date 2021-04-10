const {Schema, model} = require('mongoose');


const businessSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    raty: {
        type: Number,
        required: true
    },
    number_users: {
        type: Number,
        required: true
    }
});

module.exports = model('type_business', businessSchema);