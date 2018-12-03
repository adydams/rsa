angular.module('mainApp')
    .factory('viewDetailsService', ['$http',
        function ($http) {
            let factory = {};

            factory.viewDetails = async function (saveId) {

                let url = `http://localhost:3000/recurringSavings/listPayment/${saveId}`

                var savingsDetails = {};
                await $http.get(url).then(function (response) {
                    savingsDetails = response.data.savings;
                }, (Error) => {
                   alert(Error.data.message)
                   console.log(Error)
               })
                return savingsDetails;
            }

            return factory
        }
    ])