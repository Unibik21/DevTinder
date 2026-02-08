const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('../utils/validation');
const userAuth = require('../middlewares/auth')
const authRouter = express.Router();


authRouter.post('/signup',async(req,res)=>{
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

authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId,password} =req.body;
        const user =await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("NOT VALID EMAIL");
        }
        const isPasswordVaild =user.validatePassword(password);
        if(!isPasswordVaild){
            throw new Error("Password Not Valid");
        }
        else{
            const token = await user.getJWT();
            res.cookie("token",token);
            res.send("LOGIN SUCCESSFULL");
        }
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
});

authRouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    }); 
    res.send("Logout Successful");
});

module.exports = authRouter;