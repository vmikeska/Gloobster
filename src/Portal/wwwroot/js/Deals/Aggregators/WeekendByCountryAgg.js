var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planning;
(function (Planning) {
    var WeekendByCountryAgg = (function (_super) {
        __extends(WeekendByCountryAgg, _super);
        function WeekendByCountryAgg() {
            _super.apply(this, arguments);
            this.weekGroups = [];
        }
        WeekendByCountryAgg.prototype.exe = function (queries, days, starsLevel) {
            var _this = this;
            Planning.FlightsExtractor.r(queries, function (r, q) {
                var flights = _this.fittingFlights(r.fs, days, starsLevel);
                if (any(flights)) {
                    var weekGroup = _this.getOrCreateWeekGroup(r.week, r.year);
                    var country = _this.getOrCreateCountry(weekGroup, r.cc, r.cc);
                    var city = _this.getOrCreateCity(r.gid, r.name, country);
                    var lowestPrice = _this.getLowestPrice(flights);
                    var flightGroup = {
                        fromPrice: lowestPrice,
                        fromAirport: r.from,
                        toAirport: r.to,
                        flights: flights
                    };
                    if (!country.fromPrice) {
                        country.fromPrice = lowestPrice;
                    }
                    else if (country.fromPrice > lowestPrice) {
                        country.fromPrice = lowestPrice;
                    }
                    if (!city.fromPrice) {
                        city.fromPrice = lowestPrice;
                    }
                    else if (city.fromPrice > lowestPrice) {
                        city.fromPrice = lowestPrice;
                    }
                    city.flightsGroups.push(flightGroup);
                }
            });
            return this.weekGroups;
        };
        WeekendByCountryAgg.prototype.getOrCreateWeekGroup = function (week, year) {
            var weekGroup = _.find(this.weekGroups, function (wg) { return wg.week === week && wg.year === year; });
            if (!weekGroup) {
                weekGroup = {
                    week: week,
                    year: year,
                    countries: []
                };
                this.weekGroups.push(weekGroup);
            }
            return weekGroup;
        };
        WeekendByCountryAgg.prototype.getOrCreateCountry = function (weekGroup, countryCode, name) {
            var wgc = _.find(weekGroup.countries, function (country) { return country.countryCode === countryCode; });
            if (!wgc) {
                wgc = {
                    countryCode: countryCode,
                    name: name,
                    fromPrice: null,
                    cities: []
                };
                weekGroup.countries.push(wgc);
            }
            return wgc;
        };
        WeekendByCountryAgg.prototype.getOrCreateCity = function (gid, name, countryGroup) {
            var city = _.find(countryGroup.cities, function (c) {
                return c.gid === gid;
            });
            if (!city) {
                city = {
                    gid: gid,
                    name: name,
                    fromPrice: null,
                    flightsGroups: []
                };
                countryGroup.cities.push(city);
            }
            return city;
        };
        return WeekendByCountryAgg;
    }(Planning.WeekendAggBase));
    Planning.WeekendByCountryAgg = WeekendByCountryAgg;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendByCountryAgg.js.map