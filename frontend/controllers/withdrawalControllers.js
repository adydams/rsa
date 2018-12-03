angular.module('mainApp')
    .controller('withdrawalController',
        ['$scope', 'withdrawService', '$state', '$cookies',
            function ($scope, withdrawService, $state, $cookies, ) {
                var details = $cookies.getObject('details');
                
                $scope.name = details.name;
                var accountNumber = details.accountNumber;
                var bankName = details.bankName;
                var account_bank ;

                if (details.accountNumber == "" || details.bankName == ""){
                   alert('Update your account number and bank name in your profile')
                }

                //save from withdraw/save in app.js
                var savingsId = $state.params.save;
                var duePaymentDate = $state.params.duePaymentDate;
                var status = $state.params.withdrawalStatus;
                var planType = $state.params.planType;               
                                
                //status is been sent as string, 
                //hence it will be checked as string at the backend

                $scope.withdraw = function () {
                    withdrawService.withdraw(savingsId, status, details, planType)
                    $state.go('dashboard')
                }
                // $scope.updateDashboard = async function(userId, saveId){
                //     $scope.saved = await withdrawService.updateDashboard(details.userId, saveId)
                // }  
            }
        ])