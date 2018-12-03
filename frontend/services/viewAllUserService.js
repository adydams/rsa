angular.module('mainApp')
    .factory('viewAllUserService', ['$http',
        function ($http) {
            let factory = {};
            factory.listAllUsers = async function (userId, permission) {
                let url = `http://localhost:3000/users/listAllUsers/${userId}/${permission}`
                var users = {};
                await $http.get(url).then(function (response) {
                    users = response.data;
                })
                return users;
            }
            return factory
        }
    ])