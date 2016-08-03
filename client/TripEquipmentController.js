(function() {

TripEquipmentController.$inject = ['$http', '$state', 'DataService'];

angular
  .module('planVentureApp')
  .controller('TripEquipmentController', TripEquipmentController)

  function TripEquipmentController($http, $state, DataService) {
    var vm = this;
    vm.addPersonalEquipment = addPersonalEquipment;
    vm.addGroupEquipment = addGroupEquipment;
    vm.data = DataService.data;
    vm.getOverview = DataService.getOverview;
    vm.httpGetPersonalEquipment = DataService.httpGetPersonalEquipment;
    vm.httpGetGroupEquipment = DataService.httpGetGroupEquipment;
    vm.removeEquipment = removeEquipment;

    function addPersonalEquipment(tripId, tripName) {
      vm.currentTripId = tripId;
      vm.currentTripName = tripName;
      var sendData = {};
      sendData.equipmentName = vm.personalEquipment;
      $http.post('/trips/add/pe/' + tripId, sendData).then(equipSuccess, httpFailure);
    }

    function removeEquipment(equipment, tripId, tripName) {
      vm.currentTripId = tripId;
      vm.currentTripName = tripName;
      $http.delete('/trips/remEquip/' + equipment.id).then(equipSuccess, httpFailure);
    }

    function addGroupEquipment(tripId, tripName) {
      vm.currentTripId = tripId;
      vm.currentTripName = tripName;
      var sendData = {};
      sendData.equipmentName = vm.groupEquipment;
      $http.post('/trips/add/ge/' + tripId, sendData).then(equipSuccess, httpFailure);
    }

    function equipSuccess(response) {
      vm.httpGetPersonalEquipment(vm.currentTripId, vm.currentTripName);
      vm.httpGetGroupEquipment(vm.currentTripId, vm.currentTripName);
    }

    function httpFailure() {
      console.log('HTTP Failure');
    }
  } //end TripEquipmentController
})();
