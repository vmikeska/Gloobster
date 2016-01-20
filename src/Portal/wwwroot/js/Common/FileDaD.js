//https://css-tricks.com/examples/DragAndDropFileUploading/
var Common;
(function (Common) {
    var FileDaD = (function () {
        function FileDaD() {
        }
        FileDaD.prototype.isAdvancedUpload = function () {
            var div = document.createElement("div");
            return (("draggable" in div) || ("ondragstart" in div && "ondrop" in div)) && "FormData" in window && "FileReader" in window;
        };
        FileDaD.prototype.init = function () {
            var _this = this;
            $(".box").each(function (i, ele) {
                _this.registerComponent(ele);
            });
        };
        FileDaD.prototype.filesChose = function (files) {
            var file = files[0];
            this.showImage(file);
        };
        FileDaD.prototype.showImage = function (file) {
            var reader = new FileReader();
            reader.onloadend = function (evnt) {
                var img = document.getElementById("myImg");
                img["src"] = evnt.target["result"];
            };
            var blob = file.slice(0, file.size);
            reader.readAsDataURL(blob);
        };
        FileDaD.prototype.registerComponent = function (rootElement) {
            var _this = this;
            var $rootElement = $(rootElement);
            var $input = $rootElement.find('input[type="file"]');
            var $restart = $rootElement.find(".box__restart");
            $input.on("change", function (e) {
                var files = e.target.files;
                _this.filesChose(files);
            });
            // drag&drop files if the feature is available
            if (this.isAdvancedUpload()) {
                $rootElement
                    .on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                })
                    .on("dragover dragenter", function () {
                    $rootElement.addClass("is-dragover");
                })
                    .on("dragleave dragend drop", function () {
                    $rootElement.removeClass("is-dragover");
                })
                    .on("drop", function (e) {
                    var files = e.originalEvent.dataTransfer.files;
                    var file = files[0];
                    _this.showImage(file);
                });
            }
            //restart the form if has a state of error/success
            $restart.on("click", function (e) {
                e.preventDefault();
                $rootElement.removeClass("is-error is-success");
                $input.trigger("click");
            });
            //Firefox focus bugfix for file input
            $input
                .on("focus", function () { $input.addClass("has-focus"); })
                .on('blur', function () { $input.removeClass("has-focus"); });
        };
        return FileDaD;
    })();
    Common.FileDaD = FileDaD;
})(Common || (Common = {}));
//# sourceMappingURL=FileDaD.js.map