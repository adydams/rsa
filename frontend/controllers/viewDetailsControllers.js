angular.module('mainApp')
    .controller('viewDetailsController', ['$scope', 'viewDetailsService', '$state', '$cookies', 'result',
        function ($scope, viewDetailsService, $state, $cookies, result) {
            var details = $cookies.getObject('details');
            $scope.name = details.name;

            //getting saveId, amountDeposited, amountPerDeposit from params 
            $scope.saveId = $state.params.saveId;
            $scope.amountDeposited = $state.params.amountDeposited;
            $scope.amountPerDeposit = $state.params.amountPerDeposit;
            $scope.balance = $state.params.balance;
           
            var saveId = $cookies.put('saveId',$scope.saveId);
            
            $scope.savingsDetails = result;
            
            $scope.viewDetails = async function () {
                var saveId = $cookies.put('saveId',$scope.saveId);
                $scope.savingsDetails = await viewDetailsService.viewDetails(saveId)
            }
        }

    ])