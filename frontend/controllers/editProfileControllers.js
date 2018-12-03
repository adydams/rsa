angular.module('mainApp')
    .controller('editProfileController',
        ['$scope', '$cookies', '$state', 'editProfileService',
            function ($scope, $cookies, $state, editProfileService) {
                var userId = $state.params.userId;
                //for resolve
                //$scope.userDetails = result;
                //    console.log('from resolve', $scope.userDetails)
                $scope.editUserProfile = async function () {
                    var Id = userId;
                    $scope.userDetails = await editProfileService.editUserProfile($scope.updateUserDetails, Id);
                    $state.go('userProfile', {
                        userId
                    })
                }
            }
        ])