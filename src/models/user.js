const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    },
    password:{ 
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        enum:{
            values:["MALE","FEMALE","OTHERS"],
            message: "Provide Gender Details in Capital Letters, Allowed Genders : MALE,FEMALE,OTHERS",
        }
    },
    photoURL:{
        type:String,
        default:"https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png",
        validate(value){
            if(!validator.isURL(value)){
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
},{
    timestamps:true,
});

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({_id:user._id},"CodeCrush@123",{
        expiresIn:"1d",
    });
    return token;
}
userSchema.methods.validatePassword = async function(password){
    const user = this;
    const isPasswordValid = await bcrypt.compare(password,user.password);
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);

module.exports = User;