(function() {

uiRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

angular.module('planVentureApp').config(uiRouter, ngMaps);

function ngMaps(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCzFyDKBzayeWKY35PiAIbP7ToySvY-Txo',
      v: '3.20',
      libraries: 'weather,geometry,visualization'
    });
}

function uiRouter($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('index');

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: '/components/common/main.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/components/user/login.html',
      controller: 'LoginController',
      controllerAs: 'log'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/components/user/register.html',
      controller: 'RegisterController',
      controllerAs: 'reg'
    })
    .state('trips', {
      url: '/trips',
      templateUrl: '/components/trips/list.html',
      controller: 'TripsListController',
      controllerAs: 'trips'
    })
    .state('trip', {
      abstract: true,
      url: '/trip/:tripId',
      templateUrl: '/components/trips/trip.html',
      controller: 'TripInfoController',
      controllerAs: 'trip',
      resolve: {
        trip: function($stateParams, TripService) {
          return TripService.getOverview($stateParams.tripId);
        },
        tripId: function($stateParams) {
          return $stateParams.tripId;
        },
        print: function($stateParams, TripService) {
            return TripService.getMenu($stateParams.tripId);
        }
      }
    })
    .state('trip.overview', {
      url: '/overview',
      templateUrl: '/components/trips/detail.html'
    })
    .state('trip.equipment', {
      url: '/equipment',
      templateUrl: '/components/trips/equipment.html'
    })
    .state('trip.menu', {
      url: '/menu',
      templateUrl: '/components/trips/menu.html'
    })
    .state('trip.map', {
      url: '/map',
      templateUrl: '/components/trips/map.html'
    })
    .state('trip.print', {
      url: '/print',
      templateUrl: '/components/trips/print.html',
      controller: 'PrintController',
      controllerAs: 'print',
      resolve: {
        print: function($stateParams, TripService) {
          return TripService.getMenu($stateParams.tripId);
        }
      }
    })
    .state('user', {
      url: '/user',
      abstract: true,
      templateUrl: '/components/user/user.html',
      controller: 'UserController',
      controllerAs: 'user'
    })
    .state('user.preferences', {
      url: '/preferences',
      templateUrl: '/components/user/preferences.html'
    })
    .state('user.createTrip', {
      url: '/create',
      templateUrl: '/components/trips/create.html',
      controller: 'CreateTripController',
      controllerAs: 'create',
      resolve: {
        trips: function(TripService) {
          return TripService.getTrips();
        }
      }
    })
    .state('user.joinTrip', {
      url: '/join',
      templateUrl: '/components/trips/join.html',
      controller: 'JoinTripController',
      controllerAs: 'join'
    });

  $locationProvider.html5Mode(true);
}

})();
