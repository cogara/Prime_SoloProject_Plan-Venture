(function() {

TripService.$inject = ['$http'];

angular
  .module('planVentureApp')
  .factory('TripService', TripService);

  function TripService($http) {
    var data = {};

    function getTrips(){
      return $http.get('/api/trips').then(getTripsSuccess, httpFailure);
    }

    function getPersonalEquipment(tripId) {
      return $http.get('/api/trips/equipment/' + tripId + '?personal=true').then(personalEquipSuccess, httpFailure);
    }
    function getGroupEquipment(tripId) {
      return $http.get('/api/trips/equipment/' + tripId + '?group=true').then(groupEquipSuccess, httpFailure);
    }
    function getOverview(tripId) {
      return $http.get('/api/trips/info/' + tripId).then(overviewSuccess, httpFailure);
    }

    function editLocation(location, tripId) {
      console.log(location);
      var data = {}
      data.location = location;
      return $http.put('/api/trips/edit/' + tripId + '?location=true', data);
    }
    function editNotes(notes, tripId) {
      console.log(notes);
      var data = {}
      data.notes = notes;
      return $http.put('/api/trips/edit/' + tripId + '?notes=true', data);
    }

    function editDate(date, tripId) {
      var data = {}
      data.date = date;
      return $http.put('/api/trips/edit/' + tripId + '?date=true', data);
    }

    var newMenu;
    function editDuration(duration, tripId, menu) {
      // console.log('Menu:', menu);
      newMenu = menu;
      // console.log('Before', newMenu.length);
      restructureMenu(newMenu, duration);
      // console.log('After', newMenu.length);
      var data = {}
      data.duration = duration;
      data.menu = newMenu;
      console.log('editing duration:', data);
      return $http.put('/api/trips/edit/' + tripId + '?duration=true', data);
    }

    function restructureMenu(menu, nights) {
      var days = parseInt(nights) + 1;
      // console.log('starting length', newMenu.length);
      if(menu.length === days) {
        return;
      }
      if(menu.length > days) {
        var difference = menu.length - days;
        for (var i = 0; i < difference; i++) {
          newMenu.pop();
        }
        return;
      }
      if(menu.length < days) {
        var difference = days - menu.length;
        // console.log('diff:', difference);
        for (var i = 0; i < difference; i++) {
          var menuDay = {
              "dinner" : [],
              "lunch" : [],
              "breakfast" : []
          };
          menuDay.day = newMenu.length+1;
          // console.log('Day:', menuDay.day);
          newMenu.push(menuDay);
         }
         return;
      }
    }




    function getTripsSuccess(response) {
      data.tripList = response.data;
      return data.tripList;
    }

    function overviewSuccess(response) {
      data.trip = response.data;
      data.trip.info.date = new Date(data.trip.info.date);
      return data.trip;
    }

    function personalEquipSuccess(response){
      return response.data;
    }
    function groupEquipSuccess(response){
      return response.data;
    }

    function addPersonalEquipment(equipment, tripId) {
      return $http.post('/api/trips/equipment/' + tripId + '?personal=true', {equipmentName: equipment});
    }

    function addGroupEquipment(equipment, tripId) {
      return $http.post('/api/trips/equipment/' + tripId + '?group=true', {equipmentName: equipment});
    }

    function removeEquipment(equipment) {
      return $http.delete('/api/trips/removeEquipment/' + equipment.id);
    }

    function unclaimEquipment(equipment) {
      return $http.put('/api/trips/equipment/' + equipment.id + '?action=unclaim');
    }

    function claimEquipment(equipment) {
      return $http.put('/api/trips/equipment/' + equipment.id + '?action=claim');
    }

    function getMenu(tripId, date) {
      return $http.get('/api/menus/id/' + tripId).then(function(response){
        var tripMenu = response.data.menu;
        if (date) {
          for (var i = 0; i < tripMenu.length; i++) {
            var tempDate = new Date(date);
            tempDate.setDate(tempDate.getDate() + i);
            tripMenu[i].date = tempDate;
          }
        }
        return tripMenu;
      }, function(){
        console.log('Error getting menu');
      })
    }

    function addMenuItem(tripId, data){
      return $http.put('/api/menus/addItem/' + tripId, data).then(function(response){
        return;
      }, function() {
        console.log('error');
      })
    }

    function removeMenuItem(tripId, data){
      return $http.put('/api/menus/removeItem/' + tripId, data).then(function(){
        return;
      }, function() {
        console.log('error');
      })
    }

    function sendMessage(data) {
      var sendData = {};
      sendData.timeStamp = data.timeStamp;
      sendData.message = data.message;
      return $http.post('/api/trips/messages/add/' + data.tripId, sendData);
    }

    function deleteMessage(id) {
      return $http.delete('/api/trips/messages/delete/' + id);
    }

    function getMessages(tripId) {
      return $http.get('/api/trips/messages/' + tripId).then(function(response) {
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
      getMenu: getMenu,
      editLocation: editLocation,
      editDate: editDate,
      editDuration: editDuration,
      editNotes: editNotes
    }
  }


})();
