const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: "http://16.170.215.1:3000",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const reqRouter = require('./routes/request');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user')

app.use("/",authRouter);
app.use("/",reqRouter);
app.use("/",profileRouter);
app.use("/",userRouter);

connectDB()
.then(() => {
    console.log("Server Connected Successfully!");
    app.listen(3000,"0.0.0.0",()=>{
        console.log("SERVER RUNNING ON PORT NUMBER 3000");
    });
})
.catch((err) => {
    console.error("Caught Error");
});



