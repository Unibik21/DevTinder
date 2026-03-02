const {SendEmailCommand} = require("@aws-sdk/client-ses");
const {sesClient} = require("./sesClient");


const createSendEmailCommand = (toAddress,fromAddress) => {
    return new SendEmailCommand({
        Destination:{
            ToAddresses:[toAddress,],
        },
        Message:{
            Body:{
                Text:{
                    Charset:"UTF-8",
                    Data:"Someone has send you the request!!!"
                }
            },
            Subject:{
                Charset:"UTF-8",
                Data:"REQUEST RECIEVED",
            },
        },
        Source: fromAddress,

    });
};

const run = async()=>{
    const sendEmailCommand =createSendEmailCommand("utkarshcha21@gmail.com","utkarshcha21@gmail.com");

    try{
        return await sesClient.send(sendEmailCommand);
    }
    catch(err){
        throw err;
    }
};

module.exports = {run};