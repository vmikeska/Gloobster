var Planning;
(function (Planning) {
    var AnytimeByCountryAgg = (function () {
        function AnytimeByCountryAgg(queries) {
            this.countries = [];
            this.queries = queries;
        }
        AnytimeByCountryAgg.prototype.exe = function (starsLevel) {
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
                    var country = _this.getCountry(r.cc, r.cc);
                    var city = _this.getCity(country, r.gid, r.name);
                    var fromPrice = _.min(_.map(passed, function (pf) { return pf.price; }));
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