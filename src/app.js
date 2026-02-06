const express = require('express');
const User = require("./models/user");
const connectDB = require('./config/database');
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('./utils/validation');
const app = express();

app.use(express.json());

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



