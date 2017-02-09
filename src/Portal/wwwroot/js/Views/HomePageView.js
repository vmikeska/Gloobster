var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var HomePageView = (function (_super) {
        __extends(HomePageView, _super);
        function HomePageView() {
            _super.call(this);
            this.initSearch();
            Views.AirLoc.registerLocationCombo($("#currentCity"), function (place) {
                window.location.href = "/deals";
            });
        }
        HomePageView.prototype.initSearch = function () {
            this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), "From place");
            this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), "To place");
            var tomorrow = moment().add(1, "days");
            var in3Days = moment().add(3, "days");
            this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
            this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
        };
        Object.defineProperty(HomePageView.prototype, "pageType", {
            get: function () { return PageType.HomePage; },
            enumerable: true,
            configurable: true
        });
        return HomePageView;
    }(Views.ViewBase));
    Views.HomePageView = HomePageView;
})(Views || (Views = {}));
//# sourceMappingURL=HomePageView.js.map