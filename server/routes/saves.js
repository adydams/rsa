var express = require('express');
var router = express.Router(); 
const SavingsController = require('../controllers/savings.controllers');
 
router.get('/list/:userId', SavingsController.List);
router.post('/createplan', SavingsController.createPlan); 
router.post('/withdraw', SavingsController.withdraw);
router.post('/updatePaymentStatus', SavingsController.updatePaymentStatus);

// router.use(JWT_Verify.verifyToken);   
// router.put('/:id', UserController.UpdateProfile);

module.exports = router;
  