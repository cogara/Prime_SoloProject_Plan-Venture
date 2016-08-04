(function() {

UserService.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .factory('UserService', UserService);

  function UserService($http, $state) {
    var data = {};

    function getCurrentUser(user) {
      console.log('user service', user);
      data.currentUser = user;
    }

    return {
      data: data,
      getCurrentUser: getCurrentUser
    }
  }


})();
