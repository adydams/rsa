angular.module('mainApp')
    .controller('listUserSavingsController', ['$scope','$state', 'listUserSavingsService','result',
        function ($scope, $state, listUserSavingsService, result) {
            $scope.name = $state.params.name ;
            var userId = $state.params.userId;
            $scope.savings = result;
            $scope.listUserSavings = async function (userId) {
                let userId = userId;
            //     //$scope.savings = await listUserSavingsService.savingsList(userId)
             }
        }
    ])