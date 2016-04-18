"use strict";angular.module("familyWellnessChallengeApp",["familyWellnessChallengeApp.auth","familyWellnessChallengeApp.admin","familyWellnessChallengeApp.constants","ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","validation.match"]).config(["$urlRouterProvider","$locationProvider",function(e,t){e.otherwise("/"),t.html5Mode(!0)}]),angular.module("familyWellnessChallengeApp.admin",["familyWellnessChallengeApp.auth","ui.router"]),angular.module("familyWellnessChallengeApp.auth",["familyWellnessChallengeApp.constants","familyWellnessChallengeApp.util","ngCookies","ui.router"]).config(["$httpProvider",function(e){e.interceptors.push("authInterceptor")}]),angular.module("familyWellnessChallengeApp.util",[]),angular.module("familyWellnessChallengeApp").config(["$stateProvider",function(e){e.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginController",controllerAs:"vm"}).state("logout",{url:"/logout?referrer",referrer:"main",template:"",controller:["$state","Auth",function(e,t){var n=e.params.referrer||e.current.referrer||"main";t.logout(),e.go(n)}]}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupController",controllerAs:"vm"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsController",controllerAs:"vm",authenticate:!0})}]).run(["$rootScope",function(e){e.$on("$stateChangeStart",function(e,t,n,a){"logout"===t.name&&a&&a.name&&!a.authenticate&&(t.referrer=a.name)})}]);var LoginController=function(){function e(e,t){this.user={},this.errors={},this.submitted=!1,this.Auth=e,this.$state=t}return e.$inject=["Auth","$state"],e.prototype.login=function(e){var t=this;this.submitted=!0,e.$valid&&this.Auth.login({email:this.user.email,password:this.user.password}).then(function(){t.$state.go("main")})["catch"](function(e){t.errors.other=e.message})},e}();angular.module("familyWellnessChallengeApp").controller("LoginController",LoginController);var SettingsController=function(){function e(e){this.errors={},this.submitted=!1,this.Auth=e}return e.$inject=["Auth"],e.prototype.changePassword=function(e){var t=this;this.submitted=!0,e.$valid&&this.Auth.changePassword(this.user.oldPassword,this.user.newPassword).then(function(){t.message="Password successfully changed."})["catch"](function(){e.password.$setValidity("mongoose",!1),t.errors.other="Incorrect password",t.message=""})},e}();angular.module("familyWellnessChallengeApp").controller("SettingsController",SettingsController);var SignupController=function(){function e(e,t){this.user={},this.errors={},this.submitted=!1,this.Auth=e,this.$state=t}return e.$inject=["Auth","$state"],e.prototype.register=function(e){var t=this;this.submitted=!0,e.$valid&&this.Auth.createUser({name:this.user.name,email:this.user.email,password:this.user.password}).then(function(){t.$state.go("main")})["catch"](function(n){n=n.data,t.errors={},angular.forEach(n.errors,function(n,a){e[a].$setValidity("mongoose",!1),t.errors[a]=n.message})})},e}();angular.module("familyWellnessChallengeApp").controller("SignupController",SignupController),function(){var e=function(){function e(e){this.users=e.query()}return e.$inject=["User"],e.prototype["delete"]=function(e){e.$remove(),this.users.splice(this.users.indexOf(e),1)},e}();angular.module("familyWellnessChallengeApp.admin").controller("AdminController",e)}(),angular.module("familyWellnessChallengeApp.admin").config(["$stateProvider",function(e){e.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminController",controllerAs:"admin",authenticate:"admin"})}]),function(e,t){e.module("familyWellnessChallengeApp.constants",[]).constant("appConfig",{userRoles:["guest","user","admin"]})}(angular),function(){var e=function(){function e(e,t,n,a){this.$http=e,this.socket=n,this.awesomeThings=[],t.$on("$destroy",function(){n.unsyncUpdates("thing")}),a.path("/week")}return e.$inject=["$http","$scope","socket","$location"],e.prototype.$onInit=function(){var e=this;this.$http.get("/api/things").then(function(t){e.awesomeThings=t.data,e.socket.syncUpdates("thing",e.awesomeThings)})},e.prototype.addThing=function(){this.newThing&&(this.$http.post("/api/things",{name:this.newThing}),this.newThing="")},e.prototype.deleteThing=function(e){this.$http["delete"]("/api/things/"+e._id)},e}();angular.module("familyWellnessChallengeApp").component("main",{templateUrl:"app/main/main.html",controller:e})}(),angular.module("familyWellnessChallengeApp").config(["$stateProvider",function(e){e.state("main",{url:"/",template:"<main></main>"})}]),function(){function e(e){var n=new t(e.days);return n.start_weight=e.start_weight,n.end_weight=e.end_weight,n.number=e.number,n.user_id=e.user_id,n.id=e.id||e._id,n._id=n.id,e.$update&&(n.$update=e.$update),e.$save&&(n.$save=e.$save),e.$remove&&(n.$remove=e.$remove),n}var t=function(){function e(e){this.days=e}return e.prototype.score=function(){if(!this.start_weight||!this.end_weight)return 0;for(var e=0,t=0,n=0,a=0;a<this.days.length;a++){var o=this.days[a];o.water&&(e+=2),o.fruits+o.vegetables>=5&&(e+=3),o.fruits+o.vegetables>=5&&o.vegetables>=3&&(e+=2),o.nine&&(e+=2),o.personal_development&&(e+=5),o.exercise&&n++,t+=o.sweets}return e+=5*Math.min(n,5),3>=t?e+=30:4>=t?e+=20:5>=t&&(e+=10),this.end_weight<this.start_weight&&(e+=Math.round(12.5*(this.start_weight-this.end_weight))),this.points=e,e},e}(),n=function(){function t(t,n,a){this.WeekService=t,this.$scope=a,this.default_day_object={water:!1,fruits:0,vegetables:0,sweets:0,nine:!1,personal_development:!1,exercise:!1};var o=this.default_day_object;this.default_week_object=function(e,t){return{number:e,user_id:t,days:[o,o,o,o,o,o,o],start_weight:0,end_weight:0,points:0}};var s=this.default_week_object,r=n.get();console.log(r),r.$promise.then(function(){var n=t.getForUser({user_id:r._id});n.$promise.then(function(){for(var o=0;o<n.length;o++)n[o]=e(n[o]);if(console.log(n),n.length<=0)for(var l=0;8>l;l++){var i=new t(s(l,r._id));i.$save(function(t){n.push(e(t)),a.update_totals()})}a.weeks=n;for(var u=0,d=0;d<a.weeks.length;d++)console.log(a.weeks[d]),u+=a.weeks[d].score();a.total_points=u})}),a.update_totals=function(){for(var e=0;e<a.weeks.length;e++){var t=a.weeks[e];0!==e&&(t.start_weight=a.weeks[e-1].end_weight),t.score(),console.log("Updating week",t),t.$update()}for(var n=0,o=0;o<a.weeks.length;o++)n+=a.weeks[o].score();a.total_points=n},a.days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]}return t.$inject=["Week","User","$scope"],t}();angular.module("familyWellnessChallengeApp").component("week",{templateUrl:"app/week/week.html",controller:n})}(),angular.module("familyWellnessChallengeApp").service("Week",["$resource",function(e){var t=e("/api/weeks/:id/:user_id",{id:"@_id"},{update:{method:"PUT"},getForUser:{method:"GET",params:{id:"by-user",user_id:"@user_id"},isArray:!0}});return t}]),angular.module("familyWellnessChallengeApp").config(["$stateProvider",function(e){e.state("week",{url:"/week",template:"<week></week>"})}]),function(){function e(e,t,n,a,o,s,r){var l=s.safeCb,i={},u=o.userRoles||[];n.get("token")&&"/logout"!==e.path()&&(i=r.get());var d={login:function(e,o){var s=e.email,u=e.password;return t.post("/auth/local",{email:s,password:u}).then(function(e){return n.put("token",e.data.token),i=r.get(),i.$promise}).then(function(e){return l(o)(null,e),e})["catch"](function(e){return d.logout(),l(o)(e.data),a.reject(e.data)})},logout:function(){n.remove("token"),i={}},createUser:function(e,t){return r.save(e,function(a){return n.put("token",a.token),i=r.get(),l(t)(null,e)},function(e){return d.logout(),l(t)(e)}).$promise},changePassword:function(e,t,n){return r.changePassword({id:i._id},{oldPassword:e,newPassword:t},function(){return l(n)(null)},function(e){return l(n)(e)}).$promise},getCurrentUser:function(e){if(0===arguments.length)return i;var t=i.hasOwnProperty("$promise")?i.$promise:i;return a.when(t).then(function(t){return l(e)(t),t},function(){return l(e)({}),{}})},isLoggedIn:function(e){return 0===arguments.length?i.hasOwnProperty("role"):d.getCurrentUser(null).then(function(t){var n=t.hasOwnProperty("role");return l(e)(n),n})},hasRole:function(e,t){var n=function(e,t){return u.indexOf(e)>=u.indexOf(t)};return arguments.length<2?n(i.role,e):d.getCurrentUser(null).then(function(a){var o=a.hasOwnProperty("role")?n(a.role,e):!1;return l(t)(o),o})},isAdmin:function(){return d.hasRole.apply(d,[].concat.apply(["admin"],arguments))},getToken:function(){return n.get("token")}};return d}e.$inject=["$location","$http","$cookies","$q","appConfig","Util","User"],angular.module("familyWellnessChallengeApp.auth").factory("Auth",e)}(),function(){function e(e,t,n,a,o){var s;return{request:function(e){return e.headers=e.headers||{},n.get("token")&&o.isSameOrigin(e.url)&&(e.headers.Authorization="Bearer "+n.get("token")),e},responseError:function(e){return 401===e.status&&((s||(s=a.get("$state"))).go("login"),n.remove("token")),t.reject(e)}}}e.$inject=["$rootScope","$q","$cookies","$injector","Util"],angular.module("familyWellnessChallengeApp.auth").factory("authInterceptor",e)}(),function(){angular.module("familyWellnessChallengeApp.auth").run(["$rootScope","$state","Auth",function(e,t,n){e.$on("$stateChangeStart",function(e,a){a.authenticate&&("string"==typeof a.authenticate?n.hasRole(a.authenticate,_.noop).then(function(a){return a?void 0:(e.preventDefault(),n.isLoggedIn(_.noop).then(function(e){t.go(e?"main":"login")}))}):n.isLoggedIn(_.noop).then(function(n){n||(e.preventDefault(),t.go("main"))}))})}])}(),function(){function e(e){return e("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}e.$inject=["$resource"],angular.module("familyWellnessChallengeApp.auth").factory("User",e)}(),angular.module("familyWellnessChallengeApp").directive("footer",function(){return{templateUrl:"components/footer/footer.html",restrict:"E",link:function(e,t){t.addClass("footer")}}}),angular.module("familyWellnessChallengeApp").factory("Modal",["$rootScope","$uibModal",function(e,t){function n(n,a){void 0===n&&(n={}),void 0===a&&(a="modal-default");var o=e.$new();return angular.extend(o,n),t.open({templateUrl:"components/modal/modal.html",windowClass:a,scope:o})}return{confirm:{"delete":function(e){return void 0===e&&(e=angular.noop),function(){var t,a=Array.prototype.slice.call(arguments),o=a.shift();t=n({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+o+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(e){t.close(e)}},{classes:"btn-default",text:"Cancel",click:function(e){t.dismiss(e)}}]}},"modal-danger"),t.result.then(function(t){e.apply(t,a)})}}}}}]),angular.module("familyWellnessChallengeApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(e,t,n,a){t.on("keydown",function(){return a.$setValidity("mongoose",!0)})}}});var NavbarController=function(){function e(e){this.menu=[{title:"Home",state:"main"}],this.isCollapsed=!0,this.isLoggedIn=e.isLoggedIn,this.isAdmin=e.isAdmin,this.getCurrentUser=e.getCurrentUser}return e.$inject=["Auth"],e}();angular.module("familyWellnessChallengeApp").controller("NavbarController",NavbarController),angular.module("familyWellnessChallengeApp").directive("navbar",function(){return{templateUrl:"components/navbar/navbar.html",restrict:"E",controller:"NavbarController",controllerAs:"nav"}}),angular.module("familyWellnessChallengeApp").controller("OauthButtonsCtrl",["$window",function(e){this.loginOauth=function(t){e.location.href="/auth/"+t}}]),angular.module("familyWellnessChallengeApp").directive("oauthButtons",function(){return{templateUrl:"components/oauth-buttons/oauth-buttons.html",restrict:"EA",controller:"OauthButtonsCtrl",controllerAs:"OauthButtons",scope:{classes:"@"}}}),angular.module("familyWellnessChallengeApp").factory("socket",["socketFactory",function(e){var t=io("",{path:"/socket.io-client"}),n=e({ioSocket:t});return{socket:n,syncUpdates:function(e,t,a){a=a||angular.noop,n.on(e+":save",function(e){var n=_.find(t,{_id:e._id}),o=t.indexOf(n),s="created";n?(t.splice(o,1,e),s="updated"):t.push(e),a(s,e,t)}),n.on(e+":remove",function(e){var n="deleted";_.remove(t,{_id:e._id}),a(n,e,t)})},unsyncUpdates:function(e){n.removeAllListeners(e+":save"),n.removeAllListeners(e+":remove")}}}]),function(){function e(e){var t={safeCb:function(e){return angular.isFunction(e)?e:angular.noop},urlParse:function(e){var t=document.createElement("a");return t.href=e,""===t.host&&(t.href=t.href),t},isSameOrigin:function(n,a){return n=t.urlParse(n),a=a&&[].concat(a)||[],a=a.map(t.urlParse),a.push(e.location),a=a.filter(function(e){return n.hostname===e.hostname&&n.port===e.port&&n.protocol===e.protocol}),a.length>=1}};return t}e.$inject=["$window"],angular.module("familyWellnessChallengeApp.util").factory("Util",e)}(),angular.module("familyWellnessChallengeApp").run(["$templateCache",function(e){e.put("app/admin/admin.html",'<div class="container"><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class="list-group"><li ng-repeat="user in admin.users" class="list-group-item"><strong>{{user.name}}</strong><br/><span class="text-muted">{{user.email}}</span><a ng-click="admin.delete(user)" class="trash"><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),e.put("app/main/main.html",'<header id="banner" class="hero-unit"><div class="container"><h1>\'Allo, \'Allo!</h1><p class="lead">Kick-start your next web app with Angular Fullstack</p><img src="assets/images/yeoman-462ccecbb1.png" alt="I\'m Yeoman"/></div></header><div class="container"><div class="row"><div class="col-lg-12"><h1 class="page-header">Features:</h1><ul ng-repeat="thing in $ctrl.awesomeThings" class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6"><li><a href="#" uib-tooltip="{{thing.info}}">{{thing.name}}<button type="button" ng-click="$ctrl.deleteThing(thing)" class="close">&times;</button></a></li></ul></div></div><form class="thing-form"><label>Syncs in realtime across clients</label><p class="input-group"><input type="text" placeholder="Add a new thing here." ng-model="$ctrl.newThing" class="form-control"/><span class="input-group-btn"><button type="submit" ng-click="$ctrl.addThing()" class="btn btn-primary">Add New</button></span></p></form></div>'),e.put("app/week/week.html",'<h1>Your Points</h1><h3>Please note that the points from a week will only get added to your totals if the week has both a start weight and an end weight. That was the easiest way I could think of to keep my scoring algorithm from automatically giving you points for not eating sweets in all of the future weeks.</h3><div class="weekly-points"><uib-tabset active="active"><uib-tab index="$index + 1" ng-repeat="week in weeks" heading="Week {{$index + 1}}" active="tab.active"><!-- Add the totals for each week--><table><thead><tr><th></th><th ng-repeat="day in days">{{day}}</th></tr></thead><tbody><tr><td>Did you drink at least 64 oz of water?</td><td ng-repeat="day in days"><input type="checkbox" ng-model="week.days[$index].water" ng-change="update_totals();"/></td></tr><tr><td>How many servings of fruit did you eat?</td><td ng-repeat="day in days"><input type="number" min="0" ng-model="week.days[$index].fruits" ng-change="update_totals();"/></td></tr><tr><td>How many servings of vegetables did you eat?</td><td ng-repeat="day in days"><input type="number" min="0" ng-model="week.days[$index].vegetables" ng-change="update_totals();"/></td></tr><tr><td>How many sweets did you eat?</td><td ng-repeat="day in days"><input type="number" min="0" ng-model="week.days[$index].sweets" ng-change="update_totals();"/></td></tr><tr><td>Did you stop eating before 9 PM</td><td ng-repeat="day in days"><input type="checkbox" ng-model="week.days[$index].nine" ng-change="update_totals();"/></td></tr><tr><td>Did you complete your personal development?</td><td ng-repeat="day in days"><input type="checkbox" ng-model="week.days[$index].personal_development" ng-change="update_totals();"/></td></tr><tr><td>Did you complete at least 30 minutes of exercise?</td><td ng-repeat="day in days"><input type="checkbox" ng-model="week.days[$index].exercise" ng-change="update_totals();"/></td></tr></tbody></table><div class="weight"><label>Your starting weight for the week:</label><input ng-if="$index==0" type="number" min="0" ng-model="week.start_weight" ng-change="update_totals();"/><span ng-if="$index != 0">{{week.start_weight}}</span></div><div class="weight"><label>Your end weight for the week:</label><input type="number" min="0" ng-model="week.end_weight" ng-change="update_totals()"/></div><div class="total-weekly-points"><label>Total points for the week:</label><div class="total-weekly-points">{{week.points || 0}}</div></div></uib-tab></uib-tabset><div class="total-points"><label>Your total points for the challenge: {{total_points}}</label></div></div>'),e.put("components/modal/modal.html",'<div class="modal-header"><button ng-if="modal.dismissable" type="button" ng-click="$dismiss()" class="close">&times;</button><h4 ng-if="modal.title" ng-bind="modal.title" class="modal-title"></h4></div><div class="modal-body"><p ng-if="modal.text" ng-bind="modal.text"></p><div ng-if="modal.html" ng-bind-html="modal.html"></div></div><div class="modal-footer"><button ng-repeat="button in modal.buttons" ng-class="button.classes" ng-click="button.click($event)" ng-bind="button.text" class="btn"></button></div>'),e.put("components/footer/footer.html",'<div class="container"><p>Angular Fullstack v3.5.0 | <a href="https://twitter.com/tyhenkel">@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div>'),e.put("components/navbar/navbar.html",'<div ng-controller="NavbarController" class="navbar navbar-default navbar-static-top"><div class="container"><div class="navbar-header"><button type="button" ng-click="nav.isCollapsed = !nav.isCollapsed" class="navbar-toggle"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a href="/" class="navbar-brand">Healthy Living Challenge</a></div><div id="navbar-main" uib-collapse="nav.isCollapsed" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-repeat="item in nav.menu" ui-sref-active="active"><a ui-sref="{{item.state}}">{{item.title}}</a></li><li ng-show="nav.isAdmin()" ui-sref-active="active"><a ui-sref="admin">Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide="nav.isLoggedIn()" ui-sref-active="active"><a ui-sref="signup">Sign up</a></li><li ng-hide="nav.isLoggedIn()" ui-sref-active="active"><a ui-sref="login">Login</a></li><li ng-show="nav.isLoggedIn()"><p class="navbar-text">Hello {{ nav.getCurrentUser().name }}</p></li><li ng-show="nav.isLoggedIn()" ui-sref-active="active"><a ui-sref="settings"><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show="nav.isLoggedIn()"><a ui-sref="logout">Logout</a></li></ul></div></div></div>'),e.put("components/oauth-buttons/oauth-buttons.html",'<a ng-class="classes" ng-click="OauthButtons.loginOauth(&quot;facebook&quot;)" class="btn btn-social btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a><a ng-class="classes" ng-click="OauthButtons.loginOauth(&quot;google&quot;)" class="btn btn-social btn-google"><i class="fa fa-google-plus"></i> Connect with Google+</a>'),e.put("app/account/login/login.html",'<div class="container"><div class="row"><div class="col-sm-12"><h1>Login</h1></div><div class="col-sm-12"><form name="form" ng-submit="vm.login(form)" novalidate="" class="form"><div class="form-group"><label>Email</label><input type="email" name="email" ng-model="vm.user.email" class="form-control"/></div><div class="form-group"><label>Password</label><input type="password" name="password" ng-model="vm.user.password" class="form-control"/></div><div class="form-group has-error"><p ng-show="form.email.$error.required &amp;&amp; form.password.$error.required &amp;&amp; vm.submitted" class="help-block">Please enter your email and password.</p><p class="help-block">{{ vm.errors.other }}</p></div><div><button type="submit" class="btn btn-inverse btn-lg btn-login">Login</button> <a ui-sref="signup" class="btn btn-default btn-lg btn-register">Register</a></div><hr/></form></div></div><hr/></div>'),e.put("app/account/settings/settings.html",'<div class="container"><div class="row"><div class="col-sm-12"><h1>Change Password</h1></div><div class="col-sm-12"><form name="form" ng-submit="vm.changePassword(form)" novalidate="" class="form"><div class="form-group"><label>Current Password</label><input type="password" name="password" ng-model="vm.user.oldPassword" mongoose-error="" class="form-control"/><p ng-show="form.password.$error.mongoose" class="help-block">{{ vm.errors.other }}</p></div><div class="form-group"><label>New Password</label><input type="password" name="newPassword" ng-model="vm.user.newPassword" ng-minlength="3" required="" class="form-control"/><p ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) &amp;&amp; (form.newPassword.$dirty || vm.submitted)" class="help-block">Password must be at least 3 characters.</p></div><div class="form-group"><label>Confirm New Password</label><input type="password" name="confirmPassword" ng-model="vm.user.confirmPassword" match="vm.user.newPassword" ng-minlength="3" required="" class="form-control"/><p ng-show="fvm.orm.confirmPassword.$error.match &amp;&amp; vm.submitted" class="help-block">Passwords must match.</p></div><p class="help-block"> {{ vm.message }}</p><button type="submit" class="btn btn-lg btn-primary">Save changes</button></form></div></div></div>'),e.put("app/account/signup/signup.html",'<div class="container"><div class="row"><div class="col-sm-12"><h1>Sign up</h1></div><div class="col-sm-12"><form name="form" ng-submit="vm.register(form)" novalidate="" class="form"><div ng-class="{ &quot;has-success&quot;: form.name.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.name.$invalid &amp;&amp; vm.submitted }" class="form-group"><label>Name</label><input type="text" name="name" ng-model="vm.user.name" required="" class="form-control"/><p ng-show="form.name.$error.required &amp;&amp; vm.submitted" class="help-block">A name is required</p></div><div ng-class="{ &quot;has-success&quot;: form.email.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.email.$invalid &amp;&amp; vm.submitted }" class="form-group"><label>Email</label><input type="email" name="email" ng-model="vm.user.email" required="" mongoose-error="" class="form-control"/><p ng-show="form.email.$error.email &amp;&amp; vm.submitted" class="help-block">Doesn\'t look like a valid email.</p><p ng-show="form.email.$error.required &amp;&amp; vm.submitted" class="help-block">What\'s your email address?</p><p ng-show="form.email.$error.mongoose" class="help-block">{{ vm.errors.email }}</p></div><div ng-class="{ &quot;has-success&quot;: form.password.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.password.$invalid &amp;&amp; vm.submitted }" class="form-group"><label>Password</label><input type="password" name="password" ng-model="vm.user.password" mongoose-error="" ng-minlength="3" required="" class="form-control"/><p ng-show="(form.password.$error.minlength || form.password.$error.required) &amp;&amp; vm.submitted" class="help-block">Password must be at least 3 characters.</p><p ng-show="form.password.$error.mongoose" class="help-block">{{ vm.errors.password }}</p></div><div ng-class="{ &quot;has-success&quot;: form.confirmPassword.$valid &amp;&amp; vm.submitted,        &quot;has-error&quot;: form.confirmPassword.$invalid &amp;&amp; vm.submitted }" class="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" ng-model="vm.user.confirmPassword" match="vm.user.password" ng-minlength="3" required="" class="form-control"/><p ng-show="form.confirmPassword.$error.match &amp;&amp; vm.submitted" class="help-block">Passwords must match.</p></div><div><button type="submit" class="btn btn-inverse btn-lg btn-register">Sign up</button> <a ui-sref="login" class="btn btn-default btn-lg btn-login">Login</a></div><hr/></form></div></div><hr/></div>')}]);