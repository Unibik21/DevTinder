const express = require('express');
const User = require("./models/user")
const connectDB = require('./config/database')
const app = express();

app.use(express.json());

app.post('/signup',async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added Successfully");
    }
    catch{
        res.status(400).send("User Not Added");
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

app.patch('/user',async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
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



