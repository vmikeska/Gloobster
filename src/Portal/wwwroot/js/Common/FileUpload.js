var Common;
(function (Common) {
    var FileUploadConfig = (function () {
        function FileUploadConfig() {
            this.bytesPerRequest = 102400;
            this.customInputRegistration = false;
        }
        return FileUploadConfig;
    })();
    Common.FileUploadConfig = FileUploadConfig;
    (function (TripEntityType) {
        TripEntityType[TripEntityType["Place"] = 0] = "Place";
        TripEntityType[TripEntityType["Travel"] = 1] = "Travel";
    })(Common.TripEntityType || (Common.TripEntityType = {}));
    var TripEntityType = Common.TripEntityType;
    var TripFileCustom = (function () {
        function TripFileCustom() {
        }
        return TripFileCustom;
    })();
    Common.TripFileCustom = TripFileCustom;
    var FileUpload = (function () {
        function FileUpload(config, customConfig) {
            if (customConfig === void 0) { customConfig = null; }
            this.lastEnd = 0;
            this.currentStart = 0;
            this.currentEnd = 0;
            this.reachedEnd = false;
            this.firstSent = false;
            this.customConfig = {};
            if (customConfig) {
                this.customConfig = customConfig;
            }
            if (!config.customInputRegistration) {
                this.registerFileInput(config.inputId);
            }
            this.config = config;
        }
        FileUpload.prototype.registerFileInput = function (inputId) {
            var _this = this;
            this.$filesInput = $("#" + inputId);
            this.$filesInput.change(function (e) {
                _this.filesEvent(e.target.files);
            });
        };
        FileUpload.prototype.filesEvent = function (files) {
            this.files = files;
            this.currentFile = this.files[0];
            this.sendBlobToServer(true);
        };
        FileUpload.prototype.resetValues = function () {
            this.lastEnd = 0;
            this.currentStart = 0;
            this.currentEnd = 0;
            this.reachedEnd = false;
            this.firstSent = false;
            //this.getInput().val("");
        };
        FileUpload.prototype.sendBlobToServer = function (isInitialCall) {
            if (this.reachedEnd) {
                console.log("transfere complete");
                console.log("file length: " + this.currentFile.size);
                if (this.onUploadFinished) {
                    this.onUploadFinished(this.currentFile, this.finalResponse);
                }
                this.resetValues();
                return;
            }
            if (!isInitialCall) {
                this.currentStart = this.lastEnd;
                this.currentEnd = this.currentStart + this.config.bytesPerRequest;
            }
            else {
                this.currentEnd = this.config.bytesPerRequest;
            }
            //todo: secure currentStart
            if (this.currentEnd >= this.currentFile.size) {
                this.currentEnd = this.currentFile.size;
                this.reachedEnd = true;
            }
            var reader = this.createReader();
            console.log("reading: " + this.currentStart + ".." + this.currentEnd);
            var blob = this.currentFile.slice(this.currentStart, this.currentEnd);
            reader.readAsDataURL(blob);
            this.lastEnd = this.currentEnd;
        };
        FileUpload.prototype.createReader = function () {
            var _this = this;
            var reader = new FileReader();
            reader.onloadend = function (evnt) {
                _this.onBlobLoad(evnt);
            };
            return reader;
        };
        FileUpload.prototype.recalculateUpdateProgress = function () {
            var percents = (this.currentEnd / this.currentFile.size) * 100;
            var percentsRounded = Math.round(percents);
            if (this.onProgressChanged && !(percentsRounded === 0)) {
                this.onProgressChanged(percentsRounded);
            }
        };
        FileUpload.prototype.onSuccessBlobUpload = function () {
            this.firstSent = true;
            this.sendBlobToServer(false);
            this.recalculateUpdateProgress();
        };
        FileUpload.prototype.getFilePartType = function () {
            if (this.reachedEnd) {
                return "Last";
            }
            else if (!this.firstSent) {
                return "First";
            }
            else if (this.firstSent) {
                return "Middle";
            }
        };
        FileUpload.prototype.onBlobLoad = function (evnt) {
            var _this = this;
            var dataBlob = evnt.target.result;
            var dataToSend = $.extend(this.customConfig, {
                data: dataBlob,
                filePartType: this.getFilePartType(),
                fileName: this.currentFile.name,
                customId: this.customId,
                type: this.currentFile.type
            });
            Views.ViewBase.currentView.apiPost(this.config.endpoint, dataToSend, function (finalResponse) {
                _this.finalResponse = finalResponse;
                _this.onSuccessBlobUpload();
            });
        };
        return FileUpload;
    })();
    Common.FileUpload = FileUpload;
})(Common || (Common = {}));
//# sourceMappingURL=FileUpload.js.map