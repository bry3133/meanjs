(function () {
  'use strict';

  angular
    .module('users')
    .factory('googleDriveService', googleDriveService);

  googleDriveService.$inject = ['$http'];

  function googleDriveService($http) {

    var methods = {
      listDocs: function () {

        return $http.get('/api/googleDrive/docs');
      },

      getDoc: function (fileId) {

        return $http.get('/api/googleDrive/' + fileId);
      },

      createDocs: function (fileContent) {

        return $http.post('/api/googleDrive/docs', fileContent);
      },

      deleteDocs: function (fileId) {

        return $http.delete('/api/googleDrive/' + fileId);
      },

      updateDocs: function (fileContent, fileId) {

        return $http.put('/api/googleDrive/' + fileId, fileContent);
      },

      uploadDocs: function (file) {
        return $http.post('/api/googleDrive/upload', file);
      },

      updateByUpload: function (file, fileId) {
        return $http.post('/api/googleDrive/' + fileId, file);
      }

    };

    return methods;
  }

}());
