(function() {

TripEquipmentController.$inject = ['$http', '$state', 'DataService'];

angular
  .module('planVentureApp')
  .controller('TripEquipmentController', TripEquipmentController)

  function TripEquipmentController($http, $state, DataService) {
    var vm = this;
    vm.addPE = addPE;
    vm.addGE = addGE;
    vm.data = DataService.data;
    vm.getOverview = DataService.getOverview;
    vm.httpGetPE = DataService.httpGetPE;
    vm.httpGetGE = DataService.httpGetGE;
    vm.addPE = addPE;

    function addPE(tripId, tripName) {
      vm.currentTripId = tripId;
      vm.currentTripName = tripName;
      var sendData = {};
      sendData.equipmentName = vm.personalEquipment;
      $http.post('/trips/add/pe/' + tripId, sendData).then(addPeSuccess, httpFailure);
    }

    function addGE(tripId, tripName) {
      vm.currentTripId = tripId;
      vm.currentTripName = tripName;
      var sendData = {};
      sendData.equipmentName = vm.groupEquipment;
      $http.post('/trips/add/ge/' + tripId, sendData).then(addGeSuccess, httpFailure);
    }

    function addPeSuccess(response) {
      vm.httpGetPE(vm.currentTripId, vm.currentTripName);
    }

    function addGeSuccess(response) {
      vm.httpGetGE(vm.currentTripId, vm.currentTripName);
    }

    function httpFailure() {
      console.log('HTTP Failure');
    }
  } //end TripEquipmentController
})();
