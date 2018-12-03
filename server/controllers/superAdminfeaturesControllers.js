const UsersModel = require('../models/users');
const SavingsModel = require('../models/savings');

//function to make a users to Admin
function changeUserToAdmin(req, res) {
    let userId = req.params.userId;
    
    UsersModel.findById(userId, (err, user)=>{
        if (err) {
            return res.status(422).json({
                'status': false,
                'message': 'An Error Occured'
            })
        }  
        user.permission = 'Admin'
        user.save((err, newAdmin)=>{
            if (err) {
                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            } 
            return res.status(200).json({status:'true', message: 'New admin created'}) 
        })
    });
}

//function to change an Admin to regular user
function changeAdminToUser(req, res) {
    let userId = req.params.userId;
    
    UsersModel.findById(userId, (err, user)=>{
        if (err) {
            return res.status(422).json({
                'status': false,
                'message': 'An Error Occured'
            })
        }  
        user.permission = 'regularUser'
        user.save((err, newAdmin)=>{
            if (err) {
                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            } 
            return res.status(200).json({status:'true', message: 'Admin has been changed to regular user'}) 
        })
    });
};


module.exports = {
    changeUserToAdmin: changeUserToAdmin,
    changeAdminToUser: changeAdminToUser,
}