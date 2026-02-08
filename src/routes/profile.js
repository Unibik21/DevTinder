const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const {validateEditFields} = require('../utils/validation')
const userAuth = require('../middlewares/auth')
const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    const {user} = req;
    try{
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
}); 

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{

    try{
        if(!validateEditFields(req)){
            throw new Error("NOT ALLOWED");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=> loggedInUser[key]=req.body[key]);
        await loggedInUser.save();
        res.send({message : "Profile Updated Successfully!",
            data: loggedInUser,
        })
    }
    catch(err){
        res.status(400).send("ERROR : "+err.meessage);
    }
});


module.exports = profileRouter;