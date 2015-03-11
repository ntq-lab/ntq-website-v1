'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    provider: String,
    google: {}
});

mongoose.model('User', UserSchema);