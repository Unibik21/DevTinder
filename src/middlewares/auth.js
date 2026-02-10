const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async(req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        res.status(401).send("PLEASE LOGIN");
    }
    const decodedObj = jwt.verify(token,"CodeCrush@123");
    const _id = decodedObj._id;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("USER NOT FOUND");
    }
    req.user = user;
    next();
}

module.exports = userAuth;