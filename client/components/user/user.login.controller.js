(function() {

LoginController.$inject = ['$http', '$state', 'UserService'];

angular
  .module('planVentureApp')
  .controller('LoginController', LoginController)

  function LoginController($http, $state, UserService) {
    var vm = this;
    vm.login = login;


    function login() {
      var sendData = {};
      sendData.username = vm.username;
      sendData.password = vm.password;
      $http.post('/login', sendData).then(loginSuccess, loginFailure);
    }

    function loginSuccess(response) {
      UserService.currentUser();
      $state.go('trips');
    }

    function loginFailure() {
      vm.loginFail = 'Username or Password do not match. Please try again.'
      $state.go('login')
      console.log('HTTP Request Failed');
    }
  } //end LoginController
})();
