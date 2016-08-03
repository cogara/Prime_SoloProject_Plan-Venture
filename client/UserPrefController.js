(function() {

UserPrefController.$inject = ['$http', '$state', 'DataService'];

angular
  .module('planVentureApp')
  .controller('UserPrefController', UserPrefController)

  function UserPrefController($http, $state, DataService) {
    var vm = this;

    vm.data = DataService.data;



    function defaultEquipment() {
      $http.get('/users/defaultEquip').then(defaultEquipSuccess, handleFailure);
    }

    function defaultEquipSuccess(response) {
      vm.defaultEquipment = response.data;
    }

    function handleFailure() {
      console.log('HTTP Request Failed');
    }
    defaultEquipment();
  }//end UserPrefController
})();
