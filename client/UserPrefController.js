(function() {

UserPrefController.$inject = ['$http', '$state', 'EquipmentService'];

angular
  .module('planVentureApp')
  .controller('UserPrefController', UserPrefController)

  function UserPrefController($http, $state, EquipmentService) {
    var vm = this;

    vm.equipData = EquipmentService.data;
    vm.getDefaultEquipment = EquipmentService.getDefaultEquipment;
    vm.addDefaultEquipment = EquipmentService.addDefaultEquipment;
    vm.removeDefaultEquipment = EquipmentService.removeDefaultEquipment;
    vm.clearForm = clearForm;

    function clearForm() {
      vm.equipmentName = null;
    }

    vm.getDefaultEquipment();
  }//end UserPrefController
})();
