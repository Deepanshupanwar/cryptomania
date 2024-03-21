const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const { mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user.js');
const Post = require('./models/post');
const Chat = require('./models/chats.js');
const Message = require('./models/message.js');
const uploader = require("./models/multer");
const cloudinary = require('./models/cloudinary.js');
const { createServer } = require("http");
const { Server } = require("socket.io");
const OnlineUser = require('./models/userOnline.js');


require('dotenv').config();

const app = express();
const salt = bcrypt.genSaltSync(10);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'https://cryptomania-deepanshus-projects-b59175f2.vercel.app'
  }
});


app.use(cors({ credentials: true, origin: 'https://cryptomania-deepanshus-projects-b59175f2.vercel.app' }));
app.use(express.json());
app.use(cookieparser());
app.use('/uploads', express.static(__dirname + '/uploads'));



//test start

app.get('/', async (req, res) => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("hello");
  res.send("<p>hello</p>");
})

//test end

//register start

app.post('/api/register', async (req, res) => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic: "",
      friends: []
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {});

    res.cookie('token', token).json(newUser);
  } catch (error) {
    if (error.code === 11000) {

      res.status(400).json({ error: "Duplicate email address" });
    } else {

      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});


//register end

//login start
app.post('/api/login', async (req, res) => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    const { email, password } = req.body;

    const user_data = await User.findOne({ email })
      .populate({
        path: 'friends',
        select: 'firstName lastName profilePic _id',
      })
      .populate({
        path: 'notifications.sender',
        select: '_id firstName lastName profilePic',
      });
    if (!user_data) {
      return res.status(404).json({ error: 'User not found' });
    }

    const password_check = bcrypt.compareSync(password, user_data.password);
    if (!password_check) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const username = user_data.firstName + ' ' + user_data.lastName;
    const token = jwt.sign({ username, id: user_data.id }, process.env.SECRET, {});

    res.cookie('token', token).json(user_data);
  } catch (error) {

    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//login end

//logout start

app.post('/api/logout', async (req, res) => {
  res.cookie('token', '').json('ok');
})

//logout end

//start get profile

app.get('/api/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await mongoose.connect(process.env.DATABASE_URL);

    const profileData = await User.findById(id).populate({
      path: 'friends',
      select: 'firstName lastName profilePic _id notifications',
    });

    if (!profileData) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profileData);
  } catch (error) {

    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//end get profile

//start remove friend

app.delete('/api/removefriend', async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.SECRET, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await mongoose.connect(process.env.DATABASE_URL);
      const { friend_id } = req.body;
      await User.updateOne({ _id: info.id }, { $pull: { friends: friend_id } });
      await User.updateOne({ _id: friend_id }, { $pull: { friends: info.id } });

      const user_data = await User.findById(info.id).populate({
        path: 'friends',
        select: 'firstName lastName profilePic _id',
      }).populate({
        path: 'notifications.sender',
        select: '_id firstName lastName profilePic',
      });

      res.json(user_data);
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//end remove friend

//start accept friend

app.put('/api/accept', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await mongoose.connect(process.env.DATABASE_URL);

      const { sender_id } = req.body;
      const user = await User.findOne({ _id: info.id });

      if (user?.friends?.includes(sender_id)) {

        const user_data = await User.findById(info.id)
          .populate({
            path: 'friends',
            select: 'firstName lastName profilePic _id',
          })
          .populate({
            path: 'notifications.sender',
            select: '_id firstName lastName profilePic',
          });

        res.json(user_data);
        return;
      }
      await User.updateOne({ _id: info.id }, { $push: { friends: sender_id } });

      await User.updateOne({ _id: sender_id }, { $push: { friends: info.id } });

      await User.updateOne({ _id: info.id }, { $pull: { notifications: { sender: sender_id } } });
      await User.updateOne({ _id: sender_id }, { $pull: { notifications: { sender: info.id } } });

      const user_data = await User.findById(info.id)
        .populate({
          path: 'friends',
          select: 'firstName lastName profilePic _id',
        })
        .populate({
          path: 'notifications.sender',
          select: '_id firstName lastName profilePic',
        });


      res.json(user_data);
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




//end accept friend

//start reject friend

app.delete('/api/reject', async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.SECRET, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await mongoose.connect(process.env.DATABASE_URL);

      const { sender_id } = req.body;

      await User.updateOne({ _id: info.id }, { $pull: { notifications: { sender: sender_id } } });
      await User.updateOne({ _id: sender_id }, { $pull: { notifications: { sender: info.id } } });

      const user_data = await User.findById(info.id)
        .populate({
          path: 'friends',
          select: 'firstName lastName profilePic _id',
        })
        .populate({
          path: 'notifications.sender',
          select: '_id firstName lastName profilePic',
        });




      res.json(user_data);
    });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//end reject friend

//start submit post

app.post('/api/post', uploader.single('file'), async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.SECRET, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token provided' });
        } else {
          return res.status(401).json({ error: 'Invalid token' });
        }
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { caption } = req.body;

      const upload = await cloudinary.v2.uploader.upload(req.file.path);
      await mongoose.connect(process.env.DATABASE_URL);
      await Post.create({ caption, image: upload.secure_url, author: info.id });

      const posts = await Post.find().populate('author').sort({ createdAt: -1 });



      res.json(posts);
    });
  } catch (error) {
    console.error('An error occurred while creating a post:', error);
    res.status(500).json({ error: 'An error occurred, please try again later' });
  }
});



