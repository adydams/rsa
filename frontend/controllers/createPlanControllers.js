angular.module('mainApp')
    .controller('createPlanController',
        ['$scope', 'createPlanService', '$cookies', '$state',

            function ($scope, createPlanService, $cookies, $state) {
                var details = $cookies.getObject('details');
                $scope._id = details._id;
                $scope.name = details.name;
                $scope.email = details.email;
                $scope.phoneNumber = details.phoneNumber;

                //function for showing error message on submitting
                $scope.showMessage = function (input) {
                    var show = input.$invalid && (input.$dirty || input.$touched);
                    return show;
                };

                $scope.createPlan = function () {
                    createPlanService.createPlan(details.userId, $scope.save);
                }
                $scope.continuousSavingsCreatePlan = function () {
                    createPlanService.continuousSavingsCreatePlan(details.userId, $scope.save);
                }
            }
        ])
    .directive('restrictInput', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var options = scope.$eval(attr.restrictInput);
                    if (!options.regex && options.type) {
                        switch (options.type) {
                            case 'digitsOnly':
                                options.regex = '^[0-9]*$';
                                break;
                            case 'lettersOnly':
                                options.regex = '^[a-zA-Z]*$';
                                break;
                            case 'lowercaseLettersOnly':
                                options.regex = '^[a-z]*$';
                                break;
                            case 'uppercaseLettersOnly':
                                options.regex = '^[A-Z]*$';
                                break;
                            case 'lettersAndDigitsOnly':
                                options.regex = '^[a-zA-Z0-9]*$';
                                break;
                            case 'validPhoneCharsOnly':
                                options.regex = '^[0-9 ()/-]*$';
                                break;
                            default:
                                options.regex = '';
                        }
                    }
                    var reg = new RegExp(options.regex);
                    if (reg.test(viewValue)) { //if valid view value, return it
                        return viewValue;
                    } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                        var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                        element.val(overrideValue);
                        return overrideValue;
                    }
                });
            }
        };
    });