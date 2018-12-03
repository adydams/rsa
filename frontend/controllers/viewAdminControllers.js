angular.module('mainApp')
    .controller('viewAdminController', ['$scope', 'viewAdminService', 'superAdminService', '$state', '$cookies', 'result',
        function ($scope, viewAdminService, superAdminService, $state, $cookies, result) {
            var details = $cookies.getObject('details');
            var userId = $state.params.userId;
            var permission = $state.params.permission;
            $scope.permission = details.permission;
            $scope.name = details.name;

            $scope.admins = result;
            $scope.listAdmin = async function (userId, permission) {
                var details = $cookies.getObject('details')
                var userId = details.userId;
                var permission = details.permission;
                //$scope.Admin = await viewAdminService.listAdmin( details.userId, details.permission )
            }
            $scope.changeAdminToUser = async function (adminId) {
                $scope.admins = await superAdminService.changeToRegularUser(adminId);
                $state.reload('listAdmin');
            }
            $scope.listUserSavings = async function (adminlistId, name) {
                $state.go('listUserSavings', {
                    userId: adminlistId,
                    name
                })
            }
        }
    ])