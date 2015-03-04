require(['html5Upload'], function (html5Upload) {
    if (html5Upload.fileApiSupported()) {
        var context = document.getElementById('exports');
        var exportsModel = { exports: ko.observableArray([]) };

        function addExport(exportedFile) {
            var viewModel = {
                url: ko.observable(exportedFile.url),
                filename: ko.observable(exportedFile.filename)
            };
            exportsModel.exports.push(viewModel);
        }

        html5Upload.initialize({
            uploadUrl: '/projects',
            dropContainer: document.getElementById('dragndropimage'),
            inputField: document.getElementById('upload-input'),
            key: 'project',
            onFileAdded: function(file) {
                file.on({
                    onCompleted: function(res) {
                        res = JSON.parse(res);
                        console.log(res);
                        if(res.exports) {
                            res.exports.forEach(addExport);
                        }
                    }
                });
            }
        });

        ko.applyBindings(exportsModel, context);
    }
});
