const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required:true,  unique:true},
    password: {type:String, required:true, min:8},
    profilePic:{type: String},
    friends: [{type:Schema.Types.ObjectId, ref: 'User'}],
    notifications: [
        {
          sender: { type: Schema.Types.ObjectId, ref: 'User' },
          timestamp: { type: Date, default: Date.now },
          read: { type: Boolean, default: false },
        },
      ],
});



const UserModel = model('User', UserSchema);

module.exports = UserModel;