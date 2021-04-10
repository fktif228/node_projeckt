const {Schema, model} = require('mongoose');


const userGameSchema = new Schema({
    id_user: {
        type: String,
        required: true
    },
    lvl: {
        type: Number,
        required: true
    },
    summa: {
        type: Number,
        required: false
    }
});

module.exports = model('user_game', userGameSchema);