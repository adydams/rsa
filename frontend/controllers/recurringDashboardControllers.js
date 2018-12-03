angular.module('mainApp')
    .controller('recurringDashboardController', ['$scope', 'recurringDashboardService', 'viewDetailsService', '$state', '$cookies', 'result',
        function ($scope, recurringDashboardService, viewDetailsService, $state, $cookies, result) {
            var details = $cookies.getObject('details')
            $scope.userId = details.userId;
            $scope.name = details.name;
            $scope.email = details.email;
            $scope.phoneNumber = details.phoneNumber;
            $scope.permission = details.permission;
            
            phoneNumberFormatted = '+234' + parseInt($scope.phoneNumber);

            $scope.savings = result;
            
           $scope.savingsView = result;
           
            //counting number of plans that have pending payments
            save = result;  
            var count = 0;
                       
            for (i=0; i<save.length; i++) {
                if (save[i].balance > 0 && save[i].withdrawalStatus == false ) {                   
                    count += 1;                    
                }     
                $scope.pendingPayment = count;
            }

            $scope.payWithRave = function (savingsId, amountPerDeposit, balance) {

                let amountToDeposit;
                //avoid payment on completion
                if (balance == 0) {
                    return alert('Payment completed');
                }
                if (balance < amountPerDeposit){
                    amountPerDeposit = balance;
                }
                                
                    const API_publicKey = "FLWPUBK-d55d15777de9780e3390fa593e133687-X";
                    var x = getpaidSetup({
                        PBFPubKey: API_publicKey,
                        customer_email: $scope.email,
                        amount: amountPerDeposit,
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
                await recurringDashboardService.updatePaidAmount(savingsId)
                $state.reload('recurringDashboard')
            }


            //for view deposit details
            $scope.viewDetails = async function (saveId, amountDeposited, amountPerDeposit, balance) {
                $cookies.put('saveId', saveId)
                $scope.amountDeposited = amountDeposited;
                $scope.amountPerDeposit = amountPerDeposit;
                $scope.balance = balance;
                $scope.savingsDetails = await viewDetailsService.viewDetails(saveId)
            }


            $scope.withdraw = function (save, withdrawalStatus, duePaymentDate, balance, planType, amountDeposited) {
                let status;
                console.log('@@@@@@@',save, withdrawalStatus, duePaymentDate, balance, planType, amountDeposited )

                if (withdrawalStatus == true) {
                    return $state.go('transactionClosed')
                }
                if (balance > 0) {
                    alert(' You have not completed your payment');
                    return $state.reload('recurringDashboard')
                }
                //comparing date before withdrawal
                var date1 = new Date(duePaymentDate);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.valueOf() - date1.valueOf());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (date2 <= date1) {
                    status = false;
                    //$location.path(`/penaltyWithdrawal/${dueDateForWithdrawal}/${saveid}/${status}`)
                    $state.go('penaltyWithdrawal', {
                        save,
                        duePaymentDate,
                        withdrawalStatus,
                        planType
                    })
                }
                if (date2 > date1) {
                    status = true;
                    $state.go('withdrawal', {
                        save,
                        duePaymentDate,
                        withdrawalStatus,
                        planType
                    })
                }
            };



        }
    ])