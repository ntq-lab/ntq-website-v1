'use strict';

var mongoose = require('mongoose'),
    Folder = mongoose.model('Folder');

module.exports = function (req, res) {
    Folder.find({
        enabled: true
    }).sort({
        identifier: 'asc'
    }).exec().then(function (data) {
        res.render(req.__enhance.view('download'), {
            listFolders: data
        });
    });
};