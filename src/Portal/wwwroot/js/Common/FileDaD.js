//https://css-tricks.com/examples/DragAndDropFileUploading/
var Common;
(function (Common) {
    var FileDaD = (function () {
        function FileDaD() {
        }
        FileDaD.prototype.registerComponent = function (containerId) {
            var _this = this;
            this.$container = $("#" + containerId);
            this.$dadArea = this.$container.find(".upload-droparea");
            var $input = this.$container.find('input[type="file"]');
            $input.on("change", function (e) {
                var files = e.target.files;
                _this.filesChose(files);
            });
            //Firefox focus bugfix for file input
            //$input
            //	.on("focus", () => { $input.addClass("has-focus"); })
            //	.on("blur", () => { $input.removeClass("has-focus"); });
            // drag&drop files if the feature is available
            if (this.isAdvancedUpload()) {
                this.$container
                    .on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                })
                    .on("dragenter dragover", function (e) {
                    _this.destroyHideTimeout();
                    _this.$dadArea.show();
                })
                    .on("dragleave dragend drop", function (e) {
                    _this.createHideTimeout(_this.$dadArea);
                })
                    .on("drop", function (e) {
                    var files = e.originalEvent.dataTransfer.files;
                    _this.filesChose(files);
                });
            }
        };
        FileDaD.prototype.destroyHideTimeout = function () {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        };
        FileDaD.prototype.createHideTimeout = function ($element) {
            var _this = this;
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = null;
                $element.hide();
            }, 50);
        };
        FileDaD.prototype.filesChose = function (files) {
            if (this.onFiles) {
                this.onFiles(files);
            }
        };
        FileDaD.prototype.isAdvancedUpload = function () {
            var div = document.createElement("div");
            return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
        };
        return FileDaD;
    })();
    Common.FileDaD = FileDaD;
})(Common || (Common = {}));
//# sourceMappingURL=FileDaD.js.map