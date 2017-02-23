var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planning;
(function (Planning) {
    (function (LocationGrouping) {
        LocationGrouping[LocationGrouping["ByCity"] = 0] = "ByCity";
        LocationGrouping[LocationGrouping["ByCountry"] = 1] = "ByCountry";
        LocationGrouping[LocationGrouping["ByContinent"] = 2] = "ByContinent";
    })(Planning.LocationGrouping || (Planning.LocationGrouping = {}));
    var LocationGrouping = Planning.LocationGrouping;
    var WeekendDisplayer = (function () {
        function WeekendDisplayer($cont, filter) {
            this.$cont = $cont;
            this.filter = filter;
        }
        WeekendDisplayer.prototype.getStarsLevel = function () {
            return 5;
        };
        WeekendDisplayer.prototype.getScoreLevel = function () {
            return 0.7;
        };
        WeekendDisplayer.prototype.showResults = function (queries, grouping) {
            this.queries = queries;
            var days = this.filter.getState();
            if (grouping === LocationGrouping.ByCity) {
                var agg1 = new Planning.WeekendByCityAgg();
                var r1 = agg1.exe(this.queries, days, this.getStarsLevel());
                var d1 = new WeekendByCityDis(this.$cont, this.getScoreLevel());
                d1.render(r1);
            }
            if (grouping === LocationGrouping.ByCountry) {
                var agg2 = new Planning.WeekendByCountryAgg();
                var r2 = agg2.exe(this.queries, days, this.getStarsLevel());
                var d2 = new ByCountryDisplay(this.$cont, this.getScoreLevel());
                d2.render(r2);
            }
        };
        WeekendDisplayer.prototype.refresh = function (grouping) {
            this.showResults(this.queries, grouping);
        };
        return WeekendDisplayer;
    }());
    Planning.WeekendDisplayer = WeekendDisplayer;
    var ByWeekDisplay = (function () {
        function ByWeekDisplay($cont, scoreLevel) {
            this.$cont = $cont;
            this.scoreLevel = scoreLevel;
        }
        ByWeekDisplay.prototype.render = function (data) {
            var _this = this;
            this.$cont.empty();
            var weeks = _(data).chain()
                .sortBy("week")
                .sortBy("year")
                .value();
            var lg = Common.ListGenerator.init(this.$cont, "weekend-week-template");
            lg.clearCont = true;
            lg.customMapping = function (w) {
                var wr = DateOps.getWeekendRange(w.week);
                return {
                    week: w.week,
                    year: w.year,
                    dateFrom: moment.utc(wr.friday).format("ll"),
                    dateTo: moment.utc(wr.sunday).format("ll")
                };
            };
            lg.onItemAppended = function ($week, week) {
                _this.onItemAppended($week, week);
            };
            lg.generateList(weeks);
        };
        return ByWeekDisplay;
    }());
    Planning.ByWeekDisplay = ByWeekDisplay;
    var WeekendByCityDis = (function (_super) {
        __extends(WeekendByCityDis, _super);
        function WeekendByCityDis($cont, scoreLevel) {
            var _this = this;
            _super.call(this, $cont, scoreLevel);
            this.onItemAppended = function ($week, week) {
                _this.generateWeek($week, week);
            };
        }
        WeekendByCityDis.prototype.generateWeek = function ($week, week) {
            var _this = this;
            var cities = _.sortBy(week.cities, "fromPrice");
            var $weekCont = $week.find(".cont");
            var lg = Common.ListGenerator.init($weekCont, "resultGroupItem-template");
            Planning.AnytimeAggUtils.enrichMoreLess(lg);
            lg.customMapping = function (c) {
                return {
                    gid: c.gid,
                    title: c.name,
                    price: c.fromPrice
                };
            };
            lg.onItemAppended = function ($city, city) {
                _this.generateCity($weekCont, $city, city);
            };
            lg.generateList(cities);
        };
        WeekendByCityDis.prototype.generateCity = function ($weekCont, $city, city) {
            var $cont = $city.find(".items table");
            var lg = Common.ListGenerator.init($cont, "resultGroup-priceItem-template");
            lg.listLimit = 2;
            lg.listLimitMoreTmp = "offers-expander-template";
            lg.listLimitLessTmp = "offers-collapser-template";
            lg.customMapping = function (g) {
                return {
                    from: g.fromAirport,
                    to: g.toAirport,
                    price: g.fromPrice,
                    flights: g.flights
                };
            };
            lg.evnt("td", function (e, $item, $target, conn) {
                var flights = Planning.FlightConvert2.cFlights(conn.flights);
                var $lc = Common.LastItem.getLast($weekCont, "flight-result", $city.data("no"));
                var v = Views.ViewBase.currentView;
                var title = v.t("DealsFor", "jsDeals") + " " + city.name;
                var pairs = [{ from: flights[0].from, to: flights[0].to }];
                var cd = new Planning.WeekendDetail(pairs, title, city.gid);
                cd.createLayout($lc);
                cd.init(flights);
            });
            lg.generateList(city.flightsGroups);
        };
        return WeekendByCityDis;
    }(ByWeekDisplay));
    Planning.WeekendByCityDis = WeekendByCityDis;
    var ByCountryDisplay = (function (_super) {
        __extends(ByCountryDisplay, _super);
        function ByCountryDisplay($cont, scoreLevel) {
            var _this = this;
            _super.call(this, $cont, scoreLevel);
            this.onItemAppended = function ($week, week) {
                _this.generateCountries($week, week);
            };
        }
        ByCountryDisplay.prototype.generateCountries = function ($week, week) {
            var _this = this;
            var countries = _.sortBy(week.countries, "fromPrice");
            var $weekCont = $week.find(".cont");
            var lg = Common.ListGenerator.init($weekCont, "resultGroupItemCountry-template");
            Planning.AnytimeAggUtils.enrichMoreLess(lg);
            lg.customMapping = function (c) {
                return {
                    cc: c.countryCode,
                    title: c.name,
                    price: c.fromPrice
                };
            };
            lg.onItemAppended = function ($country, country) {
                _this.generateCountryCities($country, country, $weekCont);
            };
            lg.generateList(countries);
        };
        ByCountryDisplay.prototype.generateCountryCities = function ($country, country, $weekCont) {
            var _this = this;
            var lg = Common.ListGenerator.init($country.find(".items table"), "grouped-country-city-template");
            lg.listLimit = 2;
            lg.listLimitMoreTmp = "offers-expander-template";
            lg.listLimitLessTmp = "offers-collapser-template";
            lg.customMapping = function (c) {
                var flights = _this.extractFlights(c.flightsGroups);
                return {
                    gid: c.gid,
                    name: c.name,
                    price: c.fromPrice,
                    flights: flights
                };
            };
            lg.evnt("td", function (e, $item, $target, conn) {
                var flightsOrig = _this.extractFlights(conn.flightsGroups);
                var flights = Planning.FlightConvert2.cFlights(flightsOrig);
                var $lc = Common.LastItem.getLast($weekCont, "flight-result", $country.data("no"));
                var v = Views.ViewBase.currentView;
                var title = v.t("DealsFor", "jsDeals") + " " + name;
                var pairs = [{ from: flights[0].from, to: flights[0].to }];
                var gid = 0;
                var cd = new Planning.WeekendDetail(pairs, title, gid);
                cd.createLayout($lc);
                cd.init(flights);
            });
            lg.generateList(country.cities);
        };
        ByCountryDisplay.prototype.extractFlights = function (flightsGroups) {
            var fgs = _.map(flightsGroups, function (fg) {
                return fg.flights;
            });
            var flights = [];
            fgs.forEach(function (fgi) {
                flights = flights.concat(fgi);
            });
            return flights;
        };
        return ByCountryDisplay;
    }(ByWeekDisplay));
    Planning.ByCountryDisplay = ByCountryDisplay;
    var DateOps = (function () {
        function DateOps() {
        }
        DateOps.getWeekendRange = function (weekNo) {
            var year = (new Date().getFullYear());
            var currentDate = new Date(year, 0);
            var currWeekNo = 0;
            var day11 = currentDate.getDay();
            if (day11 <= 4) {
                currWeekNo = 1;
            }
            while (currWeekNo < weekNo) {
                currentDate = this.addDays(currentDate, 1);
                if (currentDate.getDay() === 1) {
                    currWeekNo++;
                }
            }
            var friday = this.addDays(currentDate, 4);
            var sunday = this.addDays(friday, 2);
            return { friday: friday, sunday: sunday };
        };
        DateOps.addDays = function (date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };
        return DateOps;
    }());
    Planning.DateOps = DateOps;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendDisplayer.js.map