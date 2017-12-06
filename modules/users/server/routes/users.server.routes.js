'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var googleDrive = require('../controllers/googleDrive.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Google drive service section
  app.route('/api/googleDrive/docs').get(googleDrive.listDocs)
   .post(googleDrive.createDocs);

  app.route('/api/googleDrive/:docId').get(googleDrive.getDoc)
   .delete(googleDrive.deleteDocs)
   .put(googleDrive.updateDocs)
   .post(googleDrive.updateByUpload);

  app.route('/api/googleDrive/upload').post(googleDrive.uploadDocs);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
