const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        minLength : 3,
        trim: true,
        maxLength: 30
    },
    password : {
        type : String,
        required : true,
        minLength : 3
    },
    firstName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    }
});

module.exports = mongoose.model('User', UserSchema)