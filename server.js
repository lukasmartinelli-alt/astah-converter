/*eslint new-cap:0 */
'use strict';
var path = require('path');
var express = require('express');
var multer = require('multer');
var knox = require('knox');
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

try {
    var s3 = knox.createClient({
        key: process.env.AWS_KEY,
        secret: process.env.AWS_SECRET,
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION || 'us-standard'
    });
} catch (err) {
    var s3 = false;
    console.error('S3 upload not configured: ' + err);
}

app.use(bodyParser.json());
app.use(multer({ dest: options.uploadDir }));

var astah = require('./astah')(options.astahDir);
require('./api')(app, astah, s3, options.projectDir, options.exportDir);
app.use(express.static(path.join(__dirname, '/public')));

http.listen(options.port);
