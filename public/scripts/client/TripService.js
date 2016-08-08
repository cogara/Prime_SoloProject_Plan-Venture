(function() {

TripService.$inject = ['$http'];

angular
  .module('planVentureApp')
  .factory('TripService', TripService);

  function TripService($http) {
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
      console.log('get trips success');
      return data.tripList;
    }

    function getTripOverview(response) {
      var tripData = {}
      tripData.users = response.data.users;
      tripData.info = response.data.info[0];
      tripData.info.shortDate = new Date(tripData.info.date).toLocaleDateString('en-US');

      data.trip = tripData;
      console.log('data.trip', data.trip);

      return tripData;
    }

    function personalEquipSuccess(response){
      // data.personalEquipment = response.data;
      return response.data;
    }
    function groupEquipSuccess(response){
      // data.groupEquipment = response.data;
      return response.data;
    }

    function addPersonalEquipment(equipment, tripId) {
      console.log(equipment, tripId);
      return $http.post('/trips/add/pe/' + tripId, {equipmentName: equipment}).then(equipSuccess, httpFailure);
    }

    function addGroupEquipment(equipment, tripId) {
      return $http.post('/trips/add/ge/' + tripId, {equipmentName: equipment}).then(equipSuccess, httpFailure);
    }

    function removeEquipment(equipment) {
      console.log(equipment);
      return $http.delete('/trips/remEquip/' + equipment.id).then(equipSuccess, httpFailure);
    }

    function unclaimEquipment(equipment) {
      return $http.put('/trips/unclaimEquip/' + equipment.id).then(equipSuccess, httpFailure);
    }

    function claimEquipment(equipment) {
      return $http.put('/trips/claimEquip/' + equipment.id).then(equipSuccess, httpFailure);
    }

    function getMenu(tripId) {
      console.log('Trip service id:', tripId);
      return $http.get('/menus/id/' + tripId).then(function(response){
        return response.data
      }, function(){
        console.log('Error getting menu');
      })
    }

    function addMenuItem(tripId, data){
      return $http.put('/menus/addItem/' + tripId, data).then(function(response){
        console.log('in trip service', response.data);
      }, function() {
        console.log('error');
      })
    }

    function equipSuccess(response) {
      console.log('Success!!!');
    }

    function httpFailure(){
      console.log('HTTP Request Failed');
    }

    // getTrips();
    return {
      data: data,
      getTrips: getTrips,
      getPersonalEquipment: getPersonalEquipment,
      getGroupEquipment: getGroupEquipment,
      getOverview: getOverview,
      addPersonalEquipment: addPersonalEquipment,
      addGroupEquipment: addGroupEquipment,
      removeEquipment: removeEquipment,
      claimEquipment: claimEquipment,
      unclaimEquipment: unclaimEquipment,
      addMenuItem: addMenuItem,
      getMenu: getMenu
    }
  }


})();
