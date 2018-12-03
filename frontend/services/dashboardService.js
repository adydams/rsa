angular.module('mainApp')
    .factory('dashboardService', ['$http',
        function ($http) {
            let factory = {};

            factory.listSavingsHistory = async function (userId) {
                let url = `http://localhost:3000/saves/list/${userId}`
                var savings = {};
                await $http.get(url).then(function (response) {
                    savings = response.data.savings;
                })
                return savings;
            }

            //on payment change payment status to true
            factory.updatePaidAmount = async function (saveId) {
                var updateObject = {
                    saveId: saveId
                }
                let url = `http://localhost:3000/saves/updatePaymentStatus`;
                await $http.post(url, updateObject).then(function (response) {
                    alert(response.data.message);
                })
            }

            return factory
        }

    ])