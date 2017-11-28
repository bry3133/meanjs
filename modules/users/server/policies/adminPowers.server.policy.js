'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {};

/**
 * Check If Admin Powers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  // console.log(req.model);
  if (req.user !== null && req.user.type === 'admin') {
    // Access granted! Invoke next middleware
    return next();
  } else {
    return res.status(403).json({ message:
      'User is not authorized'
    });
  }
};
