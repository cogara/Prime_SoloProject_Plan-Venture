(function() {

RegisterController.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .controller('RegisterController', RegisterController)

  function RegisterController($http, $state) {
    var vm = this;
    vm.testing = 'this is a test';

    vm.registerUser = registerUser;


    function registerUser() {
      var sendData = {};
      sendData.username = vm.username;
      sendData.password = vm.password;
      $http.post('/register', sendData).then(registerSuccess, httpFailure);
    }

    function registerSuccess(response) {
      $state.go('login');
    }

    function httpFailure() {
      console.log('HTTP Request Failed');
    }
  } //end MainController
})();
