var Planning;
(function (Planning) {
    var AnytimeByCityAgg = (function () {
        function AnytimeByCityAgg(connections) {
            this.cities = [];
            this.connections = connections;
        }
        AnytimeByCityAgg.prototype.exe = function (starsLevel) {
            var _this = this;
            this.connections.forEach(function (c) {
                var passedFlights = [];
                c.Flights.forEach(function (f) {
                    var filterMatch = Planning.AnytimeAggUtils.checkFilter(f, starsLevel);
                    if (filterMatch) {
                        passedFlights.push(f);
                    }
                });
                if (passedFlights.length > 0) {
                    var city = _this.getOrCreateCity(c.ToCityId, c.CityName, c.CountryCode);
                    var bestFlight = {
                        from: c.FromAirport,
                        to: c.ToAirport,
                        price: _.min(_.map(passedFlights, function (pf) { return pf.Price; }))
                    };
                    city.bestFlights.push(bestFlight);
                    if (!city.fromPrice) {
                        city.fromPrice = bestFlight.price;
                    }
                    else if (city.fromPrice > bestFlight.price) {
                        city.fromPrice = bestFlight.price;
                    }
                }
            });
        };
        AnytimeByCityAgg.prototype.getOrCreateCity = function (gid, name, countryCode) {
            var city = _.find(this.cities, function (c) { return c.gid === gid; });
            if (!city) {
                city = {
                    gid: gid,
                    name: name,
                    cc: countryCode,
                    fromPrice: null,
                    bestFlights: []
                };
                this.cities.push(city);
            }
            return city;
        };
        return AnytimeByCityAgg;
    }());
    Planning.AnytimeByCityAgg = AnytimeByCityAgg;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeByCityAgg.js.map