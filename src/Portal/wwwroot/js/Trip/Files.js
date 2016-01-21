var Trip;
(function (Trip) {
    var FilesConfig = (function () {
        function FilesConfig() {
        }
        return FilesConfig;
    })();
    Trip.FilesConfig = FilesConfig;
    var Files = (function () {
        function Files(config) {
            var _this = this;
            if (config.isMasterFile) {
                Files.masterFiles = this;
            }
            this.config = config;
            this.$container = $("#" + config.containerId);
            this.$noFiles = this.$container.find(".noFiles");
            if (config.addAdder) {
                this.$adderContainer = $("#" + config.adderContainer);
            }
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
            this.fileDaD = new Common.FileDaD(this.config.inputId);
            this.$adder = this.fileDaD.$instance;
            this.$adderContainer.html(this.$adder);
        };
        Files.prototype.setFiles = function (files, tripId, filesPublic) {
            this.filesPublic = filesPublic;
            this.files = files;
            this.tripId = tripId;
            this.onFilesSet();
        };
        Files.prototype.onFilesSet = function () {
            this.displayFiles();
        };
        Files.prototype.displayFiles = function () {
            var _this = this;
            this.generateFiles();
            if (this.config.editable) {
                $(".delete").click(function (evnt) {
                    Files.lastIdToDelete = $(evnt.target).data("id");
                });
                $(".filePublic").change(function (e) {
                    var $target = $(e.target);
                    var fileId = $target.data("id");
                    var state = $target.prop("checked");
                    var prms = { fileId: fileId, tripId: _this.tripId, state: state };
                    Views.ViewBase.currentView.apiPut("tripFilePublic", prms, function (res) {
                    });
                });
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
            this.$container.children().not(this.$adder).not(this.$noFiles).remove();
            if (this.files && this.files.length > 0) {
                this.$noFiles.hide();
                this.files.forEach(function (file) {
                    var filePublic = _.find(_this.filesPublic, function (f) {
                        return f.fileId === file.id;
                    });
                    var html = _this.generateFile(file);
                    var $html = $(html);
                    $html.find("#filePublic" + file.id).prop("checked", filePublic.isPublic);
                    _this.$container.prepend($html);
                });
            }
            else {
                this.$noFiles.show();
            }
        };
        //doc xml html pdf
        Files.prototype.generateFile = function (file) {
            var context = {
                fileName: this.getShortFileName(file.originalFileName),
                //fileId: file.savedFileName,
                id: file.id,
                fileType: this.getFileType(file.originalFileName),
                tripId: this.tripId,
                editable: this.config.editable
            };
            var html = this.template(context);
            return html;
        };
        Files.prototype.getFileType = function (fileName) {
            var prms = fileName.split(".");
            var fileType = prms[prms.length - 1];
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
            if (fileName.length <= 13) {
                return fileName;
            }
            var act = 0;
            var outName = "";
            fileName.split("").forEach(function (char) {
                if (outName.length > 30) {
                    return;
                }
                act++;
                outName += char;
                if (act === 10) {
                    outName += "-";
                    act = 0;
                }
            });
            return outName;
        };
        Files.prototype.registerFileUpload = function () {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = this.config.inputId;
            config.endpoint = "TripFile";
            this.fileUpload = new Common.FileUpload(config);
            this.fileDaD.onFiles = function (files) {
                _this.fileUpload.filesEvent(files);
            };
            this.fileUpload.onProgressChanged = function (percent) {
                $(".pb_all").show();
                $(".pb_percent").text(percent + "%");
                $(".pb_inner").css("width", percent + "%");
            };
            this.fileUpload.onUploadFinished = function (file, files) {
                $(".pb_all").hide();
                _this.filterFiles(files);
            };
        };
        return Files;
    })();
    Trip.Files = Files;
})(Trip || (Trip = {}));
//# sourceMappingURL=Files.js.map