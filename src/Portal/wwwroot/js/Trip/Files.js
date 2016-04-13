var Trip;
(function (Trip) {
    var FilesConfig = (function () {
        function FilesConfig() {
        }
        return FilesConfig;
    })();
    Trip.FilesConfig = FilesConfig;
    var TripFiles = (function () {
        function TripFiles(config, customConfig) {
            var _this = this;
            if (customConfig === void 0) { customConfig = null; }
            if (config.adderTemplate) {
                this.fileInputTemplate = Views.ViewBase.currentView.registerTemplate(config.adderTemplate);
            }
            this.fileDocumentTemplate = Views.ViewBase.currentView.registerTemplate(config.templateId);
            if (config.isMasterFile) {
                TripFiles.masterFiles = this;
            }
            this.config = config;
            this.$mainContainer = $("#" + config.mainContainerId);
            this.$container = $("#" + config.containerId);
            var $deleteConfirm = $("#deleteFileConfirm");
            $deleteConfirm.unbind();
            $deleteConfirm.click(function () {
                _this.callDelete(TripFiles.lastIdToDelete);
                $("#popup-delete").hide();
            });
            if (this.config.editable) {
                this.registerFileUpload(customConfig);
            }
        }
        TripFiles.prototype.registerFileUpload = function (customConfig) {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = this.config.inputId;
            config.endpoint = "TripFile";
            config.customInputRegistration = true;
            this.fileUpload = new Common.FileUpload(config, customConfig);
            this.fileUpload.onProgressChanged = function (percent) {
                _this.$mainContainer.find(".upload-droparea").show();
                _this.$mainContainer.find(".upload-progressbar").show();
                var $progressBarCont = _this.$mainContainer.find(".upload-progressbar");
                $progressBarCont.show();
                _this.setUploadProgress(percent);
            };
            this.fileUpload.onUploadFinished = function (file, res) {
                _this.$mainContainer.find(".upload-droparea").hide();
                _this.$mainContainer.find(".upload-progressbar").hide();
                _this.setUploadProgress(0);
                if (res) {
                    _this.filterFiles(res.files, res.filesPublic);
                }
            };
        };
        TripFiles.prototype.addAdder = function () {
            var _this = this;
            this.$adder = $(this.fileInputTemplate({ id: this.config.inputId }));
            this.fileDaD = new Common.FileDaD();
            this.$container.append(this.$adder);
            //now when file input exists, we can register events
            this.fileUpload.$filesInput = this.$adder.find("#" + this.config.inputId);
            this.fileDaD.onFiles = function (files) {
                _this.fileUpload.filesEvent(files);
            };
            this.fileDaD.registerComponent(this.config.mainContainerId);
        };
        TripFiles.prototype.setFiles = function (files, tripId, filesPublic) {
            this.filesPublic = filesPublic;
            this.files = files;
            this.tripId = tripId;
            this.onFilesSet();
        };
        TripFiles.prototype.onFilesSet = function () {
            this.generateFiles();
        };
        TripFiles.prototype.callDelete = function (fileId) {
            var _this = this;
            var prms = [["fileId", fileId], ["tripId", this.tripId]];
            Views.ViewBase.currentView.apiDelete("tripFile", prms, function (res) {
                _this.filterFiles(res.files, res.filesPublic);
            });
        };
        TripFiles.prototype.filterFiles = function (files, filesPublic) {
            var _this = this;
            if (!files) {
                return;
            }
            this.filesPublic = filesPublic;
            if (this.config.entityId) {
                var entityFiles = _.filter(files, function (file) { return file.entityId === _this.config.entityId; });
                this.files = entityFiles;
                this.generateFiles();
            }
            else {
                this.files = files;
                this.generateFiles();
            }
            if (TripFiles.masterFiles && (!this.config.isMasterFile)) {
                TripFiles.masterFiles.files = files;
                TripFiles.masterFiles.filesPublic = filesPublic;
                TripFiles.masterFiles.generateFiles();
            }
        };
        TripFiles.prototype.generateFiles = function () {
            var _this = this;
            this.$container.children().not(this.$adder).remove();
            if (this.files && this.files.length > 0) {
                $(".fileDocs").show();
                this.files.forEach(function (file) {
                    var isOwner = file.ownerId === Views.ViewBase.currentUserId;
                    var filePublic = _this.getFilePublic(file.id);
                    var displayFile = isOwner || filePublic.isPublic;
                    if (displayFile) {
                        var context = {
                            fileName: _this.getShortFileName(file.originalFileName),
                            id: file.id,
                            fileType: _this.getFileType(file.originalFileName),
                            tripId: _this.tripId,
                            editable: _this.config.editable,
                            isOwner: isOwner,
                            canManipulate: _this.config.editable && isOwner
                        };
                        var $html = _this.generateFile(context);
                        _this.$container.prepend($html);
                    }
                });
                this.$container.find(".delete").click(function (e) {
                    e.preventDefault();
                    var $target = $(e.target);
                    var id = $target.data("id");
                    var dialog = new Common.ConfirmDialog();
                    dialog.create("DelDialogTitle", "DelDialogBody", "Cancel", "Ok", function () {
                        _this.callDelete(id);
                    });
                });
            }
            if (this.config.editable && this.config.addAdder && !this.$adder) {
                this.addAdder();
            }
        };
        TripFiles.prototype.generateFile = function (context) {
            var _this = this;
            var filePublic = this.getFilePublic(context.id);
            var html = this.fileDocumentTemplate(context);
            var $html = $(html);
            var $filePublic = $html.find(".filePublic");
            $filePublic.prop("checked", filePublic.isPublic);
            if (this.config.editable) {
                $filePublic.change(function (e) {
                    var $target = $(e.target);
                    var fileId = $target.data("id");
                    var state = $target.prop("checked");
                    var prms = { fileId: fileId, tripId: _this.tripId, state: state };
                    Views.ViewBase.currentView.apiPut("tripFilePublic", prms, function (res) {
                        var $sisterChecks = $(".filePublic" + fileId);
                        $sisterChecks.prop("checked", state);
                    });
                });
            }
            return $html;
        };
        TripFiles.prototype.getFilePublic = function (fileId) {
            var filePublic = _.find(this.filesPublic, function (f) {
                return f.fileId === fileId;
            });
            return filePublic;
        };
        TripFiles.prototype.getFileType = function (fileName) {
            var prms = fileName.split(".");
            var fileType = prms[prms.length - 1];
            if (_.contains(["jpg", "jpeg", "bmp", "png", "gif"], fileType)) {
                return "img";
            }
            if (_.contains(["docx", "doc"], fileType)) {
                return "doc";
            }
            var recognizedTypes = ["doc", "docx", "xml", "html", "pdf", "txt", "jpg", "jpeg", "bmp", "png", "gif"];
            var isRecognized = _.contains(recognizedTypes, fileType);
            if (isRecognized) {
                return fileType;
            }
            return "txt";
        };
        TripFiles.prototype.getShortFileName = function (fileName) {
            if (fileName.length <= 13) {
                return fileName;
            }
            var act = 0;
            var outName = "";
            fileName.split("").forEach(function (char) {
                if (outName.length > 24) {
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
        TripFiles.prototype.setUploadProgress = function (percent) {
            var $progressBarCont = this.$mainContainer.find(".upload-progressbar");
            $progressBarCont.find(".progress").css("width", percent + "%");
            $progressBarCont.find("span").text(percent + "%");
        };
        return TripFiles;
    })();
    Trip.TripFiles = TripFiles;
})(Trip || (Trip = {}));
//# sourceMappingURL=Files.js.map