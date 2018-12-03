angular.module('mainApp')
    .factory('createPlanService', ['$http', '$state',
        function ($http, $state) {
            let factory = {};
            
            factory.createPlan = function (userId, createPlanDetails) {
                let planDetails = {};
                let url = 'http://localhost:3000/saves/createPlan';
                var createPlanObject = {
                    userId: userId,
                    amount: createPlanDetails.amount,
                    savingsPlan: createPlanDetails.savingsPlan,
                    duration: createPlanDetails.duration,
                }
                $http.post(url, createPlanObject).then(function (response) {
                    if (response.data.status) {
                        $state.go('dashboard');
                    }
                    var savings = response.data.savings;
                    return alert(response.data.message);
                });
            }
            factory.continuousSavingsCreatePlan = function (userId, continuousSavingsCreatePlanDetails) {
                let planDetails = {};
                
                let url = 'http://localhost:3000/recurringSavings/createplan';
                var continuousSavingsCreatePlanDetailsObject = {
                    userId: userId,
                    amount: continuousSavingsCreatePlanDetails.amount,
                    modeOfPayment: continuousSavingsCreatePlanDetails.modeOfPayment,
                    amountPerDeposit: continuousSavingsCreatePlanDetails.amountPerDeposit || 0,
                    amountDeposited: continuousSavingsCreatePlanDetails.amountDeposited = 0,
                    savingsPlan: continuousSavingsCreatePlanDetails.savingsPlan,
                    duration: continuousSavingsCreatePlanDetails.duration,
                }
                $http.post(url, continuousSavingsCreatePlanDetailsObject).then(function (response) {

                    if (response.data.status) {
                        $state.go('recurringDashboard');
                    }
                    var savings = response.data.savings;
                    alert(response.data.message);
                });

            }
            return factory;
        }
    ])