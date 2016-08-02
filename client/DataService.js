(function() {

DataService.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .factory('DataService', DataService);

  function DataService($http, $state) {
    var data = {};


    function getTrips(){
      $http.get('/trips').then(function(response){
        data.tripList = response.data
      }, function(){
        console.log('Error in Data Service');
      });
    }

    function getOverview(trip_id, trip_name) {
      $http.get('/trips/pe/' + trip_id).then(personalEquipSuccess, httpFailure);
      $http.get('/trips/ge/' + trip_id).then(groupEquipSuccess, httpFailure);
      $http.get('/trips/info/' + trip_id).then(getTripOverview, httpFailure);
    }

    function getTripOverview(response) {
      // console.log(response.data);
      data.tripUsers = response.data.users;
      data.tripInfo = response.data.info[0];
      console.log(data.tripInfo);
      data.tripInfo.date = new Date(data.tripInfo.date).toLocaleDateString('en-US');
      $state.go('dashboard.tripDisplay.tripOverview');
    }

    function personalEquipSuccess(response){
      data.personalEquipment = response.data;
    }
    function groupEquipSuccess(response){
      data.groupEquipment = response.data;
    }

    function httpFailure(){
      console.log('HTTP Request Failed');
    }


    getTrips();
    return {
      data: data,
      getTrips: getTrips,
      getOverview: getOverview
    }
  }


})();
