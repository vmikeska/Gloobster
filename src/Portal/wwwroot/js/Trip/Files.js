var Files = (function () {
    function Files(owner, editable) {
        var _this = this;
        this.owner = owner;
        this.editable = editable;
        var source = $("#file-template").html();
        this.template = Handlebars.compile(source);
        if (this.editable) {
            var sourceCrt = $("#fileCreate-template").html();
            this.createTemplate = Handlebars.compile(sourceCrt);
        }
        $("#deleteFileConfirm").click(function () {
            _this.callDelete(_this.lastIdToDelete);
            $("#popup-delete").hide();
        });
    }
    Files.prototype.setTrip = function (trip) {
        this.trip = trip;
        this.files = trip.files;
        this.onTripSet();
    };
    Files.prototype.onTripSet = function () {
        this.displayFiles();
    };
    Files.prototype.displayFiles = function () {
        var _this = this;
        var filesHtml = this.generateFiles();
        if (this.editable) {
            var createFileHtml = this.createTemplate();
            filesHtml += createFileHtml;
        }
        $("#filesContainer").html(filesHtml);
        if (this.editable) {
            $(".delete").click(function (evnt) {
                _this.lastIdToDelete = $(evnt.target).data("id");
            });
            this.registerFileUpload();
        }
        else {
            $(".delete").hide();
        }
    };
    Files.prototype.callDelete = function (fileId) {
        var _this = this;
        var prms = [["fileId", fileId], ["tripId", this.trip.tripId]];
        this.owner.apiDelete("tripFile", prms, function (files) {
            if (files != null) {
                _this.files = files;
                _this.displayFiles();
            }
        });
    };
    Files.prototype.generateFiles = function () {
        var _this = this;
        var html = "";
        if (this.files) {
            this.files.forEach(function (file) {
                html += _this.generateFile(file);
            });
        }
        return html;
    };
    //doc xml html pdf
    Files.prototype.generateFile = function (file) {
        var context = {
            fileName: this.getShortFileName(file.originalFileName),
            fileId: file.savedFileName,
            fileType: this.getFileType(file.originalFileName),
            tripId: this.trip.tripId
        };
        var html = this.template(context);
        return html;
    };
    Files.prototype.getFileType = function (fileName) {
        var prms = fileName.split(".");
        var fileType = prms[1];
        var recognizedTypes = ["doc", "docx", "xml", "html", "pdf"];
        var isRecognized = _.contains(recognizedTypes, fileType);
        if (isRecognized) {
            if (fileType === "docx") {
                return "doc";
            }
            return fileType;
        }
        return "xml";
    };
    Files.prototype.getShortFileName = function (fileName) {
        if (fileName.length <= 24) {
            return fileName;
        }
        var prms = fileName.split(".");
        return prms[0].substring(0, 20) + "... ." + prms[1];
    };
    Files.prototype.registerFileUpload = function () {
        var _this = this;
        var config = new FileUploadConfig();
        config.inputId = "fileInput";
        config.owner = this.owner;
        config.endpoint = "TripFile";
        this.fileUpload = new FileUpload(config);
        this.fileUpload.customId = this.trip.tripId;
        this.fileUpload.onProgressChanged = function (percent) {
            $("#progressBar").text(percent);
        };
        this.fileUpload.onUploadFinished = function (file, files) {
            _this.files = files;
            _this.displayFiles();
        };
    };
    return Files;
})();
//# sourceMappingURL=Files.js.map