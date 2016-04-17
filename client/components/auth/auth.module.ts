'use strict';

angular.module('familyWellnessChallengeApp.auth', [
  'familyWellnessChallengeApp.constants',
  'familyWellnessChallengeApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
