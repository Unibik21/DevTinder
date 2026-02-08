const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequests');
const reqRouter = express.Router();

reqRouter.post("/request/send/:status/:userId",userAuth,async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if(fromUserId.equals(toUserId)){
            throw new Error("Can't Send");
        }
        
        const AllowedStatus = ["Interested","Ignored"];

        if(!AllowedStatus.includes(status)){
            throw new Error("INVALID REQUEST");
        }
        
        const toUser = await User.findById(toUserId);

        if(!toUser){
            throw new Error("User Does Not Exist");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId:fromUserId, toUserId:toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
        });

        if(existingConnectionRequest){
            throw new Error("REQUEST ALREADY EXIST");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.send({
            message:`Request Status : ${status}`,
            data,
        });
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

})

module.exports = reqRouter;