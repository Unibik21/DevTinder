const express = require('express');
const userAuth = require('../middlewares/auth');
const User = require("../models/user")
const ConnectionRequest = require('../models/connectionRequests');
const userRouter= express.Router();

userRouter.get("/user/request/recieved",userAuth,async(req,res)=>{

    try{
        const user = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:user._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoURL","about"]);

        res.send({
            message:"Data Fetched Successfully",
            data:connectionRequest,
        })
    }
    catch(err){
        res.send("ERROR : "+err.message);
    }

});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate('fromUserId',['firstName','lastName','photoURL','about','skills','age','gender'])
        .populate('toUserId',['firstName','lastName','photoURL','about','skills','age','gender']);
        
        const data = connections.map(row => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.send({data});
    }
    catch(err){
        res.send("ERROR : "+err.message);
    }
});

userRouter.get("/user/feed",userAuth,async (req,res)=>{
    try{
        const page = Math.max(parseInt(req.query.page) || 1,1);
        let limit = Math.max(parseInt(req.query.limit) || 10,1);
        limit = limit>50 ? 50:limit;
        const skip = (page-1)*limit;
 
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[{
             fromUserId:loggedInUser._id,
            },{
                toUserId:loggedInUser._id,
            }]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
            connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            _id: {
                $nin: Array.from(hideUserFromFeed),
                $ne: loggedInUser._id
            }
        }).select("firstName lastName age gender skills about photoURL").skip(skip).limit(limit);

        res.send(users);

    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

module.exports = userRouter;