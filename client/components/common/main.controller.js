(function() {

MainController.$inject = ['$http', '$state', 'UserService'];

angular
  .module('planVentureApp')
  .controller('MainController', MainController)

  function MainController($http, $state, UserService) {
    var vm = this;
    vm.logout = logout;
    vm.userData = UserService.data;

    function logout() {
      $http.get('/logout').then(function(){
        UserService.clearUser();
        $state.go('login');
      }, function(){
        console.log('logout failed');
      });
    }

    UserService.currentUser();

  } //end MainController
})();
