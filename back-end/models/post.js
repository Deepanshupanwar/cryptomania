const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({ 
    caption:{type:String},
    image:{type:String},
    author:{type: Schema.Types.ObjectId, ref:'User'},
    likes: [{type:Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type:Schema.Types.ObjectId, ref: 'User'}]
}
,{
    timestamps:true,
});

const PostModel = model('Post',PostSchema);

module.exports = PostModel; 