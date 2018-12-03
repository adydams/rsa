const UsersModel = require('../models/users');
const SavingsModel = require('../models/savings');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const emailManager = require('../middlewares/mailer');


//function to display a user
function List(req, res) {
    let userId = req.params.userId;
    UsersModel.findById(userId, (err, user) => {
        if (err) {
            return res.status(422).json({
                'status': false,
                'message': 'An Error Occured'
            })
        }
        return res.status(200).send(user)
    })
};

//function to display all users
function ListAllUsers(req, res) {
    let userPermission = req.param.userPermission;
    let userId = req.param.userId;
    if (userPermission == 'Admin' || 'superAdmin') {
        UsersModel.find({}, (err, users) => {
            if (err) {
                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            }
            return res.status(200).send(users)
        })
    } else {
        UsersModel.findById(userId, (err, users) => {
            if (err) {
                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            }
            return res.status(200).send(users)
        })
    }

};

//function to display all Admins
function ListAdmin(req, res) {
    let userPermission = req.params.userPermission;
    let userId = req.params.userId;
    if (userPermission == 'superAdmin') {
        UsersModel.find({
            permission: 'Admin'
        }, (err, admins) => {
            if (err) {
                return res.json({
                    'status': false,
                    'message': 'You are not a Super Admin can\'t view the Admin list'
                })
            }
            return res.status(200).send(admins)
        })
    } else {
        UsersModel.find({
            permission: 'Admin'
        }, (err, admins) => {
            if (err) {
                return res.json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            }
            return res.status(200).send(admins)
        })
    }

};


//function to register a new client
function Register(req, res) {
    var userCreationObject = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: bcrypt.hashSync(req.body.password)
    };
    UsersModel
        .findOne({
            email: req.body.email
        }, (error, User) => {
            if (error) {
                return res.json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: null
                })
            }
            if (User) {
                return res.json({
                    'status': false,
                    'message': 'email already exist',
                    payload: null
                })
            }

            (new UsersModel(userCreationObject)).save((err, object) => {
                if (err) {
                    // drop the error info 
                    res.status(422).json({
                        'status': false,
                        'message': 'An error occured',
                        payload: err
                    })
                } else {

                    var newObject = {
                        name: object.name,
                        email: object.email,
                        phoneNumber: object.phoneNumber,
                        password: bcrypt.hashSync(req.body.password)
                    };
                    //sending emails to registered clients for created account
                    //userCreationObject.password = req.body.password;
                    emailManager.sendMail({
                        from: 'support@riby.me',
                        to: userCreationObject.email,
                        subject: 'Account Successfully Created',
                        html: emailManager.registerEmailBody({
                            name: object.name,
                            email: object.email,
                            phoneNumber: object.phoneNumber,
                            token: object.token,
                        })

                        // 'Your account with riby cooperative has been successfully created '
                        // ,object.token
                        // html:`
                        //         emailManager.registerEmailBody('Your account with riby cooperative has been successfully created ')
                        //       <p href="#">object.token</p> 
                        //` 
                    })

                    return res.status(201).json({
                        'status': true,
                        'message': 'You have successfully registered'
                    });
                }
            });
        })
}


function Login(req, res) {
    UsersModel
        .findOne({
            email: req.body.email
        }, (error, User) => {
            if (error) {
                return res.json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: null
                })
            }
            if (!User) {
                return res.json({
                    'status': false,
                    'message': 'User does not exist, signUp please',
                    payload: null
                })
            }
            if (bcrypt.compareSync(req.body.password, User.password) == false) {
                return res.json({
                    'status': false,
                    'message': 'Invalid password, please try again.',
                    payload: null
                })
            }

            //User.password = "";
            var token = jwt.sign(User.toJSON(), 'process.env.JWT_SECRET', {
                expiresIn: 60 * 60 * 60
            });

            var payload = [{}];
            payload.token;
            payload.user_details;
            return res.status(200).json({
                'status': true,
                'message': 'You have successfully Logged in',
                "token": token,
                "users": User
            })
        });

}

//function to display all users
function updateProfile(req, res) {

    UsersModel.findById(req.params.userId, (err, user) => {
        user.name = req.body.name || user.name,
            user.email = req.body.email || user.email,
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber,
            // user.password = bcrypt.hashSync(req.body.password) || user.password 
            user.accountNumber = req.body.accountNumber || user.accountNumber,
            user.bankName = req.body.bankName || user.bankName

        if (err) {
            return res.status(422).json({
                'status': false,
                'message': 'An Error Occured'
            })
        }

        user.save((err, saved) => {
            if (err) {

                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            }
            return res.status(200).send({
                'status': true,
                'message': 'Successfully updated',
                'user': saved
            });
        })


    })
}



module.exports = {
    Register: Register,
    Login: Login,
    List: List,
    updateProfile: updateProfile,
    ListAllUsers: ListAllUsers,
    ListAdmin: ListAdmin
}