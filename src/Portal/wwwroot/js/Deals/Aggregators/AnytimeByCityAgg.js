var Planning;
(function (Planning) {
    var AnytimeByCityAgg = (function () {
        function AnytimeByCityAgg(queries) {
            this.cities = [];
            this.queries = queries;
        }
        AnytimeByCityAgg.prototype.exe = function (starsLevel) {
            var _this = this;
            Planning.FlightsExtractor.r(this.queries, function (r, q) {
                var passed = [];
                r.fs.forEach(function (f) {
                    var ok = Planning.AnytimeAggUtils.checkFilter(f, starsLevel);
                    if (ok) {
                        passed.push(f);
                    }
                });
                if (any(passed)) {
                    var city = _this.getOrCreateCity(r.gid, r.name, r.cc);
                    var bestFlight = {
                        from: r.from,
                        to: r.to,
                        price: _.min(_.map(passed, function (pf) { return pf.price; }))
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
        AnytimeByCityAgg.prototype.getOrCreateCity = function (gid, name, cc) {
            var city = _.find(this.cities, function (c) { return c.gid === gid; });
            if (!city) {
                city = {
                    gid: gid,
                    name: name,
                    cc: cc,
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