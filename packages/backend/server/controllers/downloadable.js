'use strict';

var mongoose = require('mongoose'),
    Folder = mongoose.model('Folder'),
    _ = require('lodash'),
    formidable = require('formidable'),
    fs = require('fs');

module.exports.render = function (req, res, next) {
    res.render(req.__enhance.view('downloadable/list'), {});
};

module.exports.get = function (req, res, next, id) {
    Folder.findOne({
        _id: id
    }).exec().then(function (folder) {
        if (folder) {
            req._folder = folder;
            next();
        } else {
            res.status(404);
        }
    });
};
module.exports.createFolder = function (req, res, next) {
    var name = {};
    for (var i in res.locals.__locale.languages) {
        name[res.locals.__locale.languages[i]] = req.__('New Folder') + ' ' + res.locals.__locale.languages[i];
    }

    var folder = new Folder({
        name: name,
        identifier: new Date().getTime()
    });

    folder.save(function (err) {
        if (err) {
            res.jsonp({
                error: err
            });
        } else {
            res.jsonp({
                folder: folder
            });
        }
    });
};
module.exports.getFolders = function (req, res, next) {
    Folder.find().sort({
        identifier: 'asc'
    }).exec().then(function (folders) {
        res.jsonp({
            folders: folders
        });
    });
};
module.exports.saveFolder = function (req, res, next) {
    var reqTime = req.body._time;

    if (!req._folder._time || req._folder._time < reqTime) {
        req._folder._time = reqTime;

        var folder = _.assign(req._folder, req.body);

        folder.save(function (err) {
            if (err) {
                console.log(err);
                res.status(500);
                res.end();
            } else {
                res.jsonp({
                    folder: folder
                });
            }
        });
    } else {
        console.log('out-of-date data...');
        res.status(403);
    }
};
module.exports.removeFolder = function (req, res, next) {
    for (var i in req._folder.files) {
        if (req._folder.files[i].file) {
            fs.unlink(req.__uploadDir + 'doc/' + req._folder.files[i].file);
        }
    }

    req._folder.remove(function (err) {
        if (err) {
            res.status(500).jsonp({
                err: err
            });
        } else {
            res.jsonp({
                result: true
            });
        }
    });
};
module.exports.uploadFile = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var source = fs.createReadStream(files.file.path);
        var dest = fs.createWriteStream(req.__uploadDir + 'doc/' + fields.name, {
            flags: 'a'
        });

        source.pipe(dest);

        source.on('end', function () {
            fs.unlink(files.file.path);

            res.jsonp({
                file: fields.name
            });
        });

        source.on('error', function (err) {
            res.jsonp({
                error: err
            });
        });
    });
};
module.exports.createFile = function (req, res, next) {
    var index = req._folder.files.length;
    var file = req.body;
    file.identifier = new Date().getTime();

    req._folder.files.push(file);

    req._folder.save(function (err) {
        if (err) {
            res.status(500).jsonp({
                err: err
            });
        } else {
            res.jsonp({
                file: req._folder.files[index]
            });
        }
    });
};
module.exports.updateFile = function (req, res, next) {
    var file = req._folder.files.id(req._params.id);
    file = _.assign(file, req.body);

    req._folder.save(function (err) {
        if (err) {
            res.status(500).jsonp({
                err: err
            });
        } else {
            res.jsonp({
                file: file
            });
        }
    });
};
module.exports.removeFile = function (req, res, next) {
    var file = req._folder.files.id(req._params.id);

    if (file.file) {
        fs.unlink(req.__uploadDir + 'doc/' + file.file);
    }

    file.remove();

    req._folder.save(function (err) {
        if (err) {
            res.status(500).jsonp({
                err: err
            });
        } else {
            res.jsonp({
                result: true
            });
        }
    });
};