angular.module('mainApp')
    .factory('AuthService',
        ['$q', '$timeout', '$http', '$rootScope','$cookies',
            function ($q, $timeout, $http, $rootScope, $cookies) {

                // create user variable
                var details = $cookies.getObject('details');

                // return available functions for use in the controllers
                return ({
                    isLoggedIn: isLoggedIn,
                    logout: logout
                });

                function isLoggedIn() {
                    if (!details) {
                        return false;
                    } else {
                        return true;
                    }
                }

                async function logout(id) {
                    let userId  = id
                    //create a new instance of a new deferred
                    var deferred = $q.defer();
                    url = `localhost:3000/users/logout/${userId}`
                    // send a get request to the server
                    $http.get(url).then(function (response) {
                        if (response.data.status == true) {
                            deferred.resolve()
                        }else {
                            deferred.reject()
                        }
                    })                     
                }
            }
        ]);