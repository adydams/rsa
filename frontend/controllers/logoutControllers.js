angular.module('mainApp')
    .controller('logoutController',
        ['$scope', '$cookies', '$state', 'AuthService',
            function ($scope, $cookies, $state, AuthService) {
                $scope.logout = function () {
                    var details = $cookies.getObject('details');
                    var id = details.userId
                    AuthService.logout(id).then(
                        async function () {
                            $state.go('login');
                        });
                    //destroying cookies with the object returned from service
                    $cookies.remove('details');
                }
            }

        ])