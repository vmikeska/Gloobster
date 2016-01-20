//https://css-tricks.com/examples/DragAndDropFileUploading/
var Common;
(function (Common) {
    var FileDaD = (function () {
        function FileDaD(id) {
            this.template = Views.ViewBase.currentView.registerTemplate("fileCreate-template");
            var html = this.template({ id: id });
            this.$instance = $(html);
            this.registerComponent();
        }
        FileDaD.prototype.registerComponent = function () {
            var _this = this;
            var $input = this.$instance.find('input[type="file"]');
            $input.on("change", function (e) {
                var files = e.target.files;
                _this.filesChose(files);
            });
            //Firefox focus bugfix for file input
            $input
                .on("focus", function () { $input.addClass("has-focus"); })
                .on('blur', function () { $input.removeClass("has-focus"); });
            // drag&drop files if the feature is available
            if (this.isAdvancedUpload()) {
                this.$instance
                    .on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                })
                    .on("dragover dragenter", function () {
                    _this.$instance.addClass("is-dragover");
                })
                    .on("dragleave dragend drop", function () {
                    _this.$instance.removeClass("is-dragover");
                })
                    .on("drop", function (e) {
                    var files = e.originalEvent.dataTransfer.files;
                    _this.filesChose(files);
                });
            }
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