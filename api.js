'use strict';
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

function hashFile(filePath, cb) {
    var fd = fs.createReadStream(filePath);
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    fd.on('end', function() {
        hash.end();
        cb(hash.read());
    });
    fd.pipe(hash);
};

module.exports = function(app, astah, s3, projectDir, exportDir) {
    function findFiles(hash, absUrl) {
        return fs.readdirSync(path.join(exportDir, hash))
            .filter(function(filename) {
                return path.extname(filename) !== '.bak';
            })
            .map(function(filename) {
                return {
                    export_url: absUrl('/projects/' + hash + '?file=' + filename),
                    filename: filename
                };
        });
    }

    function makeAbsoluteUrl(req) {
        return function(relativePath) {
            return req.protocol + '://' + req.get('host') + relativePath;
        };
    }

    function tryUploadS3(objName, filePath) {
        if(s3) {
            s3.putFile(filePath, objName, function(err, res) {
                if(err) {
                    console.error(err);
                } else {
                    res.resume();
                }
            });
        }
    }

    app.post('/projects', function(req, res) {
        var absUrl = makeAbsoluteUrl(req);
        var projectFile = req.files.project;

        hashFile(projectFile.path, function(hash) {
            var projectUrl = absUrl('/projects/' + hash);
            var projectPath = path.join(projectDir,
                                        hash + '.' + projectFile.extension);

            fs.renameSync(projectFile.path, projectPath);
            var projName = '/projects/' + hash + '.' + projectFile.extension;
            tryUploadS3(projName, projectPath);

            astah.exportImage(projectPath, exportDir, 'png').then(function() {
                var exports = findFiles(hash, absUrl);

                exports.forEach(function(exportedFile) {
                    var exportName = '/exports/' + hash +
                                     '/' + exportedFile.filename;
                    var exportPath = path.join(exportDir, hash, exportedFile.filename);
                    tryUploadS3(exportName, exportPath);
                });

                res.status(201);
                res.location(projectUrl);

                return res.format({
                    text: function() {
                        res.send(exports.map(function(exportedFile) {
                            return exportedFile.export_url;
                        }).join("\n"));
                    },
                    json: function() {
                        res.json({
                            project_url: projectUrl,
                            exports: exports
                        });
                    }
                });
            }, function(err) {
                res.status(500);
                res.send(err);
            });
        });
    });

    app.get('/projects/:sha', function(req, res) {
        var absUrl = makeAbsoluteUrl(req);

        if(req.query.file) {
            var exportPath = path.join(exportDir, req.params.sha, req.query.file);
            if(fs.existsSync(exportPath)) {
                return res.sendFile(exportPath);
            } else {
                res.status(404),
                res.send('Could not find file ' + req.query.file);
            }
        } else {
            var projectUrl = absUrl('/projects/' + req.params.sha);
            var exports = findFiles(req.params.sha, absUrl);

            res.status(200);
            return res.format({
                text: function() {
                    res.send(exports.join("\n"));
                },
                json: function() {
                    res.json({
                        project_url: projectUrl,
                        exports: exports
                    });
                }
            });
        }
    });
};
