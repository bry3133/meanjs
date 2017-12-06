var google = require('googleapis');
var drive = google.drive('v3');
var fs = require('fs');
// Key JSON is in the node_modules
var key = require('key.json');
var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ['https://www.googleapis.com/auth/drive'], // an array of auth scopes
  null
);
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

const os = require('os');

exports.listDocs = function (req, res) {

  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {

      drive.files.list({
        auth: jwtClient
      }, function (err, resp) {
        // handle err and response
        if (err) {
          res.send(err);
          return;
        } else {
          res.jsonp(resp.files);
        }
      });

    }
  });

};

exports.getDoc = function (req, res) {

  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {
      var fileName = req.params.docId;
      var fileId = fileName.substr(0, fileName.indexOf('.'));
      var home = os.homedir();
      var dest = fs.createWriteStream(home + '/Downloads/' + fileName);

      drive.files.get({
        auth: jwtClient,
        fileId: fileId,
        alt: 'media'
      })
        .on('end', function (resp) {
          console.log('Done');
          console.log(resp);
          res.jsonp(resp);
        })
        .on('error', function (err) {
          res.send(err);
        })
        .pipe(dest);

    }

  });

};

exports.createDocs = function (req, res) {

  console.log(req.body);
  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {

      drive.files.create({
        auth: jwtClient,
        resource: {
          name: req.body.name
        },
        media: {
          body: req.body.content // 'This, is, the, test, document!'
        }
      }, function (err, resp) {
        if (err) {
          res.send(err);
        } else {

          res.send(resp);
          console.log('Success upload document');
        }

      });

    }

  });
};

exports.deleteDocs = function (req, res) {

  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {

      drive.files.delete({
        auth: jwtClient,
        fileId: req.params.docId
      }, function (err, resp) {
        if (err) {
          //  console.log(err);
          res.send(err);
        } else {
          console.log('Success deleted document');
        }
      });

    }

  });
};

exports.updateDocs = function (req, res) {

  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {

      drive.files.update({
        auth: jwtClient,
        fileId: req.params.docId,
        resource: {
          name: req.body.name
        },
        media: {
          body: req.body.content // 'This, is, the, test, document!'
        }
      }, function (err, resp) {
        if (err) {
          res.send(err);
        } else {
          res.send(resp);
        }
      });

    }

  });
};

exports.updateByUpload = function (req, res) {

  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {

      drive.files.update({
        auth: jwtClient,
        fileId: req.params.docId,
        resource: {
          name: req.body.fileName
        },
        media: {
          body: fs.createReadStream(os.homedir() + '/Downloads/' + req.body.fileName) // 'This, is, the, test, document! '
        }
      }, function (err, resp) {
        if (err) {
          res.send(err);
        } else {
          res.send(resp);
        }
      });

    }

  });
};


exports.uploadDocs = function (req, res) {
  // var user = req.model;

  jwtClient.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {

      var fileMetadata = {
        name: req.body.fileName
      };

      var media = {
        body: fs.createReadStream(os.homedir() + '/Downloads/' + req.body.fileName)
      };

      drive.files.create({
        auth: jwtClient,
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          res.send(err);
          console.error(err);
        } else {
          res.jsonp(file);
      //    user.resumeID = file.id;
          console.log('File Id:', file.id);
        }
      });


    }

  });


};
