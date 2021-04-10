const errorHandler = require('../utils/errorHandler');
const typeBusiness = require('../models/TypeBusiness');
const typeQuestion = require('../models/TypeQuestion');
const userBusiness = require('../models/UserBusiness');
const userQuestion = require('../models/UserQuestion');
const checked = require('../models/Checked');


module.exports.addBusiness = async function(req, res) {
    const addTypeBusiness = new typeBusiness({
        name: req.body.name_business,
        raty: req.body.raty_business,
        number_users: 0
    });

    try {
        await addTypeBusiness.save();
        res.status(201).json(addTypeBusiness);
    } catch(e) {
        errorHandler(res, e)
    }
}


module.exports.addQuestion = async function(req, res) {
    const addTypeQuestion = new typeQuestion({
        id_business: req.body.id_business,
        question: req.body.question,
        lvl: req.body.lvl,
        type_response: req.body.type_response,
        rate: req.body.rate
    });

    try {
        await addTypeQuestion.save();
        res.status(201).json(addTypeQuestion);
    } catch(e) {
        errorHandler(res, e)
    }
}

// получения всех бизнесов
module.exports.outputBusiness = async function(req, res) {
    const business = await typeBusiness.find();
    res.status(201).json(business);
}

// получения всех вопросов(по id бизнеса)
module.exports.outputQuestion = async function(req, res) {
    let question;
    if (req.body.id_business) {
        question = await typeQuestion.find({id_business: req.body.id_business});
    } else {
        question = await typeQuestion.find();
    }
    res.status(201).json(question);
}

// удаление всех бизнесов, ответов, проверок
module.exports.deleteVse = async function(req, res) {
    try {
        await userBusiness.deleteMany();
        await userQuestion.deleteMany();
        await checked.deleteMany();
        res.status(201).json("ok");
    } catch(e) {
        errorHandler(res, e);
    }
}