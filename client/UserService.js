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

    function leaveTrip(tripId) {
      console.log(tripId);
      return $http.delete('trips/leave/' + tripId).then(leaveSuccess, httpFailure);
    }

    function leaveSuccess(response) {
      console.log(response);
      return;
    }

    function httpFailure() {
      console.log('HTTP Request Failed');
    }

    return {
      data: data,
      getCurrentUser: getCurrentUser,
      leaveTrip: leaveTrip
    }
  }


})();