//end submit post

//start get posts

app.get('/api/getPost', async (req, res) => {
  try {

    await mongoose.connect(process.env.DATABASE_URL);

    const posts = await Post.find().populate('author').sort({ createdAt: -1 });



    res.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


//end get posts

//start get users posts
app.get('/api/getPost/:id', async (req, res) => {
  try {

    await mongoose.connect(process.env.DATABASE_URL);

    const { id } = req.params;

    const posts = await Post.find({ author: id }).populate('author').sort({ createdAt: -1 });



    res.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


//end get users posts

//start search users

app.get('/api/search/:input', async (req, res) => {
  try {

    const { input } = req.params;

    await mongoose.connect(process.env.DATABASE_URL);

    const usersData = await User.find({
      $or: [
        { firstName: { $regex: input, $options: 'i' } },
        { lastName: { $regex: input, $options: 'i' } },
      ],
    });



    res.json(usersData);
  } catch (error) {
    console.error('Failed to search users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});


//end search users

//start delete post
app.delete('/api/deletePost', async (req, res) => {
  try {

    const { token } = req.cookies;
    const { post_id } = req.body;

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await mongoose.connect(process.env.DATABASE_URL);

      const postDoc = await Post.findById(post_id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }

      await Post.deleteOne({ _id: post_id });

      const parts1 = postDoc.image.split('/');
      const parts2 = parts1[parts1.length - 1].split('.');
      const path = parts2[0];
      await cloudinary.v2.uploader.destroy(path);

      const posts = await Post.find({ author: info.id })
        .populate('author')
        .sort({ createdAt: -1 });



      res.json(posts);
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//end delete post

//start edit post

app.put('/api/editPost/:userid', async (req, res) => {
  try {

    const { token } = req.cookies;
    const { newCaption, post_id } = req.body;
    const {userid} =req.params;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await mongoose.connect(process.env.DATABASE_URL);

      await Post.updateOne({ _id: post_id }, { $set: { caption: newCaption } });
      var posts
      console.log(userid)
      if(userid === info.id ){
        posts= await Post.find({author: info.id}).populate('author').sort({ createdAt: -1 });
      
      }
      else{
        posts = await Post.find().populate('author').sort({ createdAt: -1 });
      }
      res.json(posts);
    });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//end edit post

//start edit profile

app.put('/api/profileEdit', uploader.single('file'), async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { firstName, lastName } = req.body;

      await mongoose.connect(process.env.DATABASE_URL);

      if (firstName !== undefined) {
        await User.updateOne({ "_id": info.id }, { $set: { firstName: firstName } });
      }

      if (lastName !== undefined) {
        await User.updateOne({ "_id": info.id }, { $set: { lastName: lastName } });
      }

      if (req?.file) {
        const postDoc = await User.findById(info.id);
        if (postDoc.profilePic !== '') {
          const parts1 = postDoc.profilePic.split('/');
          const parts2 = parts1[parts1.length - 1].split('.');
          const path = parts2[0];

          await cloudinary.v2.uploader.destroy(path).catch((error) => {
            console.error("Error destroying cloudinary image:", error);
          });

        }
        const upload = await cloudinary.v2.uploader.upload(req.file.path);
        await User.updateOne({ "_id": info.id }, { $set: { profilePic: upload.secure_url } }).catch((error) => {
          console.error("Error updating user profilePic:", error);
        });
      }

      const user_data = await User.findById(info.id).populate({
        path: 'friends',
        select: 'firstName lastName profilePic _id',
      });



      res.json(user_data);
    });
  } catch (err) {
    console.error('Error editing user profile:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});



//end edit profile

//start handle like

app.put('/api/like', async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { post_id } = req.body;

      await mongoose.connect(process.env.DATABASE_URL);

      const post = await Post.findById(post_id);

      if (post?.likes.includes(info.id)) {

        await Post.updateOne({ _id: post_id }, { $pull: { likes: info.id } });
      } else {

        await Post.updateOne({ _id: post_id }, { $push: { likes: info.id } });
      }

      const updatedPost = await Post.findById(post_id).populate('author');



      res.json(updatedPost);
    });
  } catch (err) {
    console.error('Error handling like action:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//end handle like

//start handle dislike

app.put('/api/dislike', async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { post_id } = req.body;


      await mongoose.connect(process.env.DATABASE_URL);

      const post = await Post.findById(post_id);

      if (post?.dislikes.includes(info.id)) {
        await Post.updateOne({ _id: post_id }, { $pull: { dislikes: info.id } });
      } else {

        await Post.updateOne({ _id: post_id }, { $push: { dislikes: info.id } });
      }

      const updatedPost = await Post.findById(post_id).populate('author');



      res.json(updatedPost);
    });
  } catch (err) {
    console.error('Error handling dislike action:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//end handle dislike

//start create chat

app.post('/api/chats', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { userId } = req.body;

      await mongoose.connect(process.env.DATABASE_URL);
      var isChat = await Chat.find({
        users: {
          $all: [info.id, userId]
        }
      })
      
      if (isChat.length > 0) {
        await Chat.find({ users: { $elemMatch: { $eq: info.id } } })
        .populate({
          path: 'users',
          select: 'firstName lastName profilePic _id',
        })
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(
          async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: 'firstName lastName profilePic _id'
            })
            res.json(results);
          }
        )
      }
      else {
        var chatdata = {
          chatName: "sender",
          users: [userId, info.id]
        }
        const createdChat = await Chat.create(chatdata);
        await Chat.find({ users: { $elemMatch: { $eq: info.id } } })
        .populate({
          path: 'users',
          select: 'firstName lastName profilePic _id',
        })
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(
          async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: 'firstName lastName profilePic _id'
            })
            res.json(results);
          }
        )
      }
    })
  }
  catch (err) {
    console.log(err);
  }
})

//end create chat

//start fetch all chats

app.get('/api/chats', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await mongoose.connect(process.env.DATABASE_URL);
      await Chat.find({ users: { $elemMatch: { $eq: info.id } } })
        .populate({
          path: 'users',
          select: 'firstName lastName profilePic _id',
        })
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(
          async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: 'firstName lastName profilePic _id'
            })
            res.json(results);
          }
        )
    })
  }
  catch (err) {
    console.log(err)
  }
})

//end fetch all chats

//start send message

app.post('/api/message', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { content, chatId } = req.body;
      var newMessage = {
        sender: info.id,
        content: content,
        chat: chatId,
      }
      await mongoose.connect(process.env.DATABASE_URL);
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "firstName lastName profilePic _id");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'firstName lastName profilePic _id'
      });
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id })
      res.json(message)
    })
  }
  catch (err) {
    console.log(err);
  }
})

//end send message

app.get('/api/message/:chatId', async (req, res) => {
  try {
    const { token } = req.cookies;
    const { chatId } = req.params;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await mongoose.connect(process.env.DATABASE_URL);
      const marktrue = await Chat.findById(chatId).populate('latestMessage');
      if(marktrue.latestMessage.sender!==info.id)
      {
        await Chat.findByIdAndUpdate(chatId,{read: true});
      }
      const messages = await Message.find({ chat: chatId }).populate("sender", "firstName lastName profilePic _id").populate("chat").sort({ updatedAt: 1 });
      res.json(messages);
    })
  }
  catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
})

//start get message

//end get message






//start notification with socket io

io.on("connection", (socket) => {
  socket.on('userConnected', async (data) => {
    try {
      const { userId, firstName, lastName, profilePic } = data;
      await mongoose.connect(process.env.DATABASE_URL);
      const alreadyexists= await OnlineUser.find({userId: userId});
      if(alreadyexists.length>0){
        await OnlineUser.findOneAndDelete({userId: userId});
      }
      await OnlineUser.create({
        userId,
        socketId: socket.id,
        firstName,
        lastName,
        profilePic
      });
    
    } catch (err) {
      console.error('Error handling userConnected event:', err);
    }
  });

  socket.on('addFriend', async (payload) => {
    try {
      const { senderId, receiverId } = payload;
      await mongoose.connect(process.env.DATABASE_URL);
      await User.updateOne({ _id: receiverId }, { $push: { notifications: { sender: senderId } } });
      const senderData = await OnlineUser.findOne({ userId: senderId });

      const receiver = await OnlineUser.findOne({ userId: receiverId });
      if (receiver) {
        const data = await User.findById(receiverId).populate({
          path: 'friends',
          select: 'firstName lastName profilePic _id',
        })
          .populate({
            path: 'notifications.sender',
            select: '_id firstName lastName profilePic',
          });;
        io.to(receiver.socketId).emit('friendRequest', data);
      }
      io.to(senderData.socketId).emit('requestsended', { message: 'Request sent successfully' });
    } catch (err) {
      console.error('Error handling addFriend event:', err);
    }
  });

  socket.on('newMessage', async(payload)=>{
    try{
      const {senderId,  receiverId, chatId, content} = payload;
      await mongoose.connect(process.env.DATABASE_URL);
      var newMessage = {
        sender: senderId,
        content: content,
        chat: chatId,
      }
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "firstName lastName profilePic _id");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: 'chat.users',
        select: 'firstName lastName profilePic _id'
      });
      await Chat.findByIdAndUpdate(chatId, { latestMessage:  message});
      await Chat.findByIdAndUpdate(chatId, { read:  false});
      const receiver = await OnlineUser.findOne({ userId: receiverId });
      const senderData = await OnlineUser.findOne({ userId: senderId });
     
      if(receiver)
      {
      
        io.to(receiver.socketId).emit('getMessage', message);
        
      }
      io.to(senderData.socketId).emit('getMessage',  message);
      
    }
    catch(err){
      console.log(err);
    }
  })

  socket.on('disconnect', async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL);
    
      await OnlineUser.findOneAndDelete({ socketId: socket.id });
      
    } catch (err) {
      console.error('Error handling socket disconnection:', err);
    }
  });
});



//end notification with socket io

httpServer.listen(process.env.PORT);