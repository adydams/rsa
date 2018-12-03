angular.module('mainApp')
    .controller('navigationBarController', ['$rootScope', 'AuthService','$cookies',
        function ($rootScope, AuthService, $cookies) {

            $rootScope.$on('$stateChangeSuccess', function (e, toState, toParsams, fromState, fromParams) {
                var details = $cookies.getObject('details');

                if (details) {
                    $rootScope.state = true;
                } else {
                    $rootScope.state = false;
                }
               

            })

        }
    ])