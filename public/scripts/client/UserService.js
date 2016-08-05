(function() {

UserService.$inject = ['$http'];

angular
  .module('planVentureApp')
  .factory('UserService', UserService);

  function UserService($http) {
    var data = {};

    function getCurrentUser(user) {
      console.log('user service', user);
      data.currentUser = user;
    }

    function getUserProfile(id) {
      return $http.get('/users/profile/' + id).then(getProfileSuccess, httpFailure);
    }

    function getProfileSuccess(response) {
      console.log(response);
    }

    function httpFailure() {
      console.log('HTTP failed');
    }

    return {
      data: data,
      getCurrentUser: getCurrentUser
      // getUserProfile: getUserProfile
    }
  }


})();
