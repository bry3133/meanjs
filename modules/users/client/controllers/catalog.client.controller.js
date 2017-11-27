// Controller to change what is updates and viewed in the html when interacting with the catalog
(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state', 'UsersService', 'CatalogService', 'Notification', '$window', 'Authentication', '$timeout'];

  function CatalogController($scope, $state, UsersService, CatalogService, Notification, $window, Authentication, $timeout) {
    var vm = this;
    vm.authentication = Authentication;

// Defining the variable that will be changes within the controller
    $scope.detailedInfo = null;
    $scope.lastSelectedIndex = null;
    $scope.studentsList = [];
    $scope.filteredStudentsList = [];
    $scope.sponsorsList = [];
    $scope.filteredSponsorsList = [];
    $scope.usersList = [];
    $scope.filteredUsersList = [];
    $scope.isEditable = false;
    $scope.searchValue = null;
    $scope.shouldShowFilters = false;
    $scope.availabilityOption = false;
    $scope.ABEOption = false;
    $scope.ASEOption = false;
    $scope.BEOption = false;
    $scope.BAOption = false;
    $scope.BMEOption = false;
    $scope.CHEOption = false;
    $scope.CIVOption = false;
    $scope.CISEOption = false;
    $scope.CPEOption = false;
    $scope.CSEOption = false;
    $scope.CSCOption = false;
    $scope.DASOption = false;
    $scope.ECEOption = false;
    $scope.EEOption = false;
    $scope.ENEOption = false;
    $scope.EESOption = false;
    $scope.ESSIEOption = false;
    $scope.ISEOption = false;
    $scope.MSEOption = false;
    $scope.MAEOption = false;
    $scope.MEOption = false;
    $scope.PKGOption = false;
    $scope.sponsorOption = false;
    $scope.studentOption = false;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    // Change were the type of user goes to if they are not in the correct screen
    if (vm.authentication.user.type !== 'sponsor' && vm.authentication.user.type !== 'admin') {
      if (vm.authentication.type === 'student') {
        $state.go('profile');
      } else {
        $state.go('home');
      }
    }

// Call the fucntion to ge tthe students in the database
    fetchStudents();

// Show the edit button for the user if they are admin
    if (vm.authentication.user.type === 'admin') {
      $scope.isEditable = true;
    }

    function fetchStudents() {
      // $http.get('/api/catalog/students').then(function (response) {
      //   onSponsorGetStudentsSuccess(response);
      // }, function (error) {
      //   onSponsorGetStudentsFailure(error);
      // });
      // The then and catch function for when the sponsor and admin want to see the students in the database
      CatalogService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsFailure);
    }

    function fetchSponsors() {
      // The then and catch function for when the admin want to see the sponsors in the database
      CatalogService.adminGetSponsors().then(onAdminGetSponsorsSuccess).catch(onAdminGetSponsorsFailure);
    }

    // For some reason it defaults to only a few variables on refresh so refetch self
    getSelf();

    function getSelf() {
      UsersService.getMe().then(onGetMeSuccess).catch(onGetMeFailure);
    }

    function onGetMeSuccess(response) {
      vm.authentication.user = response;
    }

    function onGetMeFailure(response) {
      Notification.error({ message: 'Could not load your profile fully' });
    }

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.filteredUsersList[index];
      $scope.lastSelectedIndex = index;
    };

    function onSponsorGetStudentsSuccess(response) {
      // Fucntion for when the fetching was a success. An array called studentsList is created
      $scope.studentsList = response;

// If the logged in user is a sponsor then you must filter through the studentsList for approved students
      if (vm.authentication.user.type === 'sponsor') {
        var originalList = Array.from($scope.studentsList);
        var approvedList = new Set();

        for (var i = 0; i < originalList.length; i++) {
          if (originalList[i].approve === (true)) {
            approvedList.add(originalList[i]);
          }
        }
        // Add all the students that are approved to the filteredStudnetsList and usersList
        $scope.filteredStudentsList = Array.from(approvedList);
        $scope.filteredUsersList = Array.from($scope.filteredStudentsList);
        $scope.usersList = Array.from(approvedList);
      }

// If the logged in user is a admin then jsut add all the students from the database to the usersList
      if (vm.authentication.user.type === 'admin') {
        $scope.filteredStudentsList = Array.from($scope.studentsList);
        $scope.filteredUsersList = Array.from($scope.filteredStudentsList);
        $scope.usersList = Array.from($scope.studentsList);
        fetchSponsors();
      }
    }

// Set the studnetList to null if the fetching was unsucessful
    function onSponsorGetStudentsFailure(response) {
      $scope.studentsList = null;
      $scope.filteredStudentsList = null;
    }

// Fucntion for when the admin wants to fetch sponsors was a success
    function onAdminGetSponsorsSuccess(response) {
      // add all the user with a type sponsors to the userList for the admin
      $scope.sponsorsList = response;
      $scope.filteredSponsorsList = Array.from($scope.sponsorsList);
      $scope.usersList = $scope.studentsList.concat($scope.sponsorsList);
      $scope.filteredUsersList = $scope.filteredStudentsList.concat($scope.filteredSponsorsList);
    }

    function onAdminGetSponsorsFailure(response) {
      $scope.sponsorList = null;
      $scope.filteredSponsorsList = null;
    }

// Function for when the admin clicked on the edit button so they can go edit and approve of users.
    $scope.editClicked = function (user) {
      if (vm.authentication.user.type === 'admin') {
        var username = user.username;
        var stateName = 'edit_user?username=' + username;
        var myWindow = window.open(stateName, '_self');
      }
    };

// Fucntion for when the user clicked on go to the studnt profile so they cna see the students profile page.
    $scope.goToStudentProfile = function () {
      if (vm.authentication.user.type === 'admin' || vm.authentication.user.type === 'sponsor') {
        var username = $scope.filteredUsersList[$scope.lastSelectedIndex].username;
        var stateName = 'student_profile?username=' + username;
        var myWindow = window.open(stateName, '_blank');
      }
    };

// Functio for when the admin or sponsor wants to email a certain user
    $scope.emailUser = function (user) {
      window.location.href = 'mailto:' + user.email;
    };

    $scope.toggleFilterOptions = function () {
      $scope.shouldShowFilters = !$scope.shouldShowFilters;
    };

    function storeValueForElement(element) {
      if (element.value.toLowerCase() === 'availability') {
        $scope.availabilityOption = element.checked;
      } else if (element.value.toLowerCase() === 'agricultural and biological engineering') {
        $scope.ABEOption = element.checked;
      } else if (element.value.toLowerCase() === 'aerospace engineering') {
        $scope.ASEOption = element.checked;
      } else if (element.value.toLowerCase() === 'biological engineering') {
        $scope.BEOption = element.checked;
      } else if (element.value.toLowerCase() === 'business administration') {
        $scope.BAOption = element.checked;
      } else if (element.value.toLowerCase() === 'biomedical engineering') {
        $scope.BMEOption = element.checked;
      } else if (element.value.toLowerCase() === 'chemical engineering') {
        $scope.CHEOption = element.checked;
      } else if (element.value.toLowerCase() === 'civil engineering') {
        $scope.CIVOption = element.checked;
      } else if (element.value.toLowerCase() === 'computer and information science engineering') {
        $scope.CISEOption = element.checked;
      } else if (element.value.toLowerCase() === 'computer engineering') {
        $scope.CPEOption = element.checked;
      } else if (element.value.toLowerCase() === 'computer science - engineering') {
        $scope.CSEOption = element.checked;
      } else if (element.value.toLowerCase() === 'computer science - liberal arts') {
        $scope.CSCOption = element.checked;
      } else if (element.value.toLowerCase() === 'digital arts and sciences') {
        $scope.DASOption = element.checked;
      } else if (element.value.toLowerCase() === 'electrical and computer engineering') {
        $scope.ECEOption = element.checked;
      } else if (element.value.toLowerCase() === 'electrical engineering') {
        $scope.EEOption = element.checked;
      } else if (element.value.toLowerCase() === 'environmental engineering') {
        $scope.ENEOption = element.checked;
      } else if (element.value.toLowerCase() === 'environmental engineering science') {
        $scope.EESOption = element.checked;
      } else if (element.value.toLowerCase() === 'engineering school for sustainable infrastructure and the environment') {
        $scope.ESSIEOption = element.checked;
      } else if (element.value.toLowerCase() === 'industrial and systems engineering') {
        $scope.ISEOption = element.checked;
      } else if (element.value.toLowerCase() === 'materials science and engineering') {
        $scope.MSEOption = element.checked;
      } else if (element.value.toLowerCase() === 'mechanical and aerospace engineering') {
        $scope.MAEOption = element.checked;
      } else if (element.value.toLowerCase() === 'mechanical engineering') {
        $scope.MEOption = element.checked;
      } else if (element.value.toLowerCase() === 'packaging sciences') {
        $scope.PKGOption = element.checked;
      } else if (element.value.toLowerCase() === 'sponsor') {
        $scope.sponsorOption = element.checked;
      } else if (element.value.toLowerCase() === 'student') {
        $scope.studentOption = element.checked;
      }
    }

    $scope.filterOnForm = function () {
      var formElements = document.getElementById('filterOptions').getElementsByTagName('input');
      var originalList = Array.from($scope.usersList);
      var filteredSet = new Set();

      var didFilter = false;
      var firstFilter = true;
      for (var i = 0; i < formElements.length; i++) {
        storeValueForElement(formElements[i]);
        if (formElements[i].checked) {
          didFilter = true;
          filterOnName(formElements[i].value, originalList, filteredSet, firstFilter);
          if (firstFilter) {
            firstFilter = false;
          }
        }
      }

      $scope.filteredUsersList = (didFilter) ? Array.from(filteredSet) : originalList;
    };

