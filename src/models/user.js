const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName :{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    lastName :{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId: {
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        maxLength:50,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("InValid Email");
            }
        },
    },
    password:{ 
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password Not Strong");
            }
        },
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','others','Male','Female'].includes(value)){
                throw new Error("Gender Not Valid");
            }
        },
    },
    photoURL:{
        type:String,
        default:"https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png",
        validate(value){
            if(!validator.isURI(value)){
                throw new Error("InValid PHOTO URL");
            }
        },
    },
    About:{
        type:String,
        default:"Hey There!!!👋",
        maxLength:250,
    },
    skills:{
        type:[String],
    }

});

const User = mongoose.model("User",userSchema);

module.exports = User;