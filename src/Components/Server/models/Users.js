const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:String,
    bloodgroup:String,
    email:String,
    phoneNo:String,
    location:String,
    password:String,
})

const UserModel = mongoose.model("UserDB", UserSchema)
module.exports = UserModel