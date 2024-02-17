const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const {mongoose, Schema}  = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user.js');
require('dotenv').config();

const app=express();
const salt = bcrypt.genSaltSync(10);
const secret= process.env.SECRET;

app.use(cors());
app.use(express.json());
app.use(cookieparser());

//test start

app.get('/', async (req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    console.log("hello");
    res.send("<p>hello</p>");
})

//test end

//register start

app.post('/register', async (req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {firstName, lastName, email, password} = req.body;
    try{
        const user_data = await User.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password,salt),
            friends: []
        });
        const username = firstName +' '+ lastName;  
        jwt.sign({username, id: user_data.id},secret, {}, (err, token)=>{
            if(err)
            {
                throw err;
            }
            res.cookie(token).json(user_data);
        })
    }
    catch (e){
        res.status(400).json(e);
    }
    
})

//register end

//login start
app.post('/login',async (req,res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {email, password} = req.body;
    const user_data = await User.findOne({email:email});
    const password_check = bcrypt.compareSync(password, user_data.password);
    if(password_check)
    {
        const username = user_data.firstName + ' ' + user_data.lastName;
        jwt.sign({username, id: user_data.id}, secret , {} , (err, token)=>{
            if(err){
                throw err;
            }
            res.cookie(token).json(user_data)
        })
    }
    else{
        res.status(400).json('wrong credentials');
    }
})
//login end



app.listen(process.env.PORT);