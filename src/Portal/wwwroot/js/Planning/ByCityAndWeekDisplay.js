var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planning;
(function (Planning) {
    var ByWeekDisplay = (function () {
        function ByWeekDisplay($cont) {
            this.$cont = $cont;
        }
        ByWeekDisplay.prototype.render = function (data) {
            var _this = this;
            var weeks = _.sortBy(data, "week");
            var lg = Common.ListGenerator.init(this.$cont, "weekend-week-template");
            lg.clearCont = true;
            lg.customMapping = function (w) {
                var wr = DateOps.getWeekendRange(w.week);
                return {
                    week: w.week,
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
    var ByCountryDisplay = (function (_super) {
        __extends(ByCountryDisplay, _super);
        function ByCountryDisplay($cont) {
            var _this = this;
            _super.call(this, $cont);
            this.onItemAppended = function ($week, week) {
                _this.generateWeek($week, week);
            };
        }
        ByCountryDisplay.prototype.generateWeek = function ($week, week) {
            var _this = this;
            var countries = _.sortBy(week.countries, "fromPrice");
            var lg = Common.ListGenerator.init($week.find(".cont"), "resultGroupItemCountry-template");
            lg.customMapping = function (c) {
                return {
                    cc: c.countryCode,
                    title: c.name,
                    price: c.fromPrice
                };
            };
            lg.onItemAppended = function ($country, country) {
                _this.generateCountryCities($country, country);
            };
            lg.generateList(countries);
        };
        ByCountryDisplay.prototype.generateCountryCities = function ($country, country) {
            var lg = Common.ListGenerator.init($country.find(".items table"), "grouped-country-city-template");
            lg.customMapping = function (c) {
                return {
                    gid: c.gid,
                    name: c.name,
                    price: c.fromPrice,
                };
            };
            lg.generateList(country.cities);
        };
        return ByCountryDisplay;
    }(ByWeekDisplay));
    Planning.ByCountryDisplay = ByCountryDisplay;
    var ByCityDisplay = (function (_super) {
        __extends(ByCityDisplay, _super);
        function ByCityDisplay($cont) {
            var _this = this;
            _super.call(this, $cont);
            this.onItemAppended = function ($week, week) {
                _this.generateWeek($week, week);
            };
        }
        ByCityDisplay.prototype.generateWeek = function ($week, week) {
            var _this = this;
            var cities = _.sortBy(week.cities, "fromPrice");
            var lg = Common.ListGenerator.init($week.find(".cont"), "resultGroupItem-template");
            lg.customMapping = function (c) {
                return {
                    gid: c.gid,
                    title: c.name,
                    price: c.fromPrice
                };
            };
            lg.onItemAppended = function ($city, city) {
                _this.generateCityFlightGroups($city, city);
            };
            lg.generateList(cities);
        };
        ByCityDisplay.prototype.generateCityFlightGroups = function ($city, city) {
            var lg = Common.ListGenerator.init($city.find(".items table"), "resultGroup-priceItem-template");
            lg.customMapping = function (g) {
                return {
                    from: g.fromAirport,
                    to: g.toAirport,
                    price: g.fromPrice,
                    flights: g.flights
                };
            };
            lg.generateList(city.flightsGroups);
        };
        return ByCityDisplay;
    }(ByWeekDisplay));
    Planning.ByCityDisplay = ByCityDisplay;
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
//# sourceMappingURL=ByCityAndWeekDisplay.js.map