// const UsersModel = require('../models/users');
const recurringSavingsModel = require('../models/recurringSavings');
const recurringPaymentModel = require('../models/payment')
const moment = require('moment');
moment().format();
var cron = require('node-cron');

//function to display a users by userId
function List(req, res) {
    var userId = req.params.userId;
    recurringSavingsModel.find({
        userId: req.params.userId
    }, (err, savings) => {
        if (err) {
            return res.json({
                'status': false,
                'message': 'An Error Occured'
            })
        }
        if (!savings) {
            return res.status(200).send({
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
                    if (savings.withdrawalStatus == false && savings.amountDeposited != 0) {

                        amount = parseInt(savings.amount)
                        paymentDate = moment(savings.paymentDate);
                        dueDateForWithdrawal = moment(savings.dueDateForWithdrawal);
                        amountDeposited = parseInt(savings.amountDeposited);
                        amountExpected = parseInt(savings.amountExpected);

                        //calculating days of saving
                        totalSavingDays = dueDateForWithdrawal.diff(paymentDate, 'days')
                        var totalInterest;
                        //number of days money has been invested so far
                        numOfDays = moment().diff(paymentDate, 'days');
                        if (savings.interest == "5%") {
                            totalInterest = (amountDeposited * 0.05)
                        }
                        if (savings.interest == "7%") {
                            totalInterest = (amountDeposited * 0.07)
                        }


                        //calculate daily interest by dividing total interest with total days
                        calcInterest = (totalInterest / totalSavingDays) * numOfDays;
                        accumulatedInterest = (amountDeposited + calcInterest).toFixed(2);
                        savings.accumulatedInterest = accumulatedInterest;

                        //for indicating full payment

                        if (amount == amountDeposited) {
                            savings.depositStatus = "fully paid"
                            savings.paymentStatus = "fully paid"
                        } else {
                            savings.depositStatus = "payment incomplete"
                            savings.paymentStatus = "payment savings up-to-date"
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

    })
};

//function to create a new plan
function makePayment(req, res) {
    paymentObject = {
        saveId: req.body.saveId,
    }
    recurringPaymentModel.save((err, paymentMade) => {
        if (err) {
            return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            })
        }

        return res.status(201).json({
            'status': true,
            'message': 'You have successfully made your continous payment',
            'payments': paymentMade
        });
    })
}

function createPlanRecurring(req, res) {
    var planCreationObject = {
        userId: req.body.userId,
        amount: Number(req.body.amount),
        modeOfPayment: req.body.modeOfPayment,
        amountPerDeposit: Number(req.body.amountPerDeposit),
        amountDeposited: Number(req.body.amountDeposited),
        savingsPlan: req.body.savingsPlan,
        duration: req.body.duration,
    };
    //payment above 2,000,000 not allowed
    if (planCreationObject.amount > 2000000) {
        return res.json({
            'message': 'You can not transfer more than 2 million, Visit the nearest Riby bank'
        });
    }
    //Recurring cannot be less than 5000
    if (planCreationObject.amount < 5000) {
        return res.json({
            'message': 'Recurring savings cannot be less than 5000, apply with fixed savings!'
        });
    }
    //Saving's duration must be greter than 6 months
    if (planCreationObject.duration < 6) {
        return res.json({
            'message': 'Duration must be greater than 6 months'
        });
    } else {
        //calculating duration daily
        if (planCreationObject.modeOfPayment == "daily") {
            if (planCreationObject.amountPerDeposit == 0) {
                paymentDurationInMonth = 0
            }
            if (planCreationObject.amountPerDeposit > 0) {
                var calcPaymentDuration = (planCreationObject.amount / planCreationObject.amountPerDeposit)
                planCreationObject.paymentDuration = Math.round(calcPaymentDuration) + "months"

                var paymentDurationInMonth = Math.round(calcPaymentDuration)
            }

            //savings duration must be greater than  payment duration
            if (planCreationObject.duration < paymentDurationInMonth) {
                return res.json({
                    'message': 'Your savings duration cannot be less than your payment duration'
                });
            }

            //calculating date for repayment 
            var durationVal = parseInt(planCreationObject.duration);
            var payBackDate = moment().add('months', durationVal)
            planCreationObject.dueDateForWithdrawal = payBackDate;

            //calculating balance
            planCreationObject.balance = planCreationObject.amount - planCreationObject.amountDeposited;
            var amount = planCreationObject.amount;
            var amountDeposited = planCreationObject.amountDeposited
            if (amount > amountDeposited) {
                planCreationObject.depositStatus = "payment incomplete";
                planCreationObject.paymentStatus = "payment up-to-date"
                planCreationObject.amountDeposited = planCreationObject.amountDeposited;
            } else {
                planCreationObject.depositStatus == "fully paid";
                planCreationObject.paymentStatus = "fully paid"
            }

            //calculating interest
            //interest for saving for less than or equal to 1year = 5%
            var amount = Number(planCreationObject.amount);
            if (durationVal <= 12) {
                var calcInterest = Math.round(amount * 0.05 * durationVal);
                planCreationObject.interest = "5%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);
            }

            //When duration is more than 12 months (1 year) interest rate= 7%
            else if (durationVal > 12) {
                var calcInterest = Math.round(amount * 0.07 * durationVal);
                planCreationObject.interest = "7%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);

            }


            //checking for next paymentDate and sending warning
            var previousPay = planCreationObject.amountDeposited;
            //comparing date to warn if there is no payment
            dateToday = moment();
            //calculating the next date deposit
            nextDepositDate = moment().add('days', 1)
            planCreationObject.nextDateOfdeposit = nextDepositDate;
        }

        //calculating duration weekly
        if (planCreationObject.modeOfPayment == "weeks") {
            if (planCreationObject.amountPerDeposit == 0) {
                paymentDurationInMonth = 0
            }
            if (planCreationObject.amountPerDeposit > 0) {
                var calcPaymentDuration = (planCreationObject.amount / planCreationObject.amountPerDeposit)
                planCreationObject.paymentDuration = Math.round(calcPaymentDuration) + "months"

                var paymentDurationInMonth = Math.round(calcPaymentDuration)
            }
            //savings duration must be greater than  payment duration
            if (planCreationObject.duration < paymentDurationInMonth) {
                return res.json({
                    'message': 'Your savings duration cannot be less than your payment duration'
                });
            }

            //calculating date for repayment 
            var durationVal = parseInt(planCreationObject.duration);
            var payBackDate = moment().add('months', durationVal)
            planCreationObject.dueDateForWithdrawal = payBackDate;

            //calculating balance
            planCreationObject.balance = planCreationObject.amount - planCreationObject.amountDeposited;
            var amount = planCreationObject.amount;
            var amountDeposited = planCreationObject.amountDeposited
            if (amount > amountDeposited) {
                planCreationObject.depositStatus = "payment incomplete";
                planCreationObject.paymentStatus = "payment savings up-to-date"
                planCreationObject.amountDeposited = planCreationObject.amountDeposited;
            } else {
                planCreationObject.depositStatus == "fully paid";
                planCreationObject.paymentStatus = "fully paid"
            }

            //calculating interest
            //interest for saving for less than or equal to 1year = 5%
            var amount = Number(planCreationObject.amount);
            if (durationVal <= 12) {
                var calcInterest = Math.round(amount * 0.05 * durationVal);
                planCreationObject.interest = "5%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);
            }

            //When duration is more than 12 months (1 year) interest rate= 7%
            else if (durationVal > 12) {
                var calcInterest = Math.round(amount * 0.07 * durationVal);
                planCreationObject.interest = "7%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);

            }


            //checking for next paymentDate and sending warning
            var previousPay = planCreationObject.amountDeposited;
            //comparing date to warn if there is no payment
            dateToday = moment();
            //calculating the next date deposit
            nextDepositDate = moment().add('weeks', 1)
            planCreationObject.nextDateOfdeposit = nextDepositDate;


        }

        //Calculation for months

        if (planCreationObject.modeOfPayment == "months") {
            if (planCreationObject.amountPerDeposit == 0) {
                paymentDurationInMonth = 0
            }
            if (planCreationObject.amountPerDeposit > 0) {
                var calcPaymentDuration = (planCreationObject.amount / planCreationObject.amountPerDeposit)
                planCreationObject.paymentDuration = Math.round(calcPaymentDuration) + "months"

                var paymentDurationInMonth = Math.round(calcPaymentDuration)
            }
            //savings duration must be greater than  payment duration
            if (planCreationObject.duration < paymentDurationInMonth) {
                return res.json({
                    'message': 'Your savings duration cannot be less than your payment duration'
                });
            }

            //calculating date for repayment 
            var durationVal = parseInt(planCreationObject.duration);
            var payBackDate = moment().add('months', durationVal)
            planCreationObject.dueDateForWithdrawal = payBackDate;

            //calculating balance
            planCreationObject.balance = planCreationObject.amount - planCreationObject.amountDeposited;

            var amount = planCreationObject.amount;
            var amountDeposited = planCreationObject.amountDeposited
            if (amount > amountDeposited) {
                planCreationObject.depositStatus = "payment incomplete";
                planCreationObject.paymentStatus = "payment savings up-to-date"
                planCreationObject.amountDeposited = planCreationObject.amountDeposited;
            } else {
                planCreationObject.depositStatus == "fully paid";
                planCreationObject.paymentStatus = "fully paid"
            }




            //calculating interest
            //interest for saving for less than or equal to 1year = 5%
            var amount = Number(planCreationObject.amount);
            if (durationVal <= 12) {
                var calcInterest = Math.round(amount * 0.05 * durationVal);
                planCreationObject.interest = "5%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);
            }

            //When duration is more than 12 months (1 year) interest rate= 7%
            else if (durationVal > 12) {
                var calcInterest = Math.round(amount * 0.07 * durationVal);
                planCreationObject.interest = "7%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);

            }


            //checking for next paymentDate and sending warning
            var previousPay = planCreationObject.amountDeposited;
            //comparing date to warn if there is no payment
            dateToday = moment()
            //calculating the next date deposit
            nextDepositDate = moment().add('months', 1)
            planCreationObject.nextDateOfdeposit = nextDepositDate;
        }


        //Calculation for years

        if (planCreationObject.modeOfPayment == "years") {
            if (planCreationObject.amountPerDeposit == 0) {
                paymentDurationInMonth = 0
            }
            if (planCreationObject.amountPerDeposit > 0) {
                var calcPaymentDuration = (planCreationObject.amount / planCreationObject.amountPerDeposit)
                planCreationObject.paymentDuration = Math.round(calcPaymentDuration) + "months"

                var paymentDurationInMonth = Math.round(calcPaymentDuration)
            }

            //savings duration must be greater than  payment duration
            if (planCreationObject.duration < paymentDurationInMonth) {
                return res.json({
                    'message': 'Your savings duration cannot be less than your payment duration'
                });
            }

            //calculating date for repayment 
            var durationVal = parseInt(planCreationObject.duration / 12);
            var payBackDate = moment().add('years', durationVal)
            planCreationObject.dueDateForWithdrawal = payBackDate;

            //calculating balance
            planCreationObject.balance = planCreationObject.amount - planCreationObject.amountDeposited;

            var amount = planCreationObject.amount;
            var amountDeposited = planCreationObject.amountDeposited;
            if (amount > amountDeposited) {
                planCreationObject.depositStatus = "payment incomplete";
                planCreationObject.paymentStatus = "payment savings up-to-date"
                planCreationObject.amountDeposited = planCreationObject.amountDeposited;
            } else {
                planCreationObject.depositStatus == "fully paid";
                planCreationObject.paymentStatus = "fully paid"
            }




            //calculating interest
            //interest for saving for less than or equal to 1year = 5%
            var amount = Number(planCreationObject.amount);
            if (durationVal <= 12) {
                var calcInterest = Math.round(amount * 0.05 * durationVal);
                planCreationObject.interest = "5%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);
            }

            //When duration is more than 12 months (1 year) interest rate= 7%
            else if (durationVal > 12) {
                var calcInterest = Math.round(amount * 0.07 * durationVal);
                planCreationObject.interest = "7%",
                    planCreationObject.amountExpected = (calcInterest + amount).toFixed(2);

            }


            //checking for next paymentDate and sending warning
            var previousPay = planCreationObject.amountDeposited;
            //comparing date to warn if there is no payment
            dateToday = moment()
            //calculating the next date deposit
            nextDepositDate = moment().add('years', 1)
            planCreationObject.nextDateOfdeposit = nextDepositDate;
        }

        (new recurringSavingsModel(planCreationObject)).save((err, newSavings) => {
            if (err) {
                return res.json({
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

}

//adding on subsequent payment
function updateTotalDeposit(req, res) {

    var saveId = req.body.saveId;
    paymentObject = {
        saveId: req.body.saveId
    }

    recurringSavingsModel.findById(req.body.saveId, (err, recurringPayment) => {
        if (err) {
            return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            })
        }


        amount = parseInt(recurringPayment.amount)
        modeOfPayment = recurringPayment.modeOfPayment
        previousDate = recurringPayment.nextDateOfdeposit
        amountDeposited = parseInt(recurringPayment.amountDeposited)
        amountPerDeposit = parseInt(recurringPayment.amountPerDeposit)
        balance = parseInt(recurringPayment.amountPerDeposit)
        modeOfPayment = recurringPayment.modeOfPayment

        recurringPayment.amountDeposited = amountPerDeposit + amountDeposited
        recurringPayment.balance = amount - parseInt(recurringPayment.amountDeposited)
        
        recurringPayment.nextDateOfdeposit = moment(previousDate, "YYYY-MM-DD").add(1, modeOfPayment)

        if ((amount < amountDeposited) && (moment() >= previousDate) && (newAmountPaid == 0)) {
            recurringPayment.depositStatus = "payment incomplete"
            newAmountPaid = recurringPayment.amountDeposited - amountDeposited

            recurringPayment.paymentStatus = "pending payment";
        }
        if (balance == 0) {
            recurringPayment.depositStatus = "fully paid";
            recurringPayment.paymentStatus = "fully paid";
        }
        if(parseInt(recurringPayment.balance) < 0){
            recurringPayment.balance = 0
        }


        recurringPayment.save((err, recurringPaymentSaved) => {
            if (err) {
                return res.json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: null
                })
            }
            var payment = new recurringPaymentModel(paymentObject);
            recurringPayment.save((err, paymentObject) => {
                if (err) {
                    return res.json({
                        'status': false,
                        'message': 'An Error Occured',
                        payload: null
                    })
                }
                payment.save((err, paymentMade) => {
                    if (err) {
                        return res.json({
                            'status': false,
                            'message': 'An Error Occured',
                            payload: null
                        })
                    }

                    return res.status(201).json({
                        'status': true,
                        'message': 'You have successfully made your continous payment',
                        'payments': paymentMade
                    });
                })
            })
        })
    })

}

//to withdraw
function withdraw(req, res) {
    var saveId = req.body.saveId;
    var status = req.body.status;
    recurringSavingsModel.findById(saveId, (error, savings) => {

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
                return res.json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: err
                })
            }
            return res.status(201).json({
                'status': true,
                'message': 'You have successfully withdrawn #' +
                    saved.amountWithdraw + ' from your account, Your interest has been deducted',
                'savings': saved
            });
        })
    });
}

//to list payment details in recurring payment...
//populating withdrawal's board
function paymentList(req, res) {
    var saveId = req.params.saveId;
    var amountPerDeposit = req.params.amountPerDeposit;
    recurringPaymentModel.find({
        saveId: req.params.saveId,
        amountPerDeposit: req.params.amountPerDeposit
    }, (err, paymentList) => {
        if (err) {
            return res.json({
                'status': false,
                'message': 'An Error Occured'
            })
        } else if (!paymentList) {
            return res.json({
                'status': false,
                'message': 'You do not have any savings.'
            })
        } else {

            return res.json({
                'status': true,
                'message': 'Your savings history',
                'savings': paymentList
            })
        }
    })
};

module.exports = {
    List: List,
    createPlanRecurring: createPlanRecurring,
    withdraw: withdraw,
    updateTotalDeposit: updateTotalDeposit,
    paymentList: paymentList
}