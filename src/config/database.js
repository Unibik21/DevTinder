const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Unibik:Maduak%402004@codecrush.lemsgk1.mongodb.net/StackMate");
};

module.exports = connectDB;

