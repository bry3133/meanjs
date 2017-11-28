'use strict';

var adminAndSponsorsPolicy = require('../policies/adminAndSponsor.server.policy');

module.exports = function (app) {
  var users = require('../controllers/catalog.server.controller');

  app.route('/api/catalog/sponsors').get(adminAndSponsorsPolicy.isAllowed, users.sponsors);
  app.route('/api/catalog/students').get(adminAndSponsorsPolicy.isAllowed, users.students);

  app.param('studentId', users.studentByID);
};
