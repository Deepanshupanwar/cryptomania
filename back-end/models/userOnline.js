const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const OnlineUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true , unique:true },
  socketId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePic: { type: String }
});

const OnlineUser = model('OnlineUser', OnlineUserSchema);

module.exports = OnlineUser;