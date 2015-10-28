var FileUpload = (function () {
    function FileUpload(inputId, owner) {
        var _this = this;
        this.bytesPerRequest = 102400;
        this.lastEnd = 0;
        this.currentStart = 0;
        this.currentEnd = 0;
        this.reachedEnd = false;
        this.firstSent = false;
        this.endpoint = "UploadAvatar";
        this.owner = owner;
        this.currentEnd = this.bytesPerRequest;
        $("#" + inputId).change(function (e) {
            _this.files = e.target.files;
            _this.currentFile = _this.files[0];
            _this.sendBlobToServer(true);
        });
    }
    FileUpload.prototype.sendBlobToServer = function (isInitialCall) {
        if (this.reachedEnd) {
            console.log("transfere complete");
            console.log("file length: " + this.currentFile.size);
            return;
        }
        if (!isInitialCall) {
            this.currentStart = this.lastEnd;
            this.currentEnd = this.currentStart + this.bytesPerRequest;
        }
        //todo: secure currentStart
        if (this.currentEnd > this.currentFile.size) {
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
        if (!this.firstSent) {
            return "First";
        }
        else if (this.firstSent && !this.reachedEnd) {
            return "Middle";
        }
        else if (this.reachedEnd) {
            return "Last";
        }
    };
    FileUpload.prototype.onBlobLoad = function (evnt) {
        var _this = this;
        var dataBlob = evnt.target.result;
        var dataToSend = { data: dataBlob, filePartType: this.getFilePartType(), fileName: this.currentFile.name };
        this.owner.apiPost(this.endpoint, dataToSend, function () {
            _this.onSuccessBlobUpload();
        });
        //dunno meaning of this. If it's actually not in the state, all transaction is corrupted anyway
        //if (evnt.target.readyState === FileReader.prototype.DONE) {
        //	var dataToSend = dataBlob;
        //	var callObj = {
        //		type: "POST",
        //		url: "ReceiveFileBlob",
        //		data: dataToSend,
        //		success(response) {
        //			self.onSuccessBlobUpload();
        //		},
        //		error(response) {
        //			//todo: add error handler
        //			alert("error");
        //		},
        //		dataType: "text",
        //		contentType: false
        //	}
        //	$.ajax(callObj);
        //}
    };
    return FileUpload;
})();
//# sourceMappingURL=FileUpload.js.map