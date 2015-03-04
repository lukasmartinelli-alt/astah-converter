/*eslint new-cap:0 */
'use strict';
var path = require('path');
var express = require('express');
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);

var options = {
    port: process.env.VCAP_APP_PORT || 3000,
    uploadDir: process.env.UPLOAD_DIR || path.resolve('./uploads/'),
    projectDir: process.env.PROJECT_DIR || path.resolve('./projects/'),
    exportDir: process.env.EXPORT_DIR || path.resolve('./exports/'),
    astahDir: process.env.ASTAH_DIR || 'opt/astah_professional'
};

app.use(bodyParser.json());
app.use(multer({ dest: options.uploadDir }));

var astah = require('./astah')(options.astahDir);
require('./api')(app, astah, options.projectDir, options.exportDir);
app.use(express.static(path.join(__dirname, '/public')));

http.listen(options.port);
