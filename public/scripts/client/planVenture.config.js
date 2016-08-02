(function() {

uiRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

angular.module('planVentureApp').config(uiRouter);

function uiRouter($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('index');

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: '/views/main.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'LoginController',
      controllerAs: 'log'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/views/register.html',
      controller: 'RegisterController',
      controllerAs: 'reg'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/views/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dash'
    })
    .state('dashboard.tripDisplay', {
      abstract: true,
      url: '/tripDisplay',
      templateUrl: '/views/tripDisplay.html'
      // controller: 'TripInfoController',
      // controllerAs: 'trip'
    })
    .state('dashboard.tripDisplay.tripOverview', {
      url: '/overview',
      templateUrl: '/views/tripOverview.html'
    })
    .state('dashboard.tripDisplay.tripEquipment', {
      url: '/equipment',
      templateUrl: '/views/tripEquipment.html',
      // controller: 'TripEquipmentController',
      // controllerAs: 'equip'
    })
    .state('dashboard.createTrip', {
      url: '/create',
      templateUrl: '/views/createTrip.html',
      controller: 'CreateTripController',
      controllerAs: 'create'
    })
    .state('route1', {
      url: '/route1',
      templateUrl: '/views/state1.html'
    })
      .state('route1.list', {
        url: '/list',
        templateUrl: '/views/state1.list.html'
        // controller: 'StateOneController',
        // controllerAs: 'one'
      })

    .state('route2', {
      url: '/route2',
      templateUrl: '/views/state2.html'
    })
      .state('route2.list', {
        url: '/list',
        templateUrl: '/views/state2.list.html'
        // controller: 'StateTwoController',
        // controllerAs: 'two'
      })
      .state('route2.stuff', {
        url: '/stuff',
        templateUrl: '/views/state2.stuff.html'
        // controller: 'StateTwoController',
        // controllerAs: 'two'
      })
      .state('route2.more', {
        url: '/more',
        templateUrl: '/views/state2.more.html'
        // controller: 'StateTwoController',
        // controllerAs: 'two'
      })

  $locationProvider.html5Mode(true);
}

})();
