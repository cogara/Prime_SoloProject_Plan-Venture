(function() {

EquipmentService.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .factory('EquipmentService', EquipmentService);

  function EquipmentService($http, $state) {
    var data = {};


    function addDefaultEquipment(data) {
      $http.post('/users/addEquip', data).then(editEquipSuccess, handleFailure);
    }

    function removeDefaultEquipment(data) {
      console.log(data.id);
      $http.delete('/users/remEquip/' + data.id).then(editEquipSuccess, handleFailure);
    }

    function getDefaultEquipment() {
      $http.get('/users/defaultEquip').then(defaultEquipSuccess, handleFailure);
    }

    function editEquipSuccess(response) {
      getDefaultEquipment();
    }

    function editEquipSuccess(response) {
      getDefaultEquipment();
    }

    function defaultEquipSuccess(response) {
      data.defaultEquipment = response.data;
    }

    function handleFailure() {
      console.log('HTTP Request Failed');
    }

    return {
      data: data,
      getDefaultEquipment: getDefaultEquipment,
      addDefaultEquipment: addDefaultEquipment,
      removeDefaultEquipment: removeDefaultEquipment
    }
  }


})();
