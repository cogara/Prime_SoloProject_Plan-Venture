(function() {

UserController.$inject = ['$http', '$state', 'UserService', 'EquipmentService'];

angular
  .module('planVentureApp')
  .controller('UserController', UserController)

  function UserController($http, $state, UserService, EquipmentService) {
    var vm = this;
    vm.userData = UserService.data;
    vm.getDefaultEquipment = getDefaultEquipment;
    vm.addDefaultEquipment = addDefaultEquipment;
    vm.removeDefaultEquipment = removeDefaultEquipment;
    vm.editProfile = editProfile;
    vm.toggleEdit = toggleEdit;
    vm.addEquipmentToggle = addEquipmentToggle;

    function toggleEdit() {

        console.log('toggle');
      if (vm.editingProfile) {
        vm.editingProfile = false;
        console.log('sending', vm.userData.currentUser);
        UserService.updateProfileInfo(vm.userData.currentUser);
      } else {
        vm.editingProfile = true;
      }
    }

    function addEquipmentToggle() {
      if (vm.toggleAddEquip) {
        vm.toggleAddEquip = false;
      } else {
        vm.toggleAddEquip = true;
      }
    }

    function editProfile(info) {
      if(info === 'email') {
        if (vm.editEmail) {
          vm.userData.currentUser.email = vm.newEmail;
          if(vm.userData.currentUser.email != null) {
            UserService.updateProfileInfo(vm.userData.currentUser);
          }
          vm.editEmail = false;
        } else {
          vm.newEmail = vm.userData.currentUser.email;
          vm.editEmail = true;
        }
      }
      if(info === 'phone') {
        if (vm.editPhone) {
          vm.userData.currentUser.phone = vm.newPhone;
          if(vm.userData.currentUser.phone != null) {
            UserService.updateProfileInfo(vm.userData.currentUser);
          }
          vm.editPhone = false;
        } else {
          vm.newPhone = vm.userData.currentUser.phone;
          vm.editPhone = true;
        }
      }
    }

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
