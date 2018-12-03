//Require nodemailer
var nodemailer = require('nodemailer');
const recurringSavingsModel = require('../models/recurringSavings');
const recurringPaymentModel = require('../models/payment');
const userModel = require('../models/users');
const moment = require('moment');
moment().format();
var cron = require('node-cron');

// this email notification at 9pm
cron.schedule('0 9 * * *', () => {
    console.log('node cron job running a task every minute');
    emailsNotification();
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});


function sendMail(mailOptions) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adydams@gmail.com',
            pass: '@beautiful1989'
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {} else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function registerEmailBody(bodyObject) {
    return `
   <h3>Hello ${bodyObject.name},</h3>
   <p>Congratulations Your account have been created successfully</p>
   <p>Account Details<br/>
   Name: <span style="color:blue">${bodyObject.name}</span><br/>
   Email: <span style="color:blue">${bodyObject.email}</span><br/>
   Phone: <span style="color:blue">${bodyObject.phoneNumber}</span><br/>
   Token: <p style="color:blue" href="#">${bodyObject.token}</p><br/>
   </p>

   <p><a href="http://localhost:8000/">Visit Savers App by clicking on the link</a></p>
`
}

function updateProfileEmailBody(bodyObject) {
    return `
    <h3>Hello ${bodyObject.name},</h3>
    <p>Do you want to update your profile</p>
    <p>Account Details<br/>
    Name: <span style="color:blue">${bodyObject.name}</span><br/>
    Email: <span style="color:blue">${bodyObject.email}</span><br/>
    Phone: <span style="color:blue">${bodyObject.phoneNumber}</span><br/>
     
    <button href="http://localhost:3000/updateProfile"> click to update profile</button>
 `
}

function emailsNotification(req, res) {
    //if time is 9pm
    //check the next day of payment 
    //if 3 -- 1 day send an email to remind

    //function to display a users savings by userId
    recurringSavingsModel
        .find({
            "nextDateOfdeposit": {
                "$gte": moment(),
                "$lt": moment().add(2, 'days').format('MMM DD YYYY h:mm A'),
            }
        }, (error, notificaionlist) => {
            if (error) {
                return res.json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: null
                })
            }
            if (notificaionlist) {
                notificaionlist.forEach((notificaionlist, element) => {
                    //get users details for the notification userId
                    userId = notificaionlist.userId;
                    userModel
                        .findOne({
                            _id: userId
                        }, (error, user) => {
                            if (error) {
                                return res.json({
                                    'status': false,
                                    'message': 'An Error Occured',
                                    payload: null
                                })
                            }
                            if (user) {
                                var notificaionlistObject = {
                                    name: user.name,
                                    email: user.email,
                                    phoneNumber: user.phoneNumber
                                }
                                sendMail({
                                    from: 'support@riby.me',
                                    to: notificaionlistObject.email,
                                    subject: 'This is to kindly remind you that your payment date for recurring savings',
                                    html: registerEmailBody({
                                        name: notificaionlistObject.name,
                                        email: notificaionlistObject.email,
                                        phoneNumber: notificaionlistObject.phoneNumber
                                    })
                                })
                            }
                        })
                })
            }
        })

    // if it is late already send a warning message
    if (moment()) {

    }
}
module.exports = {
    sendMail,
    registerEmailBody,
    updateProfileEmailBody,
    emailsNotification
}