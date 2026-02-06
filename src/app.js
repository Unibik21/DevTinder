const express = require('express');
const User = require("./models/user")
const connectDB = require('./config/database')
const app = express();

app.post('/signup', (req,res)=>{

    const user = new User({
        firstName:"Unibik",
        lastName:"PC",
        emailId:"unibik@gmail.com",
        password:"12345"
    });


    try{
        user.save();
        res.send("User Added Successfully");
    }
    catch{
        res.status(400).send("User Not Added");
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