// Fucntion for the search dar that allows the user to filter through the database depending on the major, availablity and type of user
    function filterOnName(name, originalList, filteredSet, firstFilter) {
      var currentFilteredSet = new Set();

      for (var i = 0; i < originalList.length; i++) {
        if (name.toLowerCase() === 'availability' && originalList[i].availabilityStatus !== null && originalList[i].availabilityStatus !== undefined) {
          if (originalList[i].availabilityStatus.toLowerCase() === ('available')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'agricultural and biological engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('agricultural and biological engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'aerospace engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('aerospace engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'biological engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('biological engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'business administration' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('business administration')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'biomedical engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('biomedical engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'chemical engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('chemical engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'civil engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('civil engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'computer and information science engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('computer and information science engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'computer engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('computer engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'computer science - engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('computer science - engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'computer science - liberal arts' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('computer science - liberal arts')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'digital arts and sciences' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('digital arts and sciences')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'electrical and computer engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('electrical and computer engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'electrical engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('electrical engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'environmental engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('environmental engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'environmental engineering science' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('environmental engineering science')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'engineering school for sustainable infrastructure and the environment' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('engineering school for sustainable infrastructure and the environment')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'industrial and systems engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('industrial and systems engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'materials science and engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('materials science and engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'mechanical and aerospace engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('mechanical and aerospace engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'mechanical engineering' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('mechanical engineering')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'packaging sciences' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('packaging sciences')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'sponsor' && originalList[i].type !== null && originalList[i].type !== undefined) {
          if (originalList[i].type.toLowerCase() === ('sponsor')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'student' && originalList[i].type !== null && originalList[i].type !== undefined) {
          if (originalList[i].type.toLowerCase() === ('student')) {
            currentFilteredSet.add(originalList[i]);
          }
        }
      }

      if (firstFilter) {
        filteredSet.clear();
        currentFilteredSet.forEach(function (value) {
          filteredSet.add(value);
        });
      } else {
        var finalFilteredSet = new Set();
        filteredSet.forEach(function (value) {
          if (currentFilteredSet.has(value)) {
            finalFilteredSet.add(value);
          }
        });
        filteredSet.clear();
        finalFilteredSet.forEach(function (value) {
          filteredSet.add(value);
        });
      }

    }

    // Function that allows you to filter thorugh the current lsit that is dispalyed
    $scope.filterData = function () {
      var originalList = Array.from($scope.usersList);
      var filteredSet = new Set();

      if ($scope.searchValue == null || $scope.searchValue === '') {
        $scope.filteredUsersList = originalList;
      } else {
        for (var i = 0; i < originalList.length; i++) {
          if (originalList[i].firstName !== null || originalList[i].lastName !== null) {
            var firstName = (originalList[i].firstName !== null) ? originalList[i].firstName : '';
            var lastName = (originalList[i].lastName !== null) ? originalList[i].lastName : '';
            var userName = firstName + ' ' + lastName;
            if (userName.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].major !== null && originalList[i].major !== undefined) {
            var major = originalList[i].major;
            if (major.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].availabilityStatus !== null && originalList[i].availabilityStatus !== undefined) {
            var availabilityStatus = originalList[i].availabilityStatus;
            if (availabilityStatus.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].teamName !== null && originalList[i].teamName !== undefined) {
            var teamName = originalList[i].teamName;
            if (teamName.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].type !== null && originalList[i].type !== undefined) {
            var userType = originalList[i].type;
            if (userType.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }

        }

        $scope.filteredUsersList = Array.from(filteredSet);
      }
    };
    function updateSponsorCart() {
      var user = new UsersService(vm.authentication.user);
      user.$update(function (response) {

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Cart save successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Cart save failed!' });
      });
    }
    $scope.isInCart = function (B) {
      if (vm.authentication.user.cartData !== undefined) {
        if (vm.authentication.user.cartData.indexOf(B) === -1) {
          return false;
        } else {
          return true;
        }
      }
    };
    $scope.toggleCartTable = function () {
      if (vm.authentication.user.cartData === undefined || vm.authentication.user.cartData === null) {
        vm.authentication.user.cartData = [];
      }
      updateSponsorCart();
      $timeout(function () {
        var originalList = Array.from($scope.usersList);
        var filteredSet = new Set();
        for (var i = 0; i < originalList.length; i++) {
          if (originalList[i].username !== null && originalList[i].username !== undefined) {
            var username = originalList[i].username;
            if ($scope.isInCart(username)) {
              filteredSet.add(originalList[i]);
            }
          }
        }
        $scope.filteredUsersList = Array.from(filteredSet);
      });
    };
    $scope.addToCart = function () {
      if (vm.authentication.user.cartData === undefined || vm.authentication.user.cartData === null) {
        vm.authentication.user.cartData = [];
      }
      if ($scope.isInCart($scope.detailedInfo.username) === false) {
        vm.authentication.user.cartData.push($scope.detailedInfo.username);
      }
    };
    $scope.deleteFromCart = function () {
      var index = vm.authentication.user.cartData.indexOf($scope.detailedInfo.username);
      if (index !== -1) {
        vm.authentication.user.cartData.splice(index, 1);
      }
    };
  }
}());
