'use strict';

(function() {

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


class MainController {

  constructor(Week, User, $scope) {
    // Get all of the users. Get all of the points objects.
    // Update so that we sort the points objects by week number
    // for each week, we go ahead and just create a ranking
    var users = User.query();
    var points = Week.query();

    points.$promise.then(function() {
      users.$promise.then(function() {
        var usersById = {};
        for (var user of users) {
          console.log("Assinging user ", user);
          usersById[user._id] = user.name;
        }

        console.log("User by id", usersById);

        var rankings = [[], [], [], [], [], [], [], []];

        for (var user_week of points) {
          console.log("User week", user_week);
          rankings[user_week.number].push({
            user: usersById[user_week.user_id],
            score: makeWeekFromWeekPoints(user_week).score()
          });
        }

        for (var i = 0; i < rankings.length; i++) {
          rankings[i] = rankings[i].sort(function(a, b) {
            return b.score - a.score;
          });

          var current_score = 0;
          var current_rank = 0;

          for (var j = 0; j < rankings[i].length; j++) {
            if (rankings[i][j].score === current_score) {
              rankings[i][j].rank = current_rank;
            }
            else {
              rankings[i][j].rank = ++current_rank;
            }
          }
        }

        $scope.weeks = rankings;
        console.log($scope.weeks);
      });
    });


  }

}

angular.module('familyWellnessChallengeApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
