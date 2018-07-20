angular
  .module('myApp')
  .factory('httpq', function ($http, $q) {
    return {
      get: function () {
        var deferred = $q.defer();
        $http.get
          .apply(null, arguments)
          .success(deferred.resolve)
          .error(deferred.resolve);
        return deferred.promise;
      },
    };
  })
  .controller('loginController', function ($scope, $http, $log, $window) {
    $scope.loginError=false;
    $scope.validateUser = function (email, password) {
      if((email===undefined || email==="") || (password===undefined || password===""))
      {
        alert("Please enter the details!!");
        return;

      }

      var data = JSON.stringify({
        credentials: {
          userName: email,
          password: password,
        }
      });

      $http({
        method: 'post',
        url: '/login',
        data: data,
        config: 'Content-Type: application/json;',
      }).then(
        function (response) {
          console.log(response);
          sessionStorage.setItem('userId', response.data.userID);
          sessionStorage.setItem('name', response.data.name);
          sessionStorage.setItem('role', response.data.role);

          if (response.data.role === 'customer')
            $window.location.href = '/healthInfo.html';
          else if (response.data.role === 'provider')
            $window.location.href = '/provider.html';
          else if (response.data.role === 'pharmacy') {
            $window.location.href = '/pharmacy.html';
            sessionStorage.setItem('location', response.data.location)
          } else $window.location.href = '/healthInfo.html';
        },
        function (response) {
          document.getElementById('error').innerHTML=" <h6>Incorrect user ID or password. Type the correct user ID or password, and try again.</h6>"
         // console.log(response);
          $scope.error = response.data;
         
        },
      );
    };
  });
