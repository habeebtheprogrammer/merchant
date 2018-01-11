var mongoose = require('../config/mongoose');
var bcrypt = require('bcrypt');

//user schema
var userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    date: {
        type: String,
    }
});

var User = mongoose.model('users', userSchema);

 module.exports = User;
