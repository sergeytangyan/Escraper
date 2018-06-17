// To be able send emails using GMail from any application (including Node.js) 
// you need to generate application-specific password to access GMail: 
// My Account -> Sign-in & security -> Signing in to Google -> App passwords

const gSend = require('gmail-send');
const configs = require('../configs');
const senderEmail = configs.senderEmail;
const senderPassword = configs.senderPassword;
const receiverEmail = configs.receiverEmail;

const send = gSend(
    {
        user: senderEmail,
        pass: senderPassword,
        to: senderEmail,
        // you also may set array of recipients: 
        // [ 'user1@gmail.com', 'user2@gmail.com' ] 
        // from:    credentials.user             // from: by default equals to user 
        // replyTo: credentials.user             // replyTo: by default undefined 
        subject: 'Generic subject',
        text: 'Something went wrong with the service. Contact me.',
        //html:    '<b>html text</b>'  
    }
);

exports.sendUpdates = (updatedProductList) => {
    return new Promise((res, rej) => {
        console.log('Sending notification');
        updatedProductList.map(el => console.log(el.description));
        // res();
        send({
            subject: 'Product changes',
            text: 'The following products have changed their pricing: \n'
                + JSON.stringify(updatedProductList, null, 2)
        }, (err, result) => {
            err ? rej(err) : res(result);
        });
    });
};
