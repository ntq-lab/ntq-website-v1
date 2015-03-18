'use strict';

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    shuffle = require('../config/shuffle-array');

module.exports.render = function (req, res) {

    var colors = ['bg-orange', 'bg-pingo', 'bg-blue', 'bg-blue-light', 'bg-green'],
        color = shuffle(colors);

    Article.find({
        enabled: true,
        languages: res.locals.locale,
    }).sort('-highlighted -time').limit(5).exec().then(function (articles) {
        res.render(req.__enhance.view('index'), {
            articles: articles,
            color: color
        });
    });
};
