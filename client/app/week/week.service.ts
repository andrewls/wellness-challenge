'use strict';

angular.module('familyWellnessChallengeApp')
  .service('Week', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var resource = $resource('/api/weeks/:id/:user_id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT',
      },
      getForUser: {
        method: 'GET',
        params: {
          id: 'by-user',
          user_id: '@user_id'
        },
        isArray: true
      }
    });
    return resource;
  });
