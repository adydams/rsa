angular.module('mainApp')
    .factory('viewAdminService', ['$http',
        function ($http) {
            let factory = {};

            factory.listAdmin = async function (userId, permission) {
                var admins = {};
                let url= `http://localhost:3000/users/listAdmin/${userId}/${permission}`
                await $http.get(url).then(function (response) {
                        admins = response.data;
                    })
                return admins;
            }

            factory.createNewAdmin = async function (userId) {
                let userId = userId;
                state.go('createNewAdmin',{
                    userId
                })
            }
            factory.AdminToUser = async function (userId) {
                state.go('AdminToUser',{
                    userId
                })
            }
            return factory
        }
    ])