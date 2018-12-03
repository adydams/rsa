const UsersModel = require('../models/users');
const SavingsModel = require('../models/savings');
const moment = require('moment');
moment().format();

//function to display a users savings by userId
function List(req, res) {
    var userId = req.params.userId;
    SavingsModel.find({
        userId: userId
    }, (err, savings) => {
        if (err) {
            return res.status(422).json({
                'status': false,
                'message': 'An Error Occured'
            })
        }
        if (!savings) {
            return res.json({
                'status': false,
                'message': 'You do not have any savings.'
            })
        }
        if (savings) {

            if (savings.length >= 1) {
                savings.forEach((savings, element) => {
                    if (savings.duration <= 12) {
                        savings.interest = '5%'
                    }
                    if (savings.duration > 12) {
                        savings.interest = '7%'
                    }
                    if (savings.withdrawalStatus == true) {
                        savings.paymentStatus = true;
                    }
                    if (savings.withdrawalStatus == false && savings.paymentStatus == false) {
                        savings.accumulatedInterest = 0;
                    }

                    if (savings.withdrawalStatus == false) {
                        if (savings.paymentStatus == true) {
                            paymentDate = moment(savings.paymentDate);
                            dueDateForWithdrawal = moment(savings.dueDateForWithdrawal);
                            amount = parseInt(savings.amount);
                            amountExpected = parseInt(savings.amountExpected)

                            //calculating days of saving
                            totalSavingDays = dueDateForWithdrawal.diff(paymentDate, 'days')
                            totalInterest = amountExpected - amount

                            //number of days money has been invested so far
                            numOfDays = moment().diff(paymentDate, 'days');

                            //calculate daily interest by dividing total interest with total days
                            calcInterest = (totalInterest / totalSavingDays) * numOfDays;
                            accumulatedInterest = (amount + calcInterest).toFixed(2);
                            savings.accumulatedInterest = accumulatedInterest;
                        }
                    }


                });
            }
        }
        return res.status(200).send({
            'status': true,
            'message': 'Your savings history',
            'savings': savings
        })
        savings.save((err, savings) => {
            if (err) {
                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured'
                })
            }
            return res.status(200).send({
                'status': true,
                'message': 'Your savings history',
                'savings': savings
            })
        })
    })
};




//function to create a new plan
function createPlan(req, res) {
    var planCreationObject = {
        userId: req.body.userId,
        amount: parseInt(req.body.amount),
        savingsPlan: req.body.savingsPlan,
        duration: req.body.duration,
    };

    var durationVal = parseInt(planCreationObject.duration);
    //'Moment Date', moment()
    //'Duration Value', durationVal
    var newDate = moment().add(durationVal, 'months')
    //newDate
    planCreationObject.dueDateForWithdrawal = newDate;

    //calculating interest amount * rate * duration
    //When duration is less than 12 months interest rate= 5%
    //if duration is <= 12 interest rate == 5%
    var duration = Number(planCreationObject.duration);
    var amount = Number(planCreationObject.amount);
    if (duration <= 12) {
        var calcInterest = Math.round(amount * 0.1 * duration);
        planCreationObject.interest = "5%",
            planCreationObject.amountExpected = calcInterest + amount;
    }
    //if duration is <= 24 interest rate == 7%
    //When duration is more than 12 months interest rate= 7%
    else if (duration <= 24 && duration > 12) {
        var calcInterest = Math.round(amount * 1.2 * duration);
        planCreationObject.interest = "7%",
            planCreationObject.amountExpected = calcInterest + amount;

    }
    //if duration is >24 interest rate == 0.05
    else {
        var calcInterest = amount * 2.5 * duration;
        planCreationObject.interest = "7%",
            planCreationObject.amountExpected = calcInterest + amount;
    }

    (new SavingsModel(planCreationObject)).save((err, newSavings) => {
        if (err) {
            return res.status(422).json({
                'status': false,
                'message': 'An Error Occured',
                payload: err
            })
        }
        return res.status(201).json({
            'status': true,
            'message': 'You have created a new savings plan',
            'savings': newSavings
        });
    })

}

function withdraw(req, res) {
    var saveId = req.body.saveId;
    var status = req.body.status;
    SavingsModel.findById(saveId, (error, savings) => {

        if (error) {
            return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            })
        }
        if (savings.withdrawalStatus == true) {

            return res.status(400).json({
                'status': false,
                'message': 'Insufficient balance, you have withdrawn your savings'
            })
        }
        if (status == "true") {
            savings.withdrawalDate = new Date();
            savings.withdrawalStatus = "true";
            savings.amountWithdraw = savings.amount;
            savings.amountWithdraw = savings.amountExpected;

        }

        if (status == "false") {
            savings.withdrawalDate = new Date();
            savings.interest = 0;
            savings.amountWithdraw = savings.amount;
            savings.withdrawalStatus = "true";
        }

        savings.save((err, saved) => {
            if (err) {
                return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: err
                })
            }
            return res.status(201).json({
                'status': true,
                'message': 'You have successfully withdrawn #' + saved.amountWithdraw + ' from your account, Your interest has been deducted',
                'savings': saved
            });
        })
    })

}

function updatePaymentStatus(req, res) {
    var saveId = req.body.saveId;
    paymentObject = {
        saveId: req.body.saveId,
    }

    SavingsModel.findById(req.body.saveId, (err, savings) => {
        if (err) {
            return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            })
        }
        savings.paymentStatus = true;
        savings.save((err, paymentMade) => {
            if (err) {
                return res.json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: null
                })
            }
            return res.status(201).json({
                'status': true,
                'message': 'You have successfully made your payment',
                'payments': paymentMade
            });
        })
    })
}
module.exports = {
    List: List,
    createPlan: createPlan,
    withdraw: withdraw,
    updatePaymentStatus: updatePaymentStatus,
}