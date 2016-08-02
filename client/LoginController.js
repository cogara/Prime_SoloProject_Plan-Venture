(function() {

LoginController.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .controller('LoginController', LoginController)

  function LoginController($http, $state, DataService) {
    var vm = this;
    vm.username = 'test';
    vm.password = '123';

    vm.login = login;

    function login() {
      var sendData = {};
      sendData.username = vm.username;
      sendData.password = vm.password;
      $http.post('/login', sendData).then(loginSuccess, httpFailure);
    }

    function loginSuccess(response) {
      $state.go('dashboard');
    }

    function httpFailure() {
      console.log('HTTP Request Failed');
    }
  } //end LoginController
})();
