var Planning;
(function (Planning) {
    var WeekendByCityAgg = (function () {
        function WeekendByCityAgg() {
            this.weekGroups = [];
        }
        WeekendByCityAgg.prototype.exe = function (connections, days, starsLevel) {
            var _this = this;
            connections.forEach(function (connection) {
                connection.WeekFlights.forEach(function (weekFlight) {
                    var flights = _this.fittingFlights(weekFlight.Flights, days, starsLevel);
                    if (any(flights)) {
                        var weekGroup = _this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
                        var weekGroupCity = _this.getOrCreateWeekGroupCity(weekGroup, connection.ToCityId, connection.CityName);
                        var lowestPrice = _this.getLowestPrice(flights);
                        var flightGroup = {
                            fromPrice: lowestPrice,
                            fromAirport: connection.FromAirport,
                            toAirport: connection.ToAirport,
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
            });
            return this.weekGroups;
        };
        WeekendByCityAgg.prototype.fittingFlights = function (fs, days, starsLevel) {
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
        WeekendByCityAgg.prototype.fitsByDays = function (f, days) {
            var parts = this.splitInboundOutboundFlight(f.FlightParts, f.To);
            var first = _.first(parts.thereParts);
            var last = _.last(parts.backParts);
            var from = new Date(first.DeparatureTime);
            var until = new Date(last.ArrivalTime);
            var fDay = this.convDayNo(from.getDay());
            var tDay = this.convDayNo(until.getDay());
            var fDayOk = days.from === fDay;
            var tDayOk = days.to === tDay;
            var valid = fDayOk && tDayOk;
            return valid;
        };
        WeekendByCityAgg.prototype.getLowestPrice = function (flights) {
            var ps = _.map(flights, function (f) { return f.Price; });
            return _.min(ps);
        };
        WeekendByCityAgg.prototype.convDayNo = function (orig) {
            if (orig === 0) {
                return 7;
            }
            return orig;
        };
        WeekendByCityAgg.prototype.splitInboundOutboundFlight = function (parts, to) {
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
                if (fp.To === to) {
                    thereFinished = true;
                }
            });
            return {
                thereParts: thereParts,
                backParts: backParts
            };
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
    }());
    Planning.WeekendByCityAgg = WeekendByCityAgg;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendByCityAgg.js.map