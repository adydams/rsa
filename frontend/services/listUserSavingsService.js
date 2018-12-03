angular.module('mainApp')
    .factory('listUserSavingsService', ['$http',
        function ($http) {
            let factory = {};
            factory.savingsList = function (userId) {
                let savings = {};
                let url = `http://localhost:3000/saves/list/${userId}`;

                $http.get(url).then(function (response) {
                    if (response.data.status == true) {
                        savings = response.data.savings;
                    } else {
                        alert(response.data)
                    }
                })
                return savings;
            }
            return factory;
        }
    ])