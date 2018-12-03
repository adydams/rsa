angular.module('mainApp')
    .factory('superAdminService', ['$http',
        function ($http) {
            let factory = {};
            factory.newAdmin = async function(newAdminId){
                newAdminIdObject = {
                    newAdminId : newAdminId,
                }
                let url = `http://localhost:3000/users/updateToAdmin/${newAdminId}`;
                var admins = {};
                await $http.post(url, newAdminIdObject).then(function(response){
                    admins = response.data
                })
                return admins;
            }
            factory.changeToRegularUser = async function(newAdminId){
                    newUserObject = {
                        newAdminId : newAdminId,
                    }
                    let url = `http://localhost:3000/users/changeAdminToUser/${newAdminId}`;
                    var admins = {};
                    await $http.post(url, newUserObject).then(function(response){
                        admins = response.data
                    })
                    return admins;
            }

            return factory;
        }
    ])