var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var NHomePageView = (function (_super) {
        __extends(NHomePageView, _super);
        function NHomePageView() {
            _super.call(this);
            Views.SettingsUtils.registerLocationCombo("currentCity", "CurrentLocation", function () {
                window.location.href = "/Destination/planning";
            });
        }
        Object.defineProperty(NHomePageView.prototype, "pageType", {
            get: function () { return Views.PageType.HomePage; },
            enumerable: true,
            configurable: true
        });
        return NHomePageView;
    }(Views.ViewBase));
    Views.NHomePageView = NHomePageView;
})(Views || (Views = {}));
//# sourceMappingURL=n_HomePageView.js.map