'use strict';
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    unread: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Message', MessageSchema);