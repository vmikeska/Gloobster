var FilesConfig = (function () {
    function FilesConfig() {
    }
    return FilesConfig;
})();
var Files = (function () {
    function Files(config) {
        var _this = this;
        if (config.isMasterFile) {
            Files.masterFiles = this;
        }
        this.config = config;
        this.$container = $("#" + config.containerId);
        var source = $("#" + config.templateId).html();
        this.template = Handlebars.compile(source);
        if (config.addAdder) {
            if (config.editable) {
                this.addAdder();
            }
        }
        if (this.config.editable) {
            this.registerFileUpload();
        }
        var $deleteConfirm = $("#deleteFileConfirm");
        $deleteConfirm.unbind();
        $deleteConfirm.click(function () {
            _this.callDelete(Files.lastIdToDelete);
            $("#popup-delete").hide();
        });
    }
    Files.prototype.addAdder = function () {
        // var sourceCrt = $("#fileCreate-template").html();
        //this.createTemplate = Handlebars.compile(sourceCrt);
        //var adderHtml = this.createTemplate();
        var adderHtml = "<input id=\"" + this.config.inputId + "\" type=\"file\" />";
        this.$adder = $(adderHtml);
        this.$container.html(this.$adder);
    };
    Files.prototype.setFiles = function (files, tripId) {
        this.files = files;
        this.tripId = tripId;
        this.onFilesSet();
    };
    Files.prototype.onFilesSet = function () {
        this.displayFiles();
    };
    Files.prototype.displayFiles = function () {
        this.generateFiles();
        if (this.config.editable) {
            $(".delete").click(function (evnt) {
                Files.lastIdToDelete = $(evnt.target).data("id");
            });
        }
        else {
            $(".delete").hide();
        }
    };
    Files.prototype.callDelete = function (fileId) {
        var _this = this;
        var prms = [["fileId", fileId], ["tripId", this.tripId]];
        Views.ViewBase.currentView.apiDelete("tripFile", prms, function (files) {
            _this.filterFiles(files);
        });
    };
    Files.prototype.filterFiles = function (files) {
        var _this = this;
        if (!files) {
            return;
        }
        if (this.config.entityId) {
            var entityFiles = _.filter(files, function (file) { return file.entityId === _this.config.entityId; });
            this.files = entityFiles;
            this.displayFiles();
        }
        else {
            this.files = files;
            this.displayFiles();
        }
        if (Files.masterFiles && (!this.config.isMasterFile)) {
            Files.masterFiles.files = files;
            Files.masterFiles.displayFiles();
        }
    };
    Files.prototype.generateFiles = function () {
        var _this = this;
        this.$container.children().not(this.$adder).remove();
        if (this.files) {
            this.files.forEach(function (file) {
                var html = _this.generateFile(file);
                _this.$container.prepend(html);
            });
        }
    };
    //doc xml html pdf
    Files.prototype.generateFile = function (file) {
        var context = {
            fileName: this.getShortFileName(file.originalFileName),
            fileId: file.savedFileName,
            fileType: this.getFileType(file.originalFileName),
            tripId: this.tripId
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
        config.inputId = this.config.inputId;
        config.endpoint = "TripFile";
        this.fileUpload = new FileUpload(config);
        this.fileUpload.onProgressChanged = function (percent) {
            $("#progressBar").text(percent);
        };
        this.fileUpload.onUploadFinished = function (file, files) {
            _this.filterFiles(files);
        };
    };
    return Files;
})();
//# sourceMappingURL=Files.js.map