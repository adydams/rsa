angular.module ('mainApp')
.factory('signupService',[ '$http', '$location',
        function ($http, $location) {
            let factory = {};
            let url = 'http://localhost:3000/users/register';
            
            factory.signUp = function (user){
                
                $http.post(url, user).then( function (response) {
                if (response.data.status == true){
                    alert(response.data.message);
                    $location.path('/login');
                   // return newUsers;
                }
                if (response.data.status == false){
                    var errorMessage = response.data.message;
                    alert(response.data.message);
                }
                }) 
            }
            return factory;
        }
])