(function() {

UserService.$inject = ['$http'];

angular
  .module('planVentureApp')
  .factory('UserService', UserService);

  function UserService($http) {
    var data = {};

    function currentUser() {
      return $http.get('/api/currentUser')
        .then(function(response) {
          data.currentUser = response.data;
          return response.data;
        });
    }

    function clearUser() {
      data.currentUser = null;
    }

    function leaveTrip(tripId, orgId, userId) {
      var isOrg = false;
      if ((orgId === userId) && (orgId && userId)) {
        isOrg = true;
        $http.delete('/api/menus/' + tripId);
      }
      return $http.delete('/api/trips/leave/' + tripId + '?organizer=' + isOrg);
    }

    function currentTripInfo(trip) {
      data.currentTrip = trip;
    }

    function updateProfileInfo(data) {
      $http.put('/api/users/profile', data);
    }

    function leaveSuccess(response) {
      return;
    }

    function httpFailure() {
      console.log('HTTP Request Failed');
    }

    return {
      data: data,
      leaveTrip: leaveTrip,
      currentUser: currentUser,
      clearUser: clearUser,
      currentTripInfo: currentTripInfo,
      updateProfileInfo: updateProfileInfo
    }
  }


})();
