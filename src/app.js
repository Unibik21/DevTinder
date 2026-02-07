const express = require('express');
const User = require("./models/user");
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt =require('jsonwebtoken');
const userAuth = require('./middlewares/auth')
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
            const token = jwt.sign({_id:user._id},"CodeCrush@123",{
                expiresIn:"1d",
            });
            res.cookie("token",token);
            res.send("LOGIN SUCCESSFULL");
        }
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
});

app.get("/profile",userAuth,async(req,res)=>{
    const {user} = req;
    try{
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
}); 
 
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



