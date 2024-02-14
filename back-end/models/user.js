const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required:true,  unique:true},
    password: {type:String, required:true, min:8},
    friends: [{type:Schema.Types.ObjectId, ref: 'User'}]
});



const UserModel = model('User', UserSchema);

module.exports = UserModel;