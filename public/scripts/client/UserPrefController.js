(function() {

UserPrefController.$inject = ['$http', '$state', 'EquipmentService'];

angular
  .module('planVentureApp')
  .controller('UserPrefController', UserPrefController)

  function UserPrefController($http, $state, EquipmentService) {
    var vm = this;

    vm.getDefaultEquipment = getDefaultEquipment;
    vm.addDefaultEquipment = addDefaultEquipment;
    vm.removeDefaultEquipment = removeDefaultEquipment;

    function getDefaultEquipment() {
      EquipmentService.getDefaultEquipment().then(function(response){
        vm.defaultEquipment = response;
      }, function(){
        console.log('error');
      })
    }

    function addDefaultEquipment(data) {
      vm.listHolder = true;
      EquipmentService.addDefaultEquipment(data).then(function(response){
        vm.equipmentName = null;
        getDefaultEquipment();
        vm.listHolder = false;
      }, function(){
        console.log('error');
      });
    }

    function removeDefaultEquipment(data) {
      EquipmentService.removeDefaultEquipment(data).then(function(response){
        getDefaultEquipment();
      }, function() {
        console.log('error');
      })
    }

    getDefaultEquipment();
  }//end UserPrefController
})();
