'use strict';

var downloadable = require('../controllers/downloadable.js');

module.exports = function (Backend, app, auth, passport, database, enhance) {
    app.param('folderID', downloadable.get);

    app.route(enhance.mount('/downloadables')).get(auth.requiresLogin, downloadable.render);

    app.route(enhance.mount('/api/folder')).post(auth.requiresLogin, downloadable.createFolder);
    app.route(enhance.mount('/api/folder/:folderID'))
        .put(auth.requiresLogin, downloadable.saveFolder)
        .delete(auth.requiresLogin, downloadable.removeFolder);

    app.route(enhance.mount('/api/folders')).get(auth.requiresLogin, downloadable.getFolders);

    app.route(enhance.mount('/api/upload/file'))
        .post(auth.requiresLogin, downloadable.uploadFile);

    app.route(enhance.mount('/api/file/:folderID'))
        .post(auth.requiresLogin, downloadable.createFile);

    app.route(enhance.mount('/api/file/:folderID/:id'))
        .put(auth.requiresLogin, downloadable.updateFile)
        .delete(auth.requiresLogin, downloadable.removeFile);
};