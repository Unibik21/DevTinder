const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName){
        throw new Error("Name Field is Empty!");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email Not Valid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password Is Weak!");
    }
};

module.exports = {validateSignUpData, };