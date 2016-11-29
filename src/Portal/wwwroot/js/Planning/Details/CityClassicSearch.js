var Planning;
(function (Planning) {
    var CityClassicSearch = (function () {
        function CityClassicSearch(cd) {
            this.fromDate = this.addDays(new Date(), 1);
            this.toDate = this.addDays(this.fromDate, 3);
            this.currentFlights = [];
            this.depTimeFrom = 0;
            this.depTimeTo = 1440;
            this.arrTimeFrom = 0;
            this.arrTimeTo = 1440;
            this.$flightsCont = $(".other-flights-cont");
            this.cityDetail = cd;
        }
        CityClassicSearch.prototype.addDays = function (date, days) {
            return moment(date).add(days, "days").toDate();
        };
        CityClassicSearch.prototype.init = function () {
            var _this = this;
            this.$flightsCont.empty();
            var $tmp = this.cityDetail.filterLayout("classics-srch-template");
            var $depDate = $tmp.find(".dep .date");
            this.datepicker($depDate, this.fromDate, function (d) {
                _this.fromDate = d;
            });
            var $depTime = this.timeSlider($tmp.find(".dep .time"), "depTime", function (from, to) {
                _this.depTimeFrom = from;
                _this.depTimeTo = to;
                _this.filterFlightsTime();
            });
            var $arrDate = $tmp.find(".arr .date");
            this.datepicker($arrDate, this.toDate, function (d) {
                _this.toDate = d;
            });
            var $arrTime = this.timeSlider($tmp.find(".arr .time"), "arrTime", function (from, to) {
                _this.arrTimeFrom = from;
                _this.arrTimeTo = to;
                _this.filterFlightsTime();
            });
            $tmp.find("#search").click(function (e) {
                e.preventDefault();
                _this.genCustomFlights();
            });
        };
        CityClassicSearch.prototype.filterFlightsTime = function () {
            var _this = this;
            this.$flightsCont.empty();
            var flights = _.filter(this.currentFlights, function (f) {
                var first = _.first(f.FlightParts);
                var last = _.last(f.FlightParts);
                var thereMins = _this.getDateMinutes(new Date(first.DeparatureTime));
                var depFits = _this.timeFits(thereMins, _this.depTimeFrom, _this.depTimeTo);
                var backMins = _this.getDateMinutes(new Date(last.DeparatureTime));
                var arrFits = _this.timeFits(backMins, _this.arrTimeFrom, _this.arrTimeTo);
                return depFits && arrFits;
            });
            this.cityDetail.flightDetails.genFlights(this.$flightsCont, flights);
        };
        CityClassicSearch.prototype.timeFits = function (time, from, to) {
            return from <= time && to >= time;
        };
        CityClassicSearch.prototype.getDateMinutes = function (date) {
            return ((date.getHours() - 1) * 60) + date.getMinutes();
        };
        CityClassicSearch.prototype.genCustomFlights = function () {
            var _this = this;
            var fromDate = TravelB.DateUtils.myDateToTrans(TravelB.DateUtils.jsDateToMyDate(this.fromDate));
            var toDate = TravelB.DateUtils.myDateToTrans(TravelB.DateUtils.jsDateToMyDate(this.toDate));
            var prms = [
                ["ss", "1"],
                ["codeFrom", this.cityDetail.codeFrom],
                ["codeTo", this.cityDetail.codeTo],
                ["dateFrom", fromDate],
                ["dateTo", toDate],
                ["scoreLevel", ScoreLevel.Standard.toString()]
            ];
            this.cityDetail.genFlights(prms, function (flights) {
                _this.currentFlights = flights;
            });
        };
        CityClassicSearch.prototype.timeSlider = function ($cont, id, onChange) {
            var ts = new Planning.TimeSlider($cont, id);
            ts.onRangeChanged = function (from, to) {
                onChange(from, to);
            };
            ts.genSlider();
            return ts;
        };
        CityClassicSearch.prototype.datepicker = function ($dp, date, callback) {
            $dp.datepicker();
            $dp.datepicker("setDate", date);
            $dp.change(function (e) {
                var $this = $(e.target);
                var date = $this.datepicker("getDate");
                callback(date);
            });
        };
        return CityClassicSearch;
    }());
    Planning.CityClassicSearch = CityClassicSearch;
})(Planning || (Planning = {}));
//# sourceMappingURL=CityClassicSearch.js.map