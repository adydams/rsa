angular.module('mainApp')
.directive('navBar', function(){
    return {
        restrict: "E",
        templateUrl:'/views/navigationBar.html',
        controller: 'navigationBarController'
    }
});