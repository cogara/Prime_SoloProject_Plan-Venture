(function() {

UserController.$inject = ['$http', '$state', 'UserService'];

angular
  .module('planVentureApp')
  .controller('UserController', UserController)

  function UserController($http, $state, UserService) {
    var vm = this;
    vm.userData = UserService.data;


  }//end UserPrefController
})();
