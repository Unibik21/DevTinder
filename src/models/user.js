const mongoose = require("mongoose");

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
        validate(value){
            if(!['male','female','others','Male','Female'].includes(value)){
                throw new Error("Gender Not Valid");
            }
        },
    },
    photoURL:{
        type:String,
        default:"https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png"
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