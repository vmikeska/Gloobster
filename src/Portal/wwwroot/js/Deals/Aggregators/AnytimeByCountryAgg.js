var Planning;
(function (Planning) {
    var AnytimeByCountryAgg = (function () {
        function AnytimeByCountryAgg(connections) {
            this.countries = [];
            this.connections = connections;
        }
        AnytimeByCountryAgg.prototype.exe = function (starsLevel) {
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
                    var country = _this.getCountry(c.CountryCode, c.CountryCode);
                    var city = _this.getCity(country, c.ToCityId, c.CityName);
                    var fromPrice = _.min(_.map(passedFlights, function (pf) { return pf.Price; }));
                    if (!country.fromPrice) {
                        country.fromPrice = fromPrice;
                    }
                    else if (country.fromPrice > fromPrice) {
                        country.fromPrice = fromPrice;
                    }
                    if (!city.fromPrice) {
                        city.fromPrice = fromPrice;
                    }
                    else if (city.fromPrice > fromPrice) {
                        city.fromPrice = fromPrice;
                    }
                }
            });
        };
        AnytimeByCountryAgg.prototype.getCountry = function (cc, name) {
            var country = _.find(this.countries, function (c) { return c.cc === cc; });
            if (!country) {
                country = {
                    cc: cc,
                    name: name,
                    fromPrice: null,
                    cities: []
                };
                this.countries.push(country);
            }
            return country;
        };
        AnytimeByCountryAgg.prototype.getCity = function (country, gid, name) {
            var city = _.find(country.cities, function (c) { return c.gid === gid; });
            if (!city) {
                city = {
                    gid: gid,
                    name: name,
                    fromPrice: null
                };
                country.cities.push(city);
            }
            return city;
        };
        return AnytimeByCountryAgg;
    }());
    Planning.AnytimeByCountryAgg = AnytimeByCountryAgg;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeByCountryAgg.js.map