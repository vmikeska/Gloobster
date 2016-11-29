var Planning;
(function (Planning) {
    var AnytimeDisplayer = (function () {
        function AnytimeDisplayer($cont, filter) {
            this.$cont = $cont;
            this.filter = filter;
        }
        AnytimeDisplayer.prototype.showResults = function (connections, grouping) {
            this.connections = connections;
            if (grouping === Planning.LocationGrouping.ByCity) {
                var agg1 = new AnytimeByCityAgg(connections);
                var fs = this.filter.getStateBase();
                agg1.exe(fs.starsLevel);
                var filterState = this.filter.getStateBase();
                var dis = new AnytimeByCityDis(this.connections, filterState.currentLevel);
                dis.render(agg1.cities);
            }
            if (grouping === Planning.LocationGrouping.ByCountry) {
                var agg2 = new AnytimeByCountryAgg(connections);
                var fs2 = this.filter.getStateBase();
                agg2.exe(fs2.starsLevel);
                var dis2 = new AnytimeByCountryDis(this.connections);
                dis2.render(agg2.countries);
            }
        };
        return AnytimeDisplayer;
    }());
    Planning.AnytimeDisplayer = AnytimeDisplayer;
    var AnytimeByCityDis = (function () {
        function AnytimeByCityDis(connections, scoreLevel) {
            this.$cont = $("#resultsCont");
            this.connections = connections;
            this.scoreLevel = scoreLevel;
        }
        AnytimeByCityDis.prototype.render = function (cities) {
            var _this = this;
            cities = _.sortBy(cities, "fromPrice");
            var lg = Common.ListGenerator.init(this.$cont, "resultGroupItem-template");
            lg.clearCont = true;
            lg.customMapping = function (i) {
                return {
                    gid: i.gid,
                    title: i.name,
                    price: i.fromPrice
                };
            };
            lg.onItemAppended = function ($cityBox, item) {
                _this.genOffers($cityBox, item.bestFlights);
            };
            lg.generateList(cities);
        };
        AnytimeByCityDis.prototype.genOffers = function ($cityBox, flights) {
            var _this = this;
            var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
            lgi.evnt("td", function (e, $connection, $td, eItem) {
                var from = $connection.data("f");
                var to = $connection.data("t");
                var gid = $cityBox.data("gid");
                var name = $cityBox.data("name");
                var $lc = Common.LastItem.getLast(_this.$cont, "flight-result", $cityBox.data("no"));
                var conn = _.find(_this.connections, function (c) { return c.FromAirport === from && c.ToAirport === to; });
                var cd = new Planning.CityDetail(_this.scoreLevel, from, to, name, gid);
                cd.createLayout($lc);
                cd.init(conn.Flights);
            });
            lgi.generateList(flights);
        };
        return AnytimeByCityDis;
    }());
    Planning.AnytimeByCityDis = AnytimeByCityDis;
    var AnytimeByCountryDis = (function () {
        function AnytimeByCountryDis(connections) {
            this.$cont = $("#resultsCont");
            this.connections = connections;
        }
        AnytimeByCountryDis.prototype.render = function (countries) {
            var _this = this;
            countries = _.sortBy(countries, "fromPrice");
            var lg = Common.ListGenerator.init(this.$cont, "resultGroupItemCountry-template");
            lg.clearCont = true;
            lg.customMapping = function (i) {
                return {
                    cc: i.cc,
                    title: i.name,
                    price: i.fromPrice
                };
            };
            lg.onItemAppended = function ($country, country) {
                _this.genOffers($country, country.cities);
            };
            lg.generateList(countries);
        };
        AnytimeByCountryDis.prototype.genOffers = function ($cityBox, cities) {
            cities = _.sortBy(cities, "fromPrice");
            var lgi = Common.ListGenerator.init($cityBox.find("table"), "grouped-country-city-template");
            lgi.customMapping = function (i) {
                return {
                    gid: i.gid,
                    name: i.name,
                    price: i.fromPrice
                };
            };
            lgi.generateList(cities);
        };
        return AnytimeByCountryDis;
    }());
    Planning.AnytimeByCountryDis = AnytimeByCountryDis;
    var AnytimeAggUtils = (function () {
        function AnytimeAggUtils() {
        }
        AnytimeAggUtils.checkFilter = function (flight, starsLevel) {
            var scoreOk = this.matchesScore(flight, starsLevel);
            return scoreOk;
        };
        AnytimeAggUtils.matchesScore = function (flight, starsLevel) {
            if (starsLevel === 1) {
                return true;
            }
            var stars = this.getScoreStars(flight.FlightScore);
            if ((starsLevel === 5) && _.contains([5, 4], stars)) {
                return true;
            }
            if ((starsLevel === 3) && _.contains([5, 4, 3, 2], stars)) {
                return true;
            }
            return false;
        };
        AnytimeAggUtils.getScoreStars = function (index) {
            var percents = index * 100;
            if (percents >= 90) {
                return 5;
            }
            if (percents >= 80) {
                return 4;
            }
            if (percents >= 70) {
                return 3;
            }
            if (percents >= 60) {
                return 2;
            }
            return 1;
        };
        return AnytimeAggUtils;
    }());
    Planning.AnytimeAggUtils = AnytimeAggUtils;
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
                    var filterMatch = AnytimeAggUtils.checkFilter(f, starsLevel);
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
                    var filterMatch = AnytimeAggUtils.checkFilter(f, starsLevel);
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
//# sourceMappingURL=AnytimeDisplayer.js.map