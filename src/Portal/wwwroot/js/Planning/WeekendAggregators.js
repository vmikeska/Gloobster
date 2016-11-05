var Planning;
(function (Planning) {
    (function (LocationGrouping) {
        LocationGrouping[LocationGrouping["ByCity"] = 0] = "ByCity";
        LocationGrouping[LocationGrouping["ByCountry"] = 1] = "ByCountry";
        LocationGrouping[LocationGrouping["ByContinent"] = 2] = "ByContinent";
    })(Planning.LocationGrouping || (Planning.LocationGrouping = {}));
    var LocationGrouping = Planning.LocationGrouping;
    var WeekendDisplayer = (function () {
        function WeekendDisplayer($cont) {
            this.$cont = $cont;
        }
        WeekendDisplayer.prototype.showResults = function (connections, grouping) {
            this.connections = connections;
            if (grouping === LocationGrouping.ByCity) {
                var agg1 = new GroupByCity();
                var r1 = agg1.exe(this.connections);
                var d1 = new Planning.ByCityDisplay(this.$cont);
                d1.render(r1);
            }
            if (grouping === LocationGrouping.ByCountry) {
                var agg2 = new GroupByCountry();
                var r2 = agg2.exe(this.connections);
                var d2 = new Planning.ByCountryDisplay(this.$cont);
                d2.render(r2);
            }
        };
        return WeekendDisplayer;
    }());
    Planning.WeekendDisplayer = WeekendDisplayer;
    var GroupByCountry = (function () {
        function GroupByCountry() {
            this.weekGroups = [];
        }
        GroupByCountry.prototype.exe = function (connections) {
            var _this = this;
            connections.forEach(function (c) {
                c.WeekFlights.forEach(function (weekFlight) {
                    var weekGroup = _this.getOrCreateWeekGroup(weekFlight.WeekNo, weekFlight.Year);
                    var country = _this.getOrCreateCountry(weekGroup, c.CountryCode, c.CountryCode);
                    var city = _this.getOrCreateCity(c.ToCityId, c.CityName, country);
                    var flightGroup = {
                        fromPrice: weekFlight.FromPrice,
                        fromAirport: c.FromAirport,
                        toAirport: c.ToAirport,
                        flights: weekFlight.Flights
                    };
                    if (!country.fromPrice) {
                        country.fromPrice = weekFlight.FromPrice;
                    }
                    else if (country.fromPrice > weekFlight.FromPrice) {
                        country.fromPrice = weekFlight.FromPrice;
                    }
                    if (!city.fromPrice) {
                        city.fromPrice = weekFlight.FromPrice;
                    }
                    else if (city.fromPrice > weekFlight.FromPrice) {
                        city.fromPrice = weekFlight.FromPrice;
                    }
                    city.flightsGroups.push(flightGroup);
                });
            });
            return this.weekGroups;
        };
        GroupByCountry.prototype.getOrCreateWeekGroup = function (week, year) {
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
        GroupByCountry.prototype.getOrCreateCountry = function (weekGroup, countryCode, name) {
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
        GroupByCountry.prototype.getOrCreateCity = function (gid, name, countryGroup) {
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
        return GroupByCountry;
    }());
    Planning.GroupByCountry = GroupByCountry;
    var GroupByCity = (function () {
        function GroupByCity() {
            this.weekGroups = [];
        }
        GroupByCity.prototype.exe = function (connections) {
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
        GroupByCity.prototype.getOrCreateWeekGroup = function (week, year) {
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
        GroupByCity.prototype.getOrCreateWeekGroupCity = function (weekGroup, gid, name) {
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
        return GroupByCity;
    }());
    Planning.GroupByCity = GroupByCity;
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