'use strict';

module.exports.render = function (req, res) {
    res.render(req.__enhance.view('about'), {});
};