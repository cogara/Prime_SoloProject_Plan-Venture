(function() {

MainController.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .controller('MainController', MainController)

  function MainController($http, $state, DataService) {
    var vm = this;
    vm.testing = 'this is a test';

    vm.registerUser = registerUser;
    vm.login = login;

    function registerUser() {
      var sendData = {};
      sendData.username = vm.username;
      sendData.password = vm.password;
      $http.post('/register', sendData).then(registerSuccess, httpFailure);
    }

    function login() {
      var sendData = {};
      sendData.username = vm.loginUsername;
      sendData.password = vm.loginPassword;
      $http.post('/login', sendData).then(loginSuccess, httpFailure);
    }

    function registerSuccess(response) {
      console.log(response);
      $state.go('route1');
    }

    function loginSuccess(response) {
      console.log(response);
      $state.go('dashboard');
    }

    function httpFailure() {
      console.log('HTTP Request Failed');
    }
  } //end MainController
})();
