'use strict';

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name: {},
    enabled: {
        type: Boolean,
        required: true
    },
    identifier: {
        type: Number,
        required: true
    },
    media: Boolean
});

mongoose.model('Category', CategorySchema);