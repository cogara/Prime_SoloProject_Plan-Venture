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
      return data.tripList;
    }

    function getTripOverview(response) {
      var tripData = {}
      tripData.users = response.data.users;
      tripData.info = response.data.info[0];
      tripData.messages = response.data.messages;
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

    function removeMenuItem(tripId, data){
      console.log('removing menu item: ', data);
      return $http.put('/menus/removeItem/' + tripId, data).then(function(){
        return;
      }, function() {
        console.log('error');
      })
    }

    function sendMessage(data) {
      var sendData = {};
      sendData.message = data.message;
      return $http.post('/trips/messages/add/' + data.tripId, sendData);
    }

    function deleteMessage(id) {
      return $http.delete('/trips/messages/delete/' + id);
    }

    function getMessages(tripId) {
      return $http.get('/trips/messages/' + tripId).then(function(response) {
        return response;
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
      removeMenuItem: removeMenuItem,
      sendMessage: sendMessage,
      getMessages, getMessages,
      deleteMessage: deleteMessage,
      getMenu: getMenu
    }
  }


})();
