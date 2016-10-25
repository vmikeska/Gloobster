var ImageDb;
(function (ImageDb) {
    var ImageSender = (function () {
        function ImageSender(v, endpoint, $cropper, finalDataCallback, finishedCallback) {
            this.bytesPerRequest = 204800;
            this.canContinue = true;
            this.filePart = 0;
            this.masterBlob = null;
            this.v = v;
            this.endpoint = endpoint;
            this.$cropper = $cropper;
            this.finalDataCallback = finalDataCallback;
            this.finishedCallback = finishedCallback;
        }
        ImageSender.prototype.send = function () {
            var _this = this;
            this.getImgData(this.$cropper, function (masterBlob) {
                _this.masterBlob = masterBlob;
                _this.currentEnd = 0;
                _this.totalLength = _this.masterBlob.size;
                _this.filePart = 0;
                _this.sendOnePart();
            });
        };
        ImageSender.prototype.getImgData = function ($cropper, callback) {
            var canvas = $cropper.cropper("getCroppedCanvas");
            canvas.toBlob(function (blob) {
                callback(blob);
            });
        };
        ImageSender.prototype.sendOnePart = function () {
            var _this = this;
            var newEnd = this.currentEnd + this.bytesPerRequest;
            if (newEnd > this.totalLength) {
                newEnd = this.totalLength;
                this.filePart = 2;
            }
            var partBob = this.masterBlob.slice(this.currentEnd, newEnd);
            var reader = new FileReader();
            reader.onloadend = function (e) {
                _this.onReadAsDataUrl(e);
            };
            reader.readAsDataURL(partBob);
            this.currentEnd = newEnd;
        };
        ImageSender.prototype.onReadAsDataUrl = function (e) {
            var _this = this;
            var data = {
                data: e.target["result"],
                filePartType: this.filePart
            };
            var isLast = (this.filePart === 2);
            if (isLast) {
                var extData = this.finalDataCallback();
                data = $.extend(data, extData);
            }
            this.v.apiPost(this.endpoint, data, function (finished) {
                var s = Math.round((_this.currentEnd / _this.totalLength) * 100);
                $("#percentsUploaded").html(s);
                if (_this.filePart === 0) {
                    _this.filePart = 1;
                }
                if (!isLast) {
                    _this.sendOnePart();
                }
                if (finished) {
                    _this.finishedCallback();
                }
            });
        };
        return ImageSender;
    }());
    ImageDb.ImageSender = ImageSender;
})(ImageDb || (ImageDb = {}));
//# sourceMappingURL=ImageDB.js.map