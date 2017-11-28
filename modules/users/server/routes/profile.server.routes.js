'use strict';

var adminAndSponsorsPolicy = require('../policies/adminAndSponsor.server.policy');

module.exports = function (app) {
  // Profile Routes
  var profile = require('../controllers/profile.server.controller');

  // Single profile routes
  app.route('/api/profile/:username').get(adminAndSponsorsPolicy.isAllowed, profile.read);

  // Finish by binding the user middleware
  app.param('username', profile.userByUsername);
};
