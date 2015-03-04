require(['html5Upload'], function (html5Upload) {
    if (html5Upload.fileApiSupported()) {
        var exportsModel = {
            processing: ko.observable(false),
            exports: ko.observableArray([])
        };

        function addExport(exportedFile) {
            var viewModel = {
                exportUrl: ko.observable(exportedFile.export_url),
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
                console.log(file);
                exportsModel.processing(true);
                file.on({
                    onCompleted: function(res) {
                        exportsModel.processing(false);
                        res = JSON.parse(res);
                        console.log(res);
                        if(res.exports) {
                            res.exports.forEach(addExport);
                        }
                    }
                });
            }
        });

        ko.applyBindings(exportsModel);
    }
});
