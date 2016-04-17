'use strict';
(function(){


interface Points {
  water: boolean;
  fruits: number;
  vegetables: number;
  sweets: number;
  nine: boolean;
  personal_development: boolean;
  exercise: boolean;
}

interface WeekPoints {
  id: string;
  number: number;
  user_id: string;
  days: Points[];
  start_weight: number;
  end_weight: number;
  points: number;
}

class Week implements WeekPoints {
  constructor(points: Points[]) {
    this.days = points;
  }

  score(): number {
    // we only actually want to return a score for weeks that we're doing. Determine this with start weight for the week.
    if (!this.start_weight || !this.end_weight) return 0;
    var sum = 0;
    var sweets = 0;
    var days_exercised = 0;
    for (var i = 0; i < this.days.length; i++) {
      var day = this.days[i];
      if (day.water) sum += 2; // add water points for each day
      if (day.fruits + day.vegetables >= 5) sum += 3; // fruit and veggie points
      if (day.fruits + day.vegetables >= 5 && day.vegetables >= 3) sum += 2; // veggie points
      if (day.nine) sum += 2; // no eating after 9 points
      if (day.personal_development) sum += 5; // personal development points
      if (day.exercise) days_exercised++; // add to our exercise total
      sweets += day.sweets; // add to our exercise total
    }
    sum += 5 * (Math.min(days_exercised, 5)); // give the actual exercise points
    if (sweets <= 3) sum += 30;
    else if (sweets <= 4) sum += 20;
    else if (sweets <= 5) sum += 10;
    if (this.end_weight < this.start_weight) sum += Math.round((this.start_weight - this.end_weight) * 12.5);
    this.points = sum;
    return sum;
  }
}


function makeWeekFromWeekPoints(weekPoints: WeekPoints) {
  var week = new Week(weekPoints.days);
  week.start_weight = weekPoints.start_weight;
  week.end_weight = weekPoints.end_weight;
  week.number = weekPoints.number;
  week.user_id = weekPoints.user_id;
  week.id = weekPoints.id || weekPoints._id;
  week._id = week.id;
  if (weekPoints.$update) week.$update = weekPoints.$update;
  if (weekPoints.$save) week.$save = weekPoints.$save;
  if (weekPoints.$remove) week.$remove = weekPoints.$remove;
  return week;
}


class WeekController {
  constructor(Week, User, $scope) {
    this.WeekService = Week;
    this.$scope = $scope;
    this.default_day_object = {
      water: false,
      fruits: 0,
      vegetables: 0,
      sweets: 0,
      nine: false,
      personal_development: false,
      exercise: false
    };
    var default_day_object = this.default_day_object;

    this.default_week_object = function(number, userId) {
      return {
        number: number,
        user_id: userId,
        days: [default_day_object, default_day_object, default_day_object, default_day_object, default_day_object, default_day_object, default_day_object],
        start_weight: 0,
        end_weight: 0,
        points: 0
      };
    };
    var default_week_object = this.default_week_object;
    var currentUser = User.get();
    console.log(currentUser);
    currentUser.$promise.then(function() {
      var weeks = Week.getForUser({ user_id: currentUser._id });
      weeks.$promise.then(function() {
        for (var i = 0; i < weeks.length; i++) {
          weeks[i] = makeWeekFromWeekPoints(weeks[i]);
        }
        console.log(weeks);
        if (weeks.length <= 0) {
          // Create new weeks
          for (var j = 0; j < 8; j++) {
            var week = new Week(default_week_object(j, currentUser._id));
            week.$save(function(saved_week) {
              weeks.push(makeWeekFromWeekPoints(saved_week));
              // This is necessary for when we create them in the first place - hopefully it's had time to load by now (I'd be amazed if it hadn't)
              $scope.update_totals();
            });
          }
        }
        $scope.weeks = weeks;
        var sum = 0;
        for (var k = 0; k < $scope.weeks.length; k++) {
          console.log($scope.weeks[k]);
          sum += $scope.weeks[k].score();
        }
        $scope.total_points = sum;
      });
    });

    $scope.update_totals = function() {
      for (var i = 0; i < $scope.weeks.length; i++) {
        var week = $scope.weeks[i];
        if (i !== 0) week.start_weight = $scope.weeks[i - 1].end_weight;
        week.score();
        console.log('Updating week', week);
        week.$update();
        // Week.update({id: week._id}, week);
      }
      var sum = 0;
      for (var k = 0; k < $scope.weeks.length; k++) {
        sum += $scope.weeks[k].score();
      }
      $scope.total_points = sum;
    };
    $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }
}

angular.module('familyWellnessChallengeApp')
  .component('week', {
    templateUrl: 'app/week/week.html',
    controller: WeekController
  });

})();
