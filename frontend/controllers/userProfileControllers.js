angular.module('mainApp')
    .controller('userProfileController',
        ['$scope', '$cookies', '$state', 'result', 'userProfileService',
            function ($scope, $cookies, $state, result, userProfileService) {
                var userId = $state.params.userId;
                $scope.userDetails = result;
                $scope.showUserProfile = async function (userId) {
                    var details = $cookies.getObject('details', details);
                    var userId = userId
                    // $scope.userDetails = await userProfileService.showUserProfile(userId)
                }

                $scope.editUserProfile = async function (userId) {
                    //var details = $cookies.getObject('details', details);
                    var userId = userId;
                    $state.go('editProfile', {
                        userId
                    });
                };
            }

        ])