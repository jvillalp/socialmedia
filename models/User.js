const mongoose = require('mongoose');
//will take in an object with all the fields that we want
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    //want to have an avatar option after they have logged in/signed up
    avatar: {
        type: String
    },
    date: {
        type: Date,
        dafault: Data.now
    }
});

module.exports = User = mongoose.model('user', UserSchema)