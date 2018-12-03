var express = require('express');
var router = express.Router(); 
const UserController = require('../controllers/users.controllers');
const superAdminFeatures = require('../controllers/superAdminfeaturesControllers');

router.get('/list/:userId', UserController.List);
router.get('/listAllUsers/:userId/:permission', UserController.ListAllUsers);
router.get('/listAdmin/:userId/:permission', UserController.ListAdmin);
router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/update/:userId', UserController.updateProfile);
router.post('/updateToAdmin/:userId', superAdminFeatures.changeUserToAdmin);
router.post('/changeAdminToUser/:userId', superAdminFeatures.changeAdminToUser);
// router.use(JWT_Verify.verifyToken);   

module.exports = router;