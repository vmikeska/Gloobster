var Planning;
(function (Planning) {
    var WeekendDetail = (function () {
        function WeekendDetail(codePairs, title, gid) {
            this.v = Views.ViewBase.currentView;
            this.switcher = new FlightDetailSwitcher();
            this.switcher.init();
            this.flightDetails = new Planning.FlightDetails();
            this.gid = gid;
            this.title = title;
            this.switcher.setTitle(title);
        }
        WeekendDetail.prototype.destroyLayout = function () {
            this.$layout.remove();
        };
        WeekendDetail.prototype.createLayout = function () {
            var cityDealLayout = this.v.registerTemplate("city-deals-weekend-template");
            var context = {
                gid: this.gid,
                title: this.title
            };
            this.$layout = $(cityDealLayout(context));
            this.switcher.showDetail(this.$layout);
        };
        WeekendDetail.prototype.init = function (flights) {
            var _this = this;
            this.ordering = new Planning.FlightsOrdering();
            this.ordering.setFlights(flights);
            this.ordering.onChange = function (orderedFlights) {
                _this.flightDetails.genFlights(_this.$layout.find(".flights"), orderedFlights);
            };
            this.ordering.change();
        };
        return WeekendDetail;
    }());
    Planning.WeekendDetail = WeekendDetail;
    var FlightDetailSwitcher = (function () {
        function FlightDetailSwitcher() {
            this.$searching = $("#allTheSearch");
            this.$detail = $("#flightTheDetail");
            this.$detailCont = this.$detail.find(".cont");
            this.$header = $(".header");
            this.lastTop = 0;
        }
        FlightDetailSwitcher.prototype.init = function () {
            var _this = this;
            this.$detail.find(".close,.link-back").click(function () {
                _this.hideDetail();
            });
        };
        FlightDetailSwitcher.prototype.setTitle = function (txt) {
            this.$detail.find(".detail-txt").html(txt);
        };
        FlightDetailSwitcher.prototype.showDetail = function ($html) {
            this.lastTop = document.body.scrollTop;
            this.$searching.addClass("hidden");
            this.$detail.removeClass("hidden");
            this.$header.addClass("hidden");
            document.body.scrollTop = 0;
            this.$detailCont.html($html);
        };
        FlightDetailSwitcher.prototype.hideDetail = function () {
            this.$detailCont.empty();
            this.$header.removeClass("hidden");
            this.$searching.removeClass("hidden");
            this.$detail.addClass("hidden");
            document.body.scrollTop = this.lastTop;
        };
        return FlightDetailSwitcher;
    }());
    Planning.FlightDetailSwitcher = FlightDetailSwitcher;
    var CityDetail = (function () {
        function CityDetail(scoreLevel, codePairs, title, cityName, gid) {
            this.v = Views.ViewBase.currentView;
            this.switcher = new FlightDetailSwitcher();
            this.switcher.init();
            this.flightDetails = new Planning.FlightDetails();
            this.scoreLevel = scoreLevel;
            this.codePairs = codePairs;
            this.cityName = cityName;
            this.gid = gid;
            this.title = title;
            this.switcher.setTitle(title);
        }
        CityDetail.prototype.init = function (flights) {
            var _this = this;
            this.ordering = new Planning.FlightsOrdering();
            this.ordering.setFlights(flights);
            this.ordering.onChange = function (orderedFlights) {
                _this.flightDetails.genFlights(_this.$layout.find(".flights"), orderedFlights);
            };
            this.ordering.change();
            this.genMonthFlights();
        };
        CityDetail.prototype.createLayout = function () {
            var cityDealLayout = this.v.registerTemplate("city-deals-template");
            var context = {
                gid: this.gid,
                title: this.title
            };
            this.$layout = $(cityDealLayout(context));
            this.switcher.showDetail(this.$layout);
            this.initDeals();
        };
        CityDetail.prototype.filterLayout = function (tmpName) {
            var t = this.v.registerTemplate(tmpName);
            var $tmp = $(t());
            this.$layout.find(".tabs-cont").html($tmp);
            return $tmp;
        };
        CityDetail.prototype.initDeals = function () {
            var _this = this;
            var $filter = this.$layout.find(".other-flights-filter");
            if (this.codePairs.length > 1) {
                this.airSel = new Planning.AirportSelector($filter.find(".airpairs-filter"), this.codePairs);
                this.airSel.onChange = function () {
                    _this.genMonthFlights();
                };
                this.airSel.init();
                $(".multi-conn-cont").show();
            }
            this.slider = new Planning.RangeSlider($filter.find(".days-range"), "daysRange");
            this.slider.genSlider(1, 21);
            this.slider.setVals(5, 7);
            this.slider.onRangeChanged = function () {
                _this.genMonthFlights();
            };
            this.monthsSel = new Planning.MonthsSelector($filter.find(".months"));
            this.monthsSel.gen(12);
            this.monthsSel.onChange = function () {
                _this.genMonthFlights();
            };
        };
        CityDetail.prototype.preloader = function (show) {
            var $p = this.$layout.find(".other-flights-preloader");
            if (show) {
                $p.show();
            }
            else {
                $p.hide();
            }
        };
        CityDetail.prototype.genMonthFlights = function () {
            var days = this.slider.getRange();
            var prms = [
                ["ss", "0"],
                ["daysFrom", days.from.toString()],
                ["daysTo", days.to.toString()],
                ["monthNo", this.monthsSel.month.toString()],
                ["yearNo", this.monthsSel.year.toString()],
                ["scoreLevel", this.scoreLevel.toString()]
            ];
            var codePairs = (this.codePairs.length > 1) ? this.airSel.getActive() : this.codePairs;
            codePairs.forEach(function (cp) {
                var cps = ["codePairs", Planning.AirportSelector.toString(cp)];
                prms.push(cps);
            });
            this.genFlights(prms);
        };
        CityDetail.prototype.genFlights = function (prms, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var $ofCont = this.$layout.find(".other-flights-cont");
            $ofCont.empty();
            this.preloader(true);
            this.v.apiGet("SkypickerCity", prms, function (fs) {
                var flights = Planning.FlightConvert2.cFlights(fs);
                if (callback) {
                    callback(flights);
                }
                flights = _(flights)
                    .chain()
                    .sortBy("price")
                    .reverse()
                    .sortBy("score")
                    .reverse()
                    .value();
                _this.flightDetails.genFlights($ofCont, flights);
                _this.preloader(false);
            });
        };
        return CityDetail;
    }());
    Planning.CityDetail = CityDetail;
})(Planning || (Planning = {}));
//# sourceMappingURL=CityDetail.js.map