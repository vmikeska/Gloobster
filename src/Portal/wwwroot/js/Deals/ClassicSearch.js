var Planning;
(function (Planning) {
    var ClassicSearch = (function () {
        function ClassicSearch() {
            this.$mainCont = $(".classic-search");
            this.$results = this.$mainCont.find(".search-results");
        }
        Object.defineProperty(ClassicSearch.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        ClassicSearch.prototype.regSearch = function () {
            var _this = this;
            $("#btnSearch").click(function (e) {
                e.preventDefault();
                var codeFrom = _this.getCode(_this.searchFrom.selectedItem);
                var codeTo = _this.getCode(_this.searchTo.selectedItem);
                var dateFromTrans = TravelB.DateUtils.momentDateToTrans(_this.dateFrom.date);
                var dateToTrans = TravelB.DateUtils.momentDateToTrans(_this.dateTo.date);
                var justDirect = $("#directFlights").prop("checked");
                var passCnt = _this.passangers.val();
                var data = [
                    ["from", codeFrom],
                    ["to", codeTo],
                    ["fromType", _this.getType(_this.searchFrom.selectedItem).toString()],
                    ["toType", _this.getType(_this.searchTo.selectedItem).toString()],
                    ["dateFrom", dateFromTrans],
                    ["dateTo", dateToTrans],
                    ["justDirect", justDirect.toString()],
                    ["passengers", passCnt.toString()]
                ];
                _this.v.apiGet("KiwiSearch", data, function (fs) {
                    var flights = Planning.FlightConvert2.cFlights(fs);
                    var fd = new Planning.FlightDetails();
                    fd.genFlights(_this.$results, flights);
                });
            });
        };
        ClassicSearch.prototype.getType = function (item) {
            if (item.type === 0) {
                return DealsPlaceReturnType.CountryCode;
            }
            if (item.type === 1) {
                if (any(item.childern)) {
                    return DealsPlaceReturnType.GID;
                }
                else {
                    return DealsPlaceReturnType.AirCode;
                }
            }
            if (item.type === 2) {
                return DealsPlaceReturnType.AirCode;
            }
        };
        ClassicSearch.prototype.getCode = function (item) {
            if (item.type === 0) {
                return item.cc;
            }
            if (item.type === 1) {
                if (any(item.childern)) {
                    return item.gid.toString();
                }
                else {
                    return item.air;
                }
            }
            if (item.type === 2) {
                return item.air;
            }
        };
        ClassicSearch.prototype.init = function () {
            this.searchFrom = new Planning.DealsPlaceSearch($("#searchFrom"), "From place");
            this.searchTo = new Planning.DealsPlaceSearch($("#searchTo"), "To place");
            var tomorrow = moment().add(1, "days");
            var in3Days = moment().add(3, "days");
            this.dateFrom = new Common.MyCalendar($("#dateFrom"), tomorrow);
            this.dateTo = new Common.MyCalendar($("#dateTo"), in3Days);
            this.passangers = new Common.NumberPicker($("#passangersCnt"), 1, 10);
            this.regSearch();
        };
        return ClassicSearch;
    }());
    Planning.ClassicSearch = ClassicSearch;
})(Planning || (Planning = {}));
//# sourceMappingURL=ClassicSearch.js.map