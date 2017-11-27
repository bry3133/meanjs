// Controller for when the admin edits an indiviual user and wants to add comments and approve of the page
(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditUserController', EditUserController);

  EditUserController.$inject = ['$scope', '$state', '$stateParams', '$window', 'Authentication', 'Notification', 'AdminPowers', '$http', '$location', 'ProfileService'];

  function EditUserController($scope, $state, $stateParams, $window, Authentication, Notification, AdminPowers, $http, $location, ProfileService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = $stateParams.user;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    // Change the area that the user is in if they are not an admin
    if (vm.authentication.user.type !== 'admin') {
      if (vm.authentication.type === 'sponsor') {
        $state.go('catalog');
      } else if (vm.authentication.type === 'student') {
        $state.go('profile');
      } else {
        $state.go('home');
      }
    }

    if (vm.user === null) {
      loadUserFromURL();
    }

// Download the infomation of the user
    function loadUserFromURL() {
      if ($location.search().username) {
        var username = $location.search().username;
        ProfileService.getProfileWithUsername(username).then(onGetProfileSuccess).catch(onGetProfileFailure);
      } else {
        Notification.error({ message: 'Could not load student profile' });
      }
    }

    function onGetProfileSuccess(response) {
      vm.user = response;
    }

    function onGetProfileFailure(response) {
      Notification.error({ message: 'Could not load student profile' });
    }

// Function that allows the admin ot delete a user in the database
    $scope.remove = function () {
      if (vm.authentication.user.type !== 'admin') {
        $state.go('home');
      }

      if ($window.confirm('Are you sure you want to delete this user?')) {
        var user = vm.user;
        $http.delete('/api/admin/deleteUser/' + user._id, user).then(function (response) {
          onUserDeleteSuccess(response);
        }, function (error) {
          onUserDeleteFailure(error);
        });
      }
    };

// Function to update infomaion for the user like their name or approval status
    $scope.update = function (isValid) {
      if (vm.authentication.user.type !== 'admin') {
        $state.go('home');
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      // CatalogService.sponsorGetStudents().then(onUserUpdateSuccess).catch(onUserUpdateFailure);
      // AdminPowers.adminUpdateUser(user).then(onUserUpdateSuccess).catch(onUserUpdateFailure);

      $http.put('/api/admin/updateUser/' + user._id, user).then(function (response) {
        onUserUpdateSuccess(response);
      }, function (error) {
        onUserUpdateFailure(error);
      });
    };

// Function that changes the approval status of a user in the database depending on what the admin selects
    $scope.switchApproval = function () {
      var yes = document.getElementById('yes');
      var no = document.getElementById('no');

      if (no.checked) {
        yes.checked = false;
        no.checked = true;
        vm.user.approve = false;
      } else if (yes.checked) {
        no.checked = false;
        yes.checked = true;
        vm.user.approve = true;
      }
    };

    function onUserUpdateSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User Updated successfully!' });
    }

    function onUserUpdateFailure(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
    }

    function onUserDeleteSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User Deleted successfully!' });
      $state.go('catalog');
    }

    function onUserDeleteFailure(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User delete error!' });
    }
  }
}());
