const errorHandler = require('../utils/errorHandler');


module.exports.by = async function(req, res) {
    res.json({
        id_user: req.user.id,
        category: req.body.category
    });
}