const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const chatModel = new mongoose.Schema({
    chatName: {type: String, trim: true},
    users:[{type: Schema.Types.ObjectId,
    ref: 'User',
    },],
    latestMessage: {
          type: Schema.Types.ObjectId,
          ref: "Message"
  },
  read:{
    type: Boolean,
    default: false
  }
  ,
  },{
    timestamps: true,
  }
  );

const Chat = model('Chat', chatModel);

module.exports = Chat;