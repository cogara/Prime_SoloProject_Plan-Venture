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
      return data.tripList;
    }

    function getTripOverview(response) {
      var tripData = {}
      tripData.users = response.data.users;
      tripData.info = response.data.info[0];
      tripData.info.shortDate = new Date(tripData.info.date).toLocaleDateString('en-US');

      data.trip = tripData;

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
      return $http.post('/trips/add/pe/' + tripId, {equipmentName: equipment});
    }

    function addGroupEquipment(equipment, tripId) {
      return $http.post('/trips/add/ge/' + tripId, {equipmentName: equipment});
    }

    function removeEquipment(equipment) {
      return $http.delete('/trips/remEquip/' + equipment.id);
    }

    function unclaimEquipment(equipment) {
      return $http.put('/trips/unclaimEquip/' + equipment.id);
    }

    function claimEquipment(equipment) {
      return $http.put('/trips/claimEquip/' + equipment.id);
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
      console.log('Trip Service, adding menu item: ', data);
      return $http.put('/menus/addItem/' + tripId, data).then(function(response){
        console.log('in trip service', response.data);
        return;
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
