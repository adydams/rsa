angular.module('mainApp')
    .factory('loginService', ['$http', '$state', '$rootScope','$cookies',
        function ($http, $state, $rootScope, $cookies) {
            let factory = {};

            //url from backend *api for login*
            let url = 'http://localhost:3000/users/login';

            factory.login = async function (user) {
                let usersDetails = {};
                await $http.post(url, user).then(function (response) {
                    if (response.data.status == true) {
                        //response from the api
                        //holding userId, name, token in usersDetails
                        //to be passed as an object details in controllers
                        usersDetails.userId = response.data.users._id;
                        usersDetails.name = response.data.users.name;
                        usersDetails.email = response.data.users.email;
                        usersDetails.phoneNumber = response.data.users.phoneNumber;
                        usersDetails.token = response.data.token;
                        usersDetails.accountNumber = response.data.users.accountNumber;
                        usersDetails.bankName = response.data.users.bankName;
                        usersDetails.permission = response.data.users.permission;
                        usersDetails.planType = response.data.users.planType;

                        //setting cookies with the object returned from service
                        $cookies.putObject('details', usersDetails);
                        $state.go('dashboard');
                    } else {
                        alert(response.data.message);
                    }

                })
                // return usersDetails;
            }
            return factory;
        }
    ])