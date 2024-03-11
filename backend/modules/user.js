const mongoose = require('mongoose');
const {Schema} = mongoose

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        uniqe: true,
    },
    password: String,
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;