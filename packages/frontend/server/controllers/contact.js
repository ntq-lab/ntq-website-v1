'use strict';
var mongoose = require('mongoose'),
    Message = mongoose.model('Message');

module.exports.render = function (req, res) {
    var flagMessage = req.query.result || 0,
        email = req.query.email || '';

    res.render(req.__enhance.view('contact'), {
        flagMessage: flagMessage,
        email: email
    });
};

module.exports.create = function (req, res) {
    var urlRedirect = req.body.redirect;

    if(!!req.body.name && !!req.body.email && !!req.body.subject && !!req.body.body) {
        var message = new Message({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            body: req.body.body,
            time: new Date()
        });

        message.save(function () {
            res.redirect(req.__enhance.mount(urlRedirect + '?result=1'));
        });
    } else {
        res.redirect(req.__enhance.mount(urlRedirect + '?result=2'));
    }
};