const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName,emailId,password} = req.body;

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

const validateEditFields =(req)=>{
    const AllowedEditFields = ['firstName','lastName','age','gender','photoURL','about','skills'];
    const isAllowed = Object.keys(req.body).every((field)=>AllowedEditFields.includes(field));

    return isAllowed;
}

module.exports = {validateSignUpData,validateEditFields };