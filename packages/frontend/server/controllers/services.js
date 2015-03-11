'use strict';

module.exports.render = function (req, res) {
    var flagMessage = req.query.result;

    res.render(req.__enhance.view('services'), {
        flagMessage: flagMessage
    });
};