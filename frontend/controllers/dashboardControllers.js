angular.module('mainApp')
    .controller('dashboardController', ['$scope', '$state', '$cookies', 'dashboardResolve', 'dashboardService',
        function ($scope, $state, $cookies, dashboardResolve, dashboardService) {
            var details = $cookies.getObject('details')
            $scope.userId = details.userId;
            $scope.name = details.name;
            $scope.email = details.email;
            $scope.phoneNumber = details.phoneNumber;
            $scope.permission = details.permission;
            phoneNumberFormatted = '+234' + parseInt($scope.phoneNumber);

            //     $scope.listSavingsHistory = async function (userId){
            //     // $scope.savings = await dashboardService.listSavingsHistory(details.userId)
            // }


            $scope.savings = dashboardResolve
            save = dashboardResolve;
           
            //counting number of plans that have pending payments
            var count = 0;
                       
            for (i=0; i<save.length; i++) {
                if (save[i].paymentStatus == false) {                   
                    count += 1;                    
                }     
                $scope.pendingPayment = count;
            }
           
            $scope.withdraw = function (save, withdrawalStatus, duePaymentDate, paymentStatus) {
                let status;
                if (paymentStatus == false) {
                    return alert('You can\'t withdraw you have not made your payment ');
                }

                if (withdrawalStatus == true) {
                    return $state.go('transactionClosed')
                }
                //comparing date before withdrawal
                var date1 = new Date(duePaymentDate);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.valueOf() - date1.valueOf());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                //status is false if it is not due date for payment
                if (date2 <= date1) {
                    status = false;
                    //$location.path(`/penaltyWithdrawal/${dueDateForWithdrawal}/${saveid}/${status}`)
                    $state.go('penaltyWithdrawal', {
                        save,
                        duePaymentDate,
                        withdrawalStatus
                    })
                }

                //status is true if it is due date for payment
                if (date2 > date1) {
                    status = true;
                    $state.go('withdrawal', {
                        save,
                        duePaymentDate,
                        withdrawalStatus
                    })
                }
            };

            $scope.showUserProfile = function () {
                var details = $cookies.getObject('details')
                var userId = details.userId;
                $state.go('userProfile', {
                    userId,
                });
            };

            $scope.viewAllUser = function (userId, permission) {
                $state.go('listAllUsers', {
                    userId: userId,
                    permission: permission
                });
            };
            $scope.viewAdmins = function (userId, permission) {
                $state.go('listAdmin', {
                    userId: userId,
                    permission: permission
                });
            };

            $scope.payWithRave = function (savingsId, amount, balance, withdrawalStatus) {

                let amountToWithdraw;
                //avoid payment on completion
                if (balance == 0) {
                    return alert('Payment completed');
                }
                if (withdrawalStatus == true) {
                    return alert('You have withdrawn, this transaction closed')
                }
                //paying balance left if les than amon=unt per deposit
                // if (amount > balance) {
                //     return alert('You are paying more than your invested amount')
                // }

                const API_publicKey = "FLWPUBK-d55d15777de9780e3390fa593e133687-X";
                var x = getpaidSetup({
                    PBFPubKey: API_publicKey,
                    customer_email: $scope.email,
                    amount: amount,
                    customer_phone: phoneNumberFormatted,
                    currency: "NGN",
                    payment_method: "both",
                    txref: "rave-123456",
                    meta: [{
                        metaname: "flightID",
                        metavalue: "AP1234"
                    }],
                    onclose: function () {},
                    callback: function (response) {
                        var txref = response.tx.txRef;
                        // collect txRef returned and pass to a server page to complete status check.
                        console.log("This is the response returned after a charge", response);
                        if (
                            response.tx.chargeResponseCode == "00" ||
                            response.tx.chargeResponseCode == "0"
                        ) {
                            // redirect to a success page
                            updatePaidAmount(savingsId);
                        } else {
                            // redirect to a failure page.
                            alert('An error occurred');
                        }

                        x.close(); // use this to close the modal immediately after payment.
                    }
                });
            }

            async function updatePaidAmount(savingsId) {
                await dashboardService.updatePaidAmount(savingsId)
                $state.reload('dashboard')
            }



        }
    ])