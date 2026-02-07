const express = require('express');
const User = require("./models/user");
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt =require('jsonwebtoken')
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup',async(req,res)=>{
    
    try{
        validateSignUpData(req);
        const {firstName,lastName,emailId,password} = req.body;
        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:hashPassword,
        });
        await user.save();
        res.send("User Added Successfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
});

app.post("/login",async (req,res)=>{
    try{
        const {emailId,password} =req.body;
        const user =await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("NOT VALID EMAIL");
        }
        const isPasswordVaild =await bcrypt.compare(password,user.password);
        if(!isPasswordVaild){
            throw new Error("Password Not Valid");
        }
        else{
            const token = jwt.sign({_id:user._id},"CodeCrush@123");
            res.cookie("token",token);
            res.send("LOGIN SUCCESSFULL");
        }
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
});

app.get("/profile",async(req,res)=>{

    try{
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("PLEASE LOGIN");
        }
        const decoded = jwt.verify(token,"CodeCrush@123");
        const {_id} = decoded;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("NO USER FOUND");
        }
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
});

app.get('/feed',async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);    
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});

app.delete('/user',async(req,res)=>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully!");
    }   
    catch(err){
        res.status(400).send("Something went wrong!"); 
    }
});

app.patch('/user/:userId',async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ['photoURL','About','skills','age','gender'];
        const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));

        if(!isUpdateAllowed){
            throw new Error("UPDATE NOT ALLOWED");
        }

        if(data?.skills.length>10){
            throw new Error("MAXIMUM 10 SKILLS ALLOWED");
        }

        await User.findByIdAndUpdate(userId,data,{runValidators:true});
        res.send("User Updated Successfully");
    }
    catch(err){
        res.status(400).send("User Not Updated");
    }
})

connectDB()
.then(() => {
    console.log("Server Connected Successfully!");
    app.listen(3000,()=>{
        console.log("SERVER RUNNING ON PORT NUMBER 3000");
    });
})
.catch((err) => {
    console.error("Caught Error");
});



