'use strict';
var astah = require('./astah');
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

module.exports = function(app, projectDir, exportDir) {
    app.post('/projects', function(req, res) {
        console.log(req.files);
        var projectFile = req.files.project;
        hashFile(projectFile.path, function(hash) {
            var projectPath = path.join(projectDir,
                                        hash + '.' + projectFile.extension);
            fs.renameSync(projectFile.path, projectPath);
            astah.exportImage(projectPath, exportDir, 'png').then(function() {
                res.status(201);
                res.location('/projects/' + hash);
                res.send({
                    url: '/projects/' + hash,
                    exports: fs.readdirSync(path.join(exportDir, hash)).map(function(filename) {
                        return {
                            url: '/projects/' + hash + '?file=' + filename,
                            filename: filename
                        };
                    })
                });
            });
        });
    });

    app.get('/projects/:sha', function(req, res) {
        return res.sendFile(path.join(exportDir, req.params.sha, req.query.file));
    });
};
