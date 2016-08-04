(function() {

EquipmentService.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .factory('EquipmentService', EquipmentService);

  function EquipmentService($http, $state) {
    var data = {};


    function addDefaultEquipment(data) {
      return $http.post('/users/addEquip', data).then(editEquipSuccess, handleFailure);
    }

    function removeDefaultEquipment(data) {
      console.log(data.id);
      return $http.delete('/users/remEquip/' + data.id).then(editEquipSuccess, handleFailure);
    }

    function getDefaultEquipment() {
      return $http.get('/users/defaultEquip').then(defaultEquipSuccess, handleFailure);
    }

    function editEquipSuccess(response) {
      return;
    }

    function defaultEquipSuccess(response) {
      return response.data
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
