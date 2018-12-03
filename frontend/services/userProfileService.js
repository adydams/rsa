angular.module('mainApp')
    .factory('userProfileService', ['$http',
        function ($http) {
            let factory = {};
            factory.showUserProfile = async function (userId) {
                let url = `http://localhost:3000/users/list/${userId}`
                var userDetails = {};
                await $http.get(url).then(function (response) {
                        userDetails = response.data;
                    })
                return userDetails;
            }
            return factory
        }

    ])