var Planning;
(function (Planning) {
    var WeekendDetail = (function () {
        function WeekendDetail(codePairs, title, gid) {
            this.v = Views.ViewBase.currentView;
            this.flightDetails = new Planning.FlightDetails();
            this.gid = gid;
            this.title = title;
        }
        WeekendDetail.prototype.destroyLayout = function () {
            $(".city-deal").remove();
        };
        WeekendDetail.prototype.createLayout = function ($lastBox) {
            var _this = this;
            this.destroyLayout();
            var cityDealLayout = this.v.registerTemplate("city-deals-weekend-template");
            var context = {
                gid: this.gid,
                title: this.title
            };
            this.$layout = $(cityDealLayout(context));
            $lastBox.after(this.$layout);
            this.$layout.find(".close").click(function (e) {
                e.preventDefault();
                _this.destroyLayout();
            });
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
    var CityDetail = (function () {
        function CityDetail(scoreLevel, codePairs, title, cityName, gid) {
            this.v = Views.ViewBase.currentView;
            this.flightDetails = new Planning.FlightDetails();
            this.scoreLevel = scoreLevel;
            this.codePairs = codePairs;
            this.cityName = cityName;
            this.gid = gid;
            this.title = title;
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
        CityDetail.prototype.destroyLayout = function () {
            $(".city-deal").remove();
        };
        CityDetail.prototype.initTabs = function ($cont, callback) {
            var $tabs = $cont.find(".tab");
            $cont.find(".tab")
                .click(function (e) {
                e.preventDefault();
                var $t = $(e.delegateTarget);
                $tabs.removeClass("active");
                $t.addClass("active");
                var t = $t.data("t");
                callback(t);
            });
        };
        CityDetail.prototype.createLayout = function ($lastBox) {
            var _this = this;
            this.destroyLayout();
            var cityDealLayout = this.v.registerTemplate("city-deals-template");
            var context = {
                gid: this.gid,
                title: this.title
            };
            this.$layout = $(cityDealLayout(context));
            $lastBox.after(this.$layout);
            this.initDeals();
            this.initTabs(this.$layout.find(".search-tabs"), function (t) {
                _this.$layout.find(".tabs-cont").empty();
                _this.$layout.find(".other-flights-cont").empty();
                if (t === "deals") {
                    _this.initDeals();
                }
                if (t === "classic") {
                    _this.classicSearch = new Planning.CityClassicSearch(_this);
                    _this.classicSearch.init();
                }
            });
            this.$layout.find(".close").click(function (e) {
                e.preventDefault();
                _this.destroyLayout();
            });
        };
        CityDetail.prototype.filterLayout = function (tmpName) {
            var t = this.v.registerTemplate(tmpName);
            var $tmp = $(t());
            this.$layout.find(".tabs-cont").html($tmp);
            return $tmp;
        };
        CityDetail.prototype.initDeals = function () {
            var _this = this;
            var $tmp = this.filterLayout("deals-srch-template");
            if (this.codePairs.length > 1) {
                this.airSel = new Planning.AirportSelector($tmp.find(".airpairs-filter"), this.codePairs);
                this.airSel.onChange = function () {
                    _this.genMonthFlights();
                };
                this.airSel.init();
                $(".multi-conn-cont").show();
            }
            this.slider = new Planning.RangeSlider($tmp.find(".days-range"), "daysRange");
            this.slider.genSlider(1, 21);
            this.slider.setVals(5, 7);
            this.slider.onRangeChanged = function () {
                _this.genMonthFlights();
            };
            this.monthsSel = new Planning.MonthsSelector($tmp.find(".months"));
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