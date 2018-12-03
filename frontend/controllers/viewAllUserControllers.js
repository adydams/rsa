angular.module('mainApp')
    .controller('viewAllUserController', ['$scope', 'viewAllUserService','superAdminService', '$state', '$cookies', 'result',
        function ($scope, viewAllUserService, superAdminService, $state, $cookies, result) {
            var details = $cookies.getObject('details')
            var userId = $state.params.userId;
            var permission = $state.params.permission;
            $scope.permission = details.permission;
            $scope.name = details.name;

            $scope.users = result;
            $scope.listAllUsers = async function (userId, permission) {
                var details = $cookies.getObject('details')
                var userId = details.userId;
                var permission = details.permission;
                // $scope.users = await viewAllUserService.listAllUsers( userId, permission )
            }

            $scope.listUserSavings = async function (userlistId, name) {
                $state.go ('listUserSavings',{
                    userId:userlistId,
                    name
                })
            }
            $scope.newAdmin = async function (newAdminId) {
                 $cookies.put( 'newAdminId', newAdminId);
                 $scope.admins = await superAdminService.newAdmin(newAdminId);
                 $state.reload('listAllUsers')
            }
            $scope.changeToRegularUser = async function (oldAdminId) {
                var oldAdminId = oldAdminId;
                 //$cookies.put( 'newAdminId', newAdminId);
                $scope.admins = await superAdminService.changeToRegularUser(oldAdminId);
                $state.reload('listAllUsers')
            }
        }

    ])