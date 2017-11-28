'use strict';

var adminPowersPolicy = require('../policies/adminPowers.server.policy');

module.exports = function (app) {
  var adminPowers = require('../controllers/adminPowers.server.controller');

  app.route('/api/admin/updateUser/:userId').put(adminPowersPolicy.isAllowed, adminPowers.updateUser);
  app.route('/api/admin/deleteUser/:userId').delete(adminPowersPolicy.isAllowed, adminPowers.deleteUser);

  app.param('userId', adminPowers.participantByID);
};
