'use strict';

angular.module('familyWellnessChallengeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('week', {
        url: '/week',
        template: '<week></week>'
      });
  });
