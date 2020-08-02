const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const knex = require('knex');
const signIn = require('./Endpoints/Signin.js');
const signup = require('./Endpoints/Signup.js');
const profile = require('./Endpoints/Profile.js');
const image = require('./Endpoints/Image.js');
const users = require('./Endpoints/Users.js')
const bcrypt = require('bcrypt');
app.use(bodyParser.json());
app.use(cors());
const saltRounds = 10;
const myPlaintextPassword = 'enzoide';
const someOtherPlaintextPassword = 'not_lupus';


const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'mysql',
    database : 'reactapp1'
  }
});

app.get('/users',(req,res)=>{users.handleUsers(req,res,db)})

app.post('/signin',(req,res)=>{signIn.handleSignIn(req,res,db,bcrypt)});

app.post('/signup',(req,res)=>{signup.handleSignUp(req,res,db,bcrypt)});

app.get('/profile/:id',(req,res)=>{profile.handleProfile(req,res,db)});

app.put('/image',(req,res)=>{image.handleImage(req,res,db)});

app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res)});

app.listen(3009,()=>{
	console.log('app is listening in port 3009');
});