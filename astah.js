'use strict';
var path = require('path');
var Q = require('q');
var exec = Q.denodeify(require('child_process').exec);

module.exports = function(astahDir) {
    return {
        exportImage: function(projectPath, outputPath, imageType) {
            return exec(
                './astah-command.sh -image all -f ' + projectPath +
                ' -t ' + imageType +' -o ' + outputPath,
                { cwd: astahDir }
            );
        }
    };
};
