var Planning;
(function (Planning) {
    var CustomPageSetter = (function () {
        function CustomPageSetter(v) {
            this.formTmp = Views.ViewBase.currentView.registerTemplate("custom-template");
            this.v = v;
        }
        CustomPageSetter.prototype.setConnections = function (conns) {
        };
        CustomPageSetter.prototype.init = function () {
            var $tabContent = $("#tabContent");
            var $form = $(this.formTmp());
            $tabContent.html($form);
        };
        return CustomPageSetter;
    }());
    Planning.CustomPageSetter = CustomPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=CustomPageSetter.js.map