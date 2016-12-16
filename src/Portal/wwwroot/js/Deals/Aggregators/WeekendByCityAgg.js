var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planning;
(function (Planning) {
    var WeekendAggBase = (function () {
        function WeekendAggBase() {
        }
        WeekendAggBase.prototype.fittingFlights = function (fs, days, starsLevel) {
            var _this = this;
            var flights = [];
            fs.forEach(function (f) {
                var daysOk = _this.fitsByDays(f, days);
                var scoreOk = Planning.AnytimeAggUtils.checkFilter(f, starsLevel);
                var valid = daysOk && scoreOk;
                if (valid) {
                    flights.push(f);
                }
            });
            return flights;
        };
        WeekendAggBase.prototype.fitsByDays = function (f, days) {
            if (!days) {
                return true;
            }
            var parts = this.splitInboundOutboundFlight(f.parts, f.to);
            var first = _.first(parts.thereParts);
            var last = _.last(parts.backParts);
            if (!first || !last) {
                return false;
            }
            var from = new Date(first.dep);
            var until = new Date(last.arr);
            var fDay = this.convDayNo(from.getDay());
            var tDay = this.convDayNo(until.getDay());
            var fDayOk = days.from === fDay;
            var tDayOk = days.to === tDay;
            var valid = fDayOk && tDayOk;
            return valid;
        };
        WeekendAggBase.prototype.getLowestPrice = function (flights) {
            var ps = _.map(flights, function (f) { return f.price; });
            return _.min(ps);
        };
        WeekendAggBase.prototype.convDayNo = function (orig) {
            if (orig === 0) {
                return 7;
            }
            return orig;
        };
        WeekendAggBase.prototype.splitInboundOutboundFlight = function (parts, to) {
            var thereParts = [];
            var backParts = [];
            var thereFinished = false;
            parts.forEach(function (fp) {
                if (thereFinished) {
                    backParts.push(fp);
                }
                else {
                    thereParts.push(fp);
                }
                if (fp.to === to) {
                    thereFinished = true;
                }
            });
            return {
                thereParts: thereParts,
                backParts: backParts
            };
        };
        return WeekendAggBase;
    }());
    Planning.WeekendAggBase = WeekendAggBase;
    var WeekendByCityAgg = (function (_super) {
        __extends(WeekendByCityAgg, _super);
        function WeekendByCityAgg() {
            _super.apply(this, arguments);
            this.weekGroups = [];
        }
        WeekendByCityAgg.prototype.exe = function (queries, days, starsLevel) {
            var _this = this;
            Planning.FlightsExtractor.r(queries, function (r, q) {
                var flights = _this.fittingFlights(r.fs, days, starsLevel);
                if (any(flights)) {
                    var weekGroup = _this.getOrCreateWeekGroup(r.week, r.year);
                    var weekGroupCity = _this.getOrCreateWeekGroupCity(weekGroup, r.gid, r.name);
                    var lowestPrice = _this.getLowestPrice(flights);
                    var flightGroup = {
                        fromPrice: lowestPrice,
                        fromAirport: r.from,
                        toAirport: r.to,
                        flights: flights
                    };
                    if (!weekGroupCity.fromPrice) {
                        weekGroupCity.fromPrice = lowestPrice;
                    }
                    else if (weekGroupCity.fromPrice > lowestPrice) {
                        weekGroupCity.fromPrice = lowestPrice;
                    }
                    weekGroupCity.flightsGroups.push(flightGroup);
                }
            });
            return this.weekGroups;
        };
        WeekendByCityAgg.prototype.getOrCreateWeekGroup = function (week, year) {
            var weekGroup = _.find(this.weekGroups, function (wg) { return wg.week === week && wg.year === year; });
            if (!weekGroup) {
                weekGroup = {
                    week: week,
                    year: year,
                    cities: []
                };
                this.weekGroups.push(weekGroup);
            }
            return weekGroup;
        };
        WeekendByCityAgg.prototype.getOrCreateWeekGroupCity = function (weekGroup, gid, name) {
            var wgc = _.find(weekGroup.cities, function (city) { return city.gid === gid; });
            if (!wgc) {
                wgc = {
                    gid: gid,
                    name: name,
                    fromPrice: null,
                    flightsGroups: []
                };
                weekGroup.cities.push(wgc);
            }
            return wgc;
        };
        return WeekendByCityAgg;
    }(WeekendAggBase));
    Planning.WeekendByCityAgg = WeekendByCityAgg;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendByCityAgg.js.map