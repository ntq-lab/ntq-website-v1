'use strict';

var mongoose = require('mongoose');

var FolderSchema = new mongoose.Schema({
    name: {},
    identifier: {
        type: Number,
        required: true
    },
    enabled: Boolean,
    _time: Number,
    files: [{
        name: {},
        identifier: {
            type: Number,
            required: true
        },
        file: String,
        size: Number
    }]
}, {
    //safe: {
    //    w: 'majority',
    //    fsync: true
    //},
    //fsync: true,
    //versionKey: false
});

mongoose.model('Folder', FolderSchema);