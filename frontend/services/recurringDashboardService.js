angular.module('mainApp')
    .factory('recurringDashboardService', ['$http','$cookies',
        function ($http, $state, $cookies ) {
            let factory = {};
            //list savings on Dashboard
            factory.listRecurringSavingsHistory = async function (userId) {
                let url = `http://localhost:3000/recurringSavings/list/${userId}`
                var savings = {};
                await $http.get(url).then(function (response) {
                    savings = response.data.savings;
                    saveId = savings._id
                })
                return savings;

            }
            //on payment for existing savings update amount deposited
            factory.updatePaidAmount = async function (saveId) {
                var updateObject = {
                    saveId : saveId
                }
                let url = `http://localhost:3000/recurringSavings/updateTotalDeposit`;
                await $http.post(url, updateObject).then(function (response) {
                    alert(response.data.message);
                })
            }

            factory.viewDetails = async function (saveId) {
                var saveId = $cookies.get('saveId')
                let url = `http://localhost:3000/recurringSavings/listPayment/${saveId}`
                
                var savings = {};
                await $http.get(url).then(function (response) {
                    savings = response.data;
                })
                return savings;
            }

            return factory
        }
    ])