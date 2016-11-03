var Planning;
(function (Planning) {
    (function (LocationGrouping) {
        LocationGrouping[LocationGrouping["None"] = 0] = "None";
        LocationGrouping[LocationGrouping["ByCity"] = 1] = "ByCity";
        LocationGrouping[LocationGrouping["ByCountry"] = 2] = "ByCountry";
    })(Planning.LocationGrouping || (Planning.LocationGrouping = {}));
    var LocationGrouping = Planning.LocationGrouping;
    (function (ListOrder) {
        ListOrder[ListOrder["ByWeek"] = 0] = "ByWeek";
        ListOrder[ListOrder["ByPrice"] = 1] = "ByPrice";
    })(Planning.ListOrder || (Planning.ListOrder = {}));
    var ListOrder = Planning.ListOrder;
    var WeekendDisplayer = (function () {
        function WeekendDisplayer($cont) {
            this.$cont = $cont;
        }
        WeekendDisplayer.prototype.showResults = function (connections, grouping, order) {
            this.connections = connections;
            if (grouping === LocationGrouping.ByCity) {
                if (order === ListOrder.ByWeek) {
                    var r1 = GroupByCityAndWeek.exe(this.connections);
                    var d1 = new Planning.ByCityAndWeekDisplay(this.$cont);
                    d1.render(r1);
                }
            }
            if (grouping === LocationGrouping.None) {
            }
            if (grouping === LocationGrouping.ByCountry) {
                if (order === ListOrder.ByWeek) {
                    var r2 = GroupByCountryAndWeek.exe(this.connections);
                    var d2 = new Planning.ByCountryAndWeekDisplay(this.$cont);
                    d2.render(r2);
                }
            }
        };
        return WeekendDisplayer;
    }());
    Planning.WeekendDisplayer = WeekendDisplayer;
    var GroupByCountryAndWeek = (function () {
        function GroupByCountryAndWeek() {
        }
        GroupByCountryAndWeek.exe = function (connections) {
            var _this = this;
            connections.forEach(function (connection) {
                connection.WeekFlights.forEach(function (weekFlight) {
                    var weekGroup = _this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
                    var weekGroupCountry = _this.getOrCreateWeekGroupCountry(weekGroup, connection.CountryCode, connection.CountryCode);
                    var flightGroup = {
                        fromPrice: weekFlight.FromPrice,
                        fromAirport: connection.FromAirport,
                        toAirport: connection.ToAirport,
                        flights: weekFlight.Flights
                    };
                    if (!weekGroupCountry.fromPrice) {
                        weekGroupCountry.fromPrice = weekFlight.FromPrice;
                    }
                    else if (weekGroupCountry.fromPrice > weekFlight.FromPrice) {
                        weekGroupCountry.fromPrice = weekFlight.FromPrice;
                    }
                    weekGroupCountry.flightsGroups.push(flightGroup);
                });
            });
            return this.weekGroups;
        };
        GroupByCountryAndWeek.getOrCreateWeekGroup = function (week, year) {
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
        GroupByCountryAndWeek.getOrCreateWeekGroupCountry = function (weekGroup, countryCode, name) {
            var wgc = _.find(weekGroup.countries, function (country) { return country.countryCode === countryCode; });
            if (!wgc) {
                wgc = {
                    countryCode: countryCode,
                    name: name,
                    fromPrice: null,
                    flightsGroups: []
                };
                weekGroup.countries.push(wgc);
            }
            return wgc;
        };
        GroupByCountryAndWeek.weekGroups = [];
        return GroupByCountryAndWeek;
    }());
    Planning.GroupByCountryAndWeek = GroupByCountryAndWeek;
    var GroupByCityAndWeek = (function () {
        function GroupByCityAndWeek() {
        }
        GroupByCityAndWeek.exe = function (connections) {
            var _this = this;
            connections.forEach(function (connection) {
                connection.WeekFlights.forEach(function (weekFlight) {
                    var weekGroup = _this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
                    var weekGroupCity = _this.getOrCreateWeekGroupCity(weekGroup, connection.ToCityId, connection.CityName);
                    var flightGroup = {
                        fromPrice: weekFlight.FromPrice,
                        fromAirport: connection.FromAirport,
                        toAirport: connection.ToAirport,
                        flights: weekFlight.Flights
                    };
                    if (!weekGroupCity.fromPrice) {
                        weekGroupCity.fromPrice = weekFlight.FromPrice;
                    }
                    else if (weekGroupCity.fromPrice > weekFlight.FromPrice) {
                        weekGroupCity.fromPrice = weekFlight.FromPrice;
                    }
                    weekGroupCity.flightsGroups.push(flightGroup);
                });
            });
            return this.weekGroups;
        };
        GroupByCityAndWeek.getOrCreateWeekGroup = function (week, year) {
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
        GroupByCityAndWeek.getOrCreateWeekGroupCity = function (weekGroup, gid, name) {
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
        GroupByCityAndWeek.weekGroups = [];
        return GroupByCityAndWeek;
    }());
    Planning.GroupByCityAndWeek = GroupByCityAndWeek;
    var GroupingUtils = (function () {
        function GroupingUtils() {
        }
        GroupingUtils.prototype.groupToArray = function (gs) {
            var r = [];
            this.forEachGroup(gs, function (key, items) {
                r.push({ key: key, items: items });
            });
            return r;
        };
        GroupingUtils.prototype.forEachGroup = function (gs, callback) {
            for (var key in gs) {
                if (!gs.hasOwnProperty(key)) {
                    continue;
                }
                callback(key, gs[key]);
            }
        };
        return GroupingUtils;
    }());
    Planning.GroupingUtils = GroupingUtils;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendAggregators.js.map