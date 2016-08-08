(function() {

UserService.$inject = ['$http'];

angular
  .module('planVentureApp')
  .factory('UserService', UserService);

  function UserService($http) {
    var data = {};

    function getCurrentUser(user) {
      data.currentUser = user;
    }

    return {
      data: data,
      getCurrentUser: getCurrentUser
    }
  }


})();
