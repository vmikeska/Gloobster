var Common;
(function (Common) {
    var Popup = (function () {
        function Popup() {
        }
        Popup.register = function ($p) {
            $p.find(".close").click(function (e) {
                e.preventDefault();
                $p.hide();
            });
        };
        Popup.init = function () {
            var _this = this;
            $(document).ready(function () {
                $(".popup-n").toArray().forEach(function (c) {
                    var $p = $(c);
                    _this.register($p);
                });
            });
        };
        return Popup;
    }());
    Common.Popup = Popup;
})(Common || (Common = {}));
//# sourceMappingURL=Popup.js.map