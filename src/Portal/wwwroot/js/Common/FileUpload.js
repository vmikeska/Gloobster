var FileUploadConfig = (function () {
    function FileUploadConfig() {
        this.bytesPerRequest = 102400;
        this.getAsBase64AfterUpload = false;
    }
    return FileUploadConfig;
})();
var FileUpload = (function () {
    function FileUpload(config) {
        var _this = this;
        this.lastEnd = 0;
        this.currentStart = 0;
        this.currentEnd = 0;
        this.reachedEnd = false;
        this.firstSent = false;
        this.config = config;
        this.owner = config.owner;
        this.$input = $("#" + this.config.inputId);
        this.$input.change(function (e) {
            _this.files = e.target.files;
            _this.currentFile = _this.files[0];
            _this.sendBlobToServer(true);
        });
    }
    FileUpload.prototype.resetValues = function () {
        this.lastEnd = 0;
        this.currentStart = 0;
        this.currentEnd = 0;
        this.reachedEnd = false;
        this.firstSent = false;
        this.$input.val("");
    };
    FileUpload.prototype.sendBlobToServer = function (isInitialCall) {
        if (this.reachedEnd) {
            console.log("transfere complete");
            console.log("file length: " + this.currentFile.size);
            if (this.onUploadFinished) {
                this.onUploadFinished(this.currentFile);
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
        if (this.onProgressChanged) {
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
        var dataToSend = { data: dataBlob, filePartType: this.getFilePartType(), fileName: this.currentFile.name };
        this.owner.apiPost(this.config.endpoint, dataToSend, function () {
            _this.onSuccessBlobUpload();
        });
    };
    return FileUpload;
})();
//# sourceMappingURL=FileUpload.js.map