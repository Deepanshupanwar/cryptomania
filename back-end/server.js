const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const {mongoose, Schema}  = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user.js');
require('dotenv').config();

const app =express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());


app.get('/', async (req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    console.log("hello");
    res.send("<p>hello</p>");
})



app.listen(process.env.PORT);