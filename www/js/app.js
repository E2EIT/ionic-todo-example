// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
		.factory('Projects', function () {
			return {
				all: function() {
					var projectString = window.localStorage['projects'];
					if (projectString) {
						return angular.fromJson(projectString);
					}
					return [];
				},

				save: function(projects) {
					window.localStorage['projects'] = angular.toJson(projects);
				},

				newProject: function(projectTitle) {
					return {
						title: projectTitle,
						tasks: []
					};
				},

				getLastActiveIndex: function() {
					return parseInt(window.localStorage['lastActiveProject']) || 0;
				},

				setLastActiveIndex: function(index) {
					window.localStorage['lastActiveProject'] = index;
				}
			}
		})

		.controller('ToDoCtrl', function ($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

			// A utility function for creating a new project
			// with the given projectTitle
			var createProject = function(projectTitle) {
				var newProject = Projects.newProject(projectTitle);
				$scope.projects.push(newProject);
				Projects.save($scope.projects);
				$scope.selectProject(newProject, $scope.projects.length-1);
			};

			// Load or initialize projects
			$scope.projects = Projects.all();

			// Grab the last active, or the first project
			$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

			// Called to create a new project
			$scope.newProject = function() {
				var projectTitle = prompt('Project Name');
				if (projectTitle) {
					createProject(projectTitle);
				}
			};

			// Called to select the given project
			$scope.selectProject = function(project, index) {
				$scope.activeProject = project;
				Projects.setLastActiveIndex(index);
				// Make sure the side menu is closed by sending false
				$ionicSideMenuDelegate.toggleLeft(false);
			};

			// ToDo: Do we still need this?
			$scope.tasks = [];

			// Create and load the Modal
			$ionicModal.fromTemplateUrl('new-task.html', function (modal) {
				$scope.taskModal = modal;
			}, {
				scope: $scope,
				animation: 'slide-in-up'
			});

			// Called when form is submitted
			$scope.createTask = function (task) {
				// Need both and active project and a task
				if (!$scope.activeProject || !task) {
					// Do nothing
					return;
				}
				$scope.activeProject.tasks.push({
					title: task.title
				});
				$scope.taskModal.hide();
				// Inefficient, but fine for our simple project
				Projects.save($scope.projects);
				// Clear the task title
				task.title = "";
			};

			// Open the new task modal
			$scope.newTask = function () {
				$scope.taskModal.show();
			};

			// Close the new task modal
			$scope.closeNewTask = function () {
				$scope.taskModal.hide();
			};

			// Toggle the project side menu
			$scope.toggleProjects = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			// Try to create the first project, make sure to defer
			// this by using $timeout so everything is initialized
			// properly
			$timeout(function() {
				if($scope.projects.length == 0) {
					while(true) {
						var projectTitle = prompt('Your first project title:');
						if(projectTitle) {
							createProject(projectTitle);
							break;
						}
					}
				}
			});
		})

		.run(function ($ionicPlatform) {
			$ionicPlatform.ready(function () {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				if (window.cordova && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				}
				if (window.StatusBar) {
					StatusBar.styleDefault();
				}
			});
		});
