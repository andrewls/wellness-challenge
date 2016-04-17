'use strict';

describe('Component: WeekComponent', function () {

  // load the controller's module
  beforeEach(module('familyWellnessChallengeApp'));

  var WeekComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    WeekComponent = $componentController('WeekComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
