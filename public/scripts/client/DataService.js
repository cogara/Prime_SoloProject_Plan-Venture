(function() {

TripService.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .factory('TripService', TripService);

  function TripService($http, $state) {
    var data = {};

    function getTrips(){
      return $http.get('/trips').then(getTripsSuccess, httpFailure);
    }

    function getPersonalEquipment(tripId) {
      return $http.get('/trips/pe/' + tripId).then(personalEquipSuccess, httpFailure);
    }
    function getGroupEquipment(tripId) {
      return $http.get('/trips/ge/' + tripId).then(groupEquipSuccess, httpFailure);
    }
    function getOverview(tripId) {
      return $http.get('/trips/info/' + tripId).then(getTripOverview, httpFailure);
    }

    function getTripsSuccess(response) {
      data.tripList = response.data;
      for (var i = 0; i < data.tripList.length; i++) {
        data.tripList[i].shortDate = new Date(data.tripList[i].date).toLocaleDateString('en-US');
      }
      return data.tripList;
    }

    function getTripOverview(response) {
      var tripData = {}
      tripData.users = response.data.users;
      tripData.info = response.data.info[0];
      tripData.info.shortDate = new Date(tripData.info.date).toLocaleDateString('en-US');

      return tripData;
      $state.go('dashboard.tripDisplay.tripOverview');
    }

    function personalEquipSuccess(response){
      data.personalEquipment = response.data;
      return response.data;
    }
    function groupEquipSuccess(response){
      data.groupEquipment = response.data;
      return response.data;
    }
    function httpFailure(){
      console.log('HTTP Request Failed');
    }

    // getTrips();
    return {
      data: data,
      getTrips: getTrips,
      // getOverview: getOverview,
      getPersonalEquipment: getPersonalEquipment,
      getGroupEquipment: getGroupEquipment,
      getOverview: getOverview
    }
  }


})();
