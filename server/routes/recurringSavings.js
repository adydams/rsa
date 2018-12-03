var express = require('express');
var router = express.Router();
const recurringSavingsController = require('../controllers/recurringSavings.controllers');

router.get('/list/:userId', recurringSavingsController.List);
router.post('/createplan', recurringSavingsController.createPlanRecurring);
router.post('/withdraw', recurringSavingsController.withdraw);
router.post('/updateTotalDeposit', recurringSavingsController.updateTotalDeposit);
router.get('/listPayment/:saveId', recurringSavingsController.paymentList);


// router.use(JWT_Verify.verifyToken);   
// router.put('/:id', UserController.UpdateProfile);

module.exports = router;