const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["Accepted","Ignored","Interested","Rejected"],
            message:"NOT VALID STATUS"
        },
        required:true,
    },
},{
    timestamps:true
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = ConnectionRequestModel;