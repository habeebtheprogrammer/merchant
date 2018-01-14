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
    dob: {
        type: String,
    },
    bio: {
        type: String,
    },
    interest: {
        type: [{type:String}]
    },
    avatar: {
        type: String,
    },
    date: {
        type: String,
    }
});

var User = mongoose.model('users', userSchema);

 module.exports = User;
