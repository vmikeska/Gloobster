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
            this.regOneway();
            this.regClassicBtn();
        }
        HomePageView.prototype.regOneway = function () {
            var _this = this;
            this.$cbOneWay = $("#cbOneWay");
            this.$cbOneWay.click(function (e) {
                var state = _this.$cbOneWay.prop("checked");
                _this.dateTo.enabled(state);
            });
        };
        HomePageView.prototype.initSearch = function () {
            this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), "From place");
            this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), "To place");
            var tomorrow = moment().add(1, "days");
            var in3Days = moment().add(3, "days");
            this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
            this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
        };
        HomePageView.prototype.regClassicBtn = function () {
            var _this = this;
            $("#btnSearch").click(function (e) {
                var fromValid = _this.searchFrom.hasSelected();
                var toValid = _this.searchTo.hasSelected();
                if (!fromValid || !toValid) {
                    var id = new Common.InfoDialog();
                    id.create("Places must be filled out", "Source and destination place must be filled out");
                    return;
                }
                var codeFrom = Planning.DealsPlaceSearch.getCode(_this.searchFrom.selectedItem);
                var codeTo = Planning.DealsPlaceSearch.getCode(_this.searchTo.selectedItem);
                var codeFromType = Planning.DealsPlaceSearch.getType(_this.searchFrom.selectedItem).toString();
                var codeToType = Planning.DealsPlaceSearch.getType(_this.searchTo.selectedItem).toString();
                var dateFromTrans = TravelB.DateUtils.momentDateToTrans(_this.dateFrom.date);
                var dateToTrans = TravelB.DateUtils.momentDateToTrans(_this.dateTo.date);
                var oneway = _this.$cbOneWay.prop("checked");
                var sl = "/deals?type=" + 1 + "&fc=" + codeFrom + "&ft=" + codeFromType + "&tc=" + codeTo + "&tt=" + codeToType + "&dep=" + dateFromTrans + "&depFlex=" + 0 + "&depHome=" + false + "&ret=" + dateToTrans + "&retFlex=" + 0 + "&retHome=" + false + "&seats=" + 1 + "&oneway=" + oneway;
                window.location.href = sl;
            });
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