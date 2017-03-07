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
        WeekendDisplayer.prototype.showResults = function (queries, grouping) {
            this.queries = queries;
            var results = Planning.FlightsExtractor.getResults(this.queries);
            var days = this.filter.getState();
            if (grouping === LocationGrouping.ByCity) {
                var agg1 = new Planning.WeekendByCityAgg();
                var r1 = agg1.exe(this.queries, days, Planning.DealsLevelFilter.currentStars);
                var d1 = new WeekendByCityDis(this.$cont, results, Planning.DealsLevelFilter.currentScore);
                d1.render(r1);
            }
            if (grouping === LocationGrouping.ByCountry) {
                var agg2 = new Planning.WeekendByCountryAgg();
                var r2 = agg2.exe(this.queries, days, Planning.DealsLevelFilter.currentStars);
                var d2 = new ByCountryDisplay(this.$cont, results, Planning.DealsLevelFilter.currentScore);
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
        function ByWeekDisplay($cont, results, scoreLevel) {
            this.$cont = $cont;
            this.scoreLevel = scoreLevel;
            this.results = results;
        }
        ByWeekDisplay.prototype.render = function (data) {
            var _this = this;
            this.$cont.empty();
            var weeks = _(data).chain()
                .sortBy("week")
                .sortBy("year")
                .value();
            var lg = Common.ListGenerator.init(this.$cont, "weekend-week-template");
            lg.emptyTemplate = "no-destinations-tmp";
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
    var WeekendCityResultsItemsGenerator = (function (_super) {
        __extends(WeekendCityResultsItemsGenerator, _super);
        function WeekendCityResultsItemsGenerator($cont, results, scoreLevel) {
            _super.call(this, Planning.ResultConfigs.bigCity, Planning.ResultConfigs.smallCity, $cont, results, scoreLevel);
            this.type = FlightCacheRecordType.City;
            this.$cont = $cont;
        }
        WeekendCityResultsItemsGenerator.prototype.getItems = function (data) {
            return data.flightsGroups;
        };
        WeekendCityResultsItemsGenerator.prototype.regEvent = function ($group, $item, group, item) {
            var flights = Planning.FlightConvert2.cFlights(item.flights);
            var title = this.v.t("DealsFor", "jsDeals") + " " + group.name;
            var pairs = [{ from: flights[0].from, to: flights[0].to }];
            var cd = new Planning.WeekendDetail(pairs, title, group.gid);
            cd.createLayout();
            cd.init(flights);
        };
        WeekendCityResultsItemsGenerator.prototype.groupMapping = function (group) {
            return {
                gid: group.gid,
                title: group.name,
                price: group.fromPrice
            };
        };
        WeekendCityResultsItemsGenerator.prototype.itemMapping = function (item) {
            return {
                from: item.fromAirport,
                to: item.toAirport,
                price: item.fromPrice,
                flights: item.flights
            };
        };
        return WeekendCityResultsItemsGenerator;
    }(Planning.ResultsItemsGenerator));
    Planning.WeekendCityResultsItemsGenerator = WeekendCityResultsItemsGenerator;
    var WeekendByCityDis = (function (_super) {
        __extends(WeekendByCityDis, _super);
        function WeekendByCityDis($cont, results, scoreLevel) {
            var _this = this;
            _super.call(this, $cont, results, scoreLevel);
            this.onItemAppended = function ($week, week) {
                _this.generateWeek($week, week);
            };
        }
        WeekendByCityDis.prototype.generateWeek = function ($week, week) {
            var $weekCont = $week.find(".cont");
            var dis1 = new WeekendCityResultsItemsGenerator($weekCont, this.results, Planning.DealsLevelFilter.currentScore);
            dis1.generate(week.cities);
        };
        return WeekendByCityDis;
    }(ByWeekDisplay));
    Planning.WeekendByCityDis = WeekendByCityDis;
    var WeekendCountryResultsItemsGenerator = (function (_super) {
        __extends(WeekendCountryResultsItemsGenerator, _super);
        function WeekendCountryResultsItemsGenerator($cont, results, scoreLevel) {
            _super.call(this, Planning.ResultConfigs.bigCountry, Planning.ResultConfigs.smallCountry, $cont, results, scoreLevel);
            this.type = FlightCacheRecordType.Country;
        }
        WeekendCountryResultsItemsGenerator.prototype.getItems = function (data) {
            return data.cities;
        };
        WeekendCountryResultsItemsGenerator.prototype.groupMapping = function (group) {
            return {
                cc: group.countryCode,
                title: group.name,
                price: group.fromPrice
            };
        };
        WeekendCountryResultsItemsGenerator.prototype.itemMapping = function (item) {
            return {
                gid: item.gid,
                name: item.name,
                price: item.fromPrice
            };
        };
        WeekendCountryResultsItemsGenerator.prototype.regEvent = function ($group, $item, group, item) {
            var flightsOrig = this.extractFlights(item.flightsGroups);
            var flights = Planning.FlightConvert2.cFlights(flightsOrig);
            var title = this.v.t("DealsFor", "jsDeals") + " " + item.name;
            var pairs = [{ from: flights[0].from, to: flights[0].to }];
            var gid = 0;
            var cd = new Planning.WeekendDetail(pairs, title, gid);
            cd.createLayout();
            cd.init(flights);
        };
        WeekendCountryResultsItemsGenerator.prototype.extractFlights = function (flightsGroups) {
            var fgs = _.map(flightsGroups, function (fg) {
                return fg.flights;
            });
            var flights = [];
            fgs.forEach(function (fgi) {
                flights = flights.concat(fgi);
            });
            return flights;
        };
        return WeekendCountryResultsItemsGenerator;
    }(Planning.ResultsItemsGenerator));
    Planning.WeekendCountryResultsItemsGenerator = WeekendCountryResultsItemsGenerator;
    var ByCountryDisplay = (function (_super) {
        __extends(ByCountryDisplay, _super);
        function ByCountryDisplay($cont, results, scoreLevel) {
            var _this = this;
            _super.call(this, $cont, results, scoreLevel);
            this.onItemAppended = function ($week, week) {
                _this.generateCountries($week, week);
            };
        }
        ByCountryDisplay.prototype.generateCountries = function ($week, week) {
            var $weekCont = $week.find(".cont");
            var gen = new WeekendCountryResultsItemsGenerator($weekCont, this.results, this.scoreLevel);
            gen.generate(week.countries);
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