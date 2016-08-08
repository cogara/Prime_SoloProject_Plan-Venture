(function() {

MainController.$inject = ['$http', '$state', 'UserService'];

angular
  .module('planVentureApp')
  .controller('MainController', MainController)

  function MainController($http, $state, UserService) {
    var vm = this;
    vm.logout = logout;

    function logout() {
      $http.get('/logout').then(function(){
        $state.go('index');
      }, function(){
        console.log('logout failed');
      });
    }

    function checkAuth() {
      $http.get('/currentuser').then(function(response){
        if(response.data.username){
          loginSuccess(response);
        }
      }, function(){
        console.log('wrong');
      });
    }

    checkAuth();
    function loginSuccess(response) {
      console.log(response.data);
      UserService.getCurrentUser(response.data);
      $state.go('user.dashboard');
    }

  } //end MainController
})();
