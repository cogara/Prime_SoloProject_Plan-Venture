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
    .state('user', {
      url: '/user',
      abstract: true,
    })
    .state('user.dashboard', {
      url: '/dashboard',
      templateUrl: '/views/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dash'
    })
    .state('user.createTrip', {
      url: '/create',
      templateUrl: '/views/createTrip.html',
      controller: 'CreateTripController',
      controllerAs: 'create'
    })
    .state('user.dashboard.tripDisplay', {
      abstract: true,
      url: '/tripDisplay',
      templateUrl: '/views/tripDisplay.html'
      // controller: 'TripInfoController',
      // controllerAs: 'trip'
    })
    .state('user.dashboard.tripDisplay.tripOverview', {
      url: '/overview',
      templateUrl: '/views/tripOverview.html'
    })
    .state('user.dashboard.tripDisplay.tripEquipment', {
      url: '/equipment',
      templateUrl: '/views/tripEquipment.html'
      // controller: 'TripEquipmentController',
      // controllerAs: 'equip'
    })
    .state('user.dashboard.tripDisplay.tripMenu', {
      url: '/menu',
      templateUrl: '/views/tripMenu.html',
      controller: 'TripMenuController',
      controllerAs: 'menu'
    })
    .state('user.dashboard.joinTrip', {
      url: '/join',
      templateUrl: '/views/joinTrip.html',
      controller: 'JoinTripController',
      controllerAs: 'join'
    })
    .state('user.dashboard.preferences', {
      url: '/preferences',
      templateUrl: '/views/preferences.html',
      controller: 'UserPrefController',
      controllerAs: 'user'
    });

  $locationProvider.html5Mode(true);
}

})();
