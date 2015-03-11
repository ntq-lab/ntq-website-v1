'use strict';
var mongoose = require('mongoose'),
    Message = mongoose.model('Message');
    //pageSize = 5;

module.exports.inbox = function (req, res, next) {
    //var page = req.body.page || 0;

    Message.find().sort({
        time: 'desc'
    }).exec().then(function (messages) {
        res.render(req.__enhance.view('message/inbox'), {
            messages: messages
        });
    }, function (err) {
        res.status(500);
        res.end(err);
    });
};
module.exports.read = function (req, res, next) {
    Message.findById(req._params.id).exec().then(function (message) {
        if (message.unread) {
            message.unread = false;
            message.save(function () {
                res.render(req.__enhance.view('message/read'), {
                    message: message
                });
            });
        } else {
            res.render(req.__enhance.view('message/read'), {
                message: message
            });
        }
    }, function (err) {
        res.status(500);
        res.end(err);
    });
};