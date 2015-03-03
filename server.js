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
    uploadDir: path.resolve('./uploads/'),
    projectDir: path.resolve('./projects/'),
    exportDir: path.resolve('./exports/')
};

app.use(bodyParser.json());
app.use(multer({ dest: options.uploadDir }));

require('./api')(app, options.projectDir, options.exportDir);
app.use(express.static(path.join(__dirname, '/public')));

http.listen(options.port);
