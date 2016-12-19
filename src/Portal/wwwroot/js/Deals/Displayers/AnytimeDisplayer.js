var Planning;
(function (Planning) {
    var AnytimeDisplayer = (function () {
        function AnytimeDisplayer($cont, filter) {
            this.$cont = $cont;
            this.filter = filter;
        }
        AnytimeDisplayer.prototype.showResults = function (queries, grouping) {
            this.queries = queries;
            var filterState = this.filter.getStateBase();
            var results = Planning.FlightsExtractor.getResults(this.queries);
            if (grouping === Planning.LocationGrouping.ByCity) {
                var agg1 = new Planning.AnytimeByCityAgg(this.queries);
                var fs = this.filter.getStateBase();
                agg1.exe(fs.starsLevel);
                var dis = new AnytimeByCityDis(results, filterState.currentLevel);
                dis.render(agg1.cities);
            }
            if (grouping === Planning.LocationGrouping.ByCountry) {
                var agg2 = new Planning.AnytimeByCountryAgg(this.queries);
                var fs2 = this.filter.getStateBase();
                agg2.exe(fs2.starsLevel);
                var dis2 = new AnytimeByCountryDis(results, filterState.currentLevel);
                dis2.render(agg2.countries, $("#resultsCont"));
            }
            if (grouping === Planning.LocationGrouping.ByContinent) {
                var agg3 = new Planning.AnytimeByContinentAgg(this.queries);
                var fs3 = this.filter.getStateBase();
                agg3.exe(fs3.starsLevel);
                var dis3 = new AnytimeByContinentDis(results, filterState.currentLevel);
                dis3.render(agg3.getAllConts());
            }
        };
        return AnytimeDisplayer;
    }());
    Planning.AnytimeDisplayer = AnytimeDisplayer;
    var AnytimeByCityDis = (function () {
        function AnytimeByCityDis(results, scoreLevel) {
            this.$cont = $("#resultsCont");
            this.results = results;
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
        AnytimeByCityDis.prototype.genOffers = function ($cityBox, bestFlights) {
            var _this = this;
            var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
            lgi.listLimit = 2;
            lgi.listLimitMoreTmp = "offers-expander-template";
            lgi.listLimitLessTmp = "offers-collapser-template";
            lgi.evnt("td", function (e, $connection, $td, eItem) {
                var from = $connection.data("f");
                var to = $connection.data("t");
                var gid = $cityBox.data("gid");
                var name = $cityBox.data("name");
                var $lc = Common.LastItem.getLast(_this.$cont, "flight-result", $cityBox.data("no"));
                var result = _.find(_this.results, function (r) { return r.from === from && r.to === to; });
                var flights = Planning.FlightConvert2.cFlights(result.fs);
                var title = "Deals for " + name;
                var pairs = [{ from: from, to: to }];
                var cd = new Planning.CityDetail(_this.scoreLevel, pairs, title, name, gid);
                cd.createLayout($lc);
                cd.init(flights);
            });
            lgi.generateList(bestFlights);
        };
        return AnytimeByCityDis;
    }());
    Planning.AnytimeByCityDis = AnytimeByCityDis;
    var AnytimeByCountryDis = (function () {
        function AnytimeByCountryDis(results, scoreLevel) {
            this.results = results;
            this.scoreLevel = scoreLevel;
        }
        AnytimeByCountryDis.prototype.render = function (countries, $cont) {
            var _this = this;
            this.$cont = $cont;
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
            var _this = this;
            cities = _.sortBy(cities, "fromPrice");
            var lgi = Common.ListGenerator.init($cityBox.find("table"), "grouped-country-city-template");
            lgi.customMapping = function (i) {
                return {
                    gid: i.gid,
                    name: i.name,
                    price: i.fromPrice
                };
            };
            lgi.listLimit = 2;
            lgi.listLimitMoreTmp = "offers-expander-template";
            lgi.listLimitLessTmp = "offers-collapser-template";
            lgi.evnt(null, function (e, $tr, $target, item) {
                var gid = $tr.data("gid");
                var $lc = Common.LastItem.getLast(_this.$cont, "flight-result", $cityBox.data("no"));
                var results = _.filter(_this.results, function (r) { return r.gid === gid; });
                var first = _.first(results);
                var name = first.name;
                var flights = [];
                var pairs = [];
                results.forEach(function (r) {
                    pairs.push({ from: r.from, to: r.to });
                    r.fs.forEach(function (f) {
                        var flight = Planning.FlightConvert2.cFlight(f);
                        flights.push(flight);
                    });
                });
                var title = "Deals for " + name;
                var cd = new Planning.CityDetail(_this.scoreLevel, pairs, title, name, gid);
                cd.createLayout($lc);
                cd.init(flights);
            });
            lgi.generateList(cities);
        };
        return AnytimeByCountryDis;
    }());
    Planning.AnytimeByCountryDis = AnytimeByCountryDis;
    var AnytimeByContinentDis = (function () {
        function AnytimeByContinentDis(results, scoreLevel) {
            this.$cont = $("#resultsCont");
            this.continents = [];
            this.results = results;
            this.scoreLevel = scoreLevel;
        }
        AnytimeByContinentDis.prototype.render = function (conts) {
            var _this = this;
            this.mapContObjs(conts);
            var lg = Common.ListGenerator.init(this.$cont, "continent-group-template");
            lg.clearCont = true;
            lg.onItemAppended = function ($continent, continent) {
                _this.genCountries($continent, continent.countries);
            };
            lg.evnt(".visi", function (e, $item, $target, item) {
                var vis = Boolean($target.data("v"));
                var txt = vis ? "expand" : "collapse";
                $target.html(txt);
                $item.find(".cont").toggle(!vis);
                $target.data("v", !vis);
            });
            lg.generateList(this.continents);
        };
        AnytimeByContinentDis.prototype.genCountries = function ($continent, countries) {
            var bc = new AnytimeByCountryDis(this.results, this.scoreLevel);
            bc.render(countries, $continent.find(".cont"));
        };
        AnytimeByContinentDis.prototype.mapContObjs = function (conts) {
            if (conts.europe.length > 0) {
                this.addCont("Europe", conts.europe);
            }
            if (conts.nAmerica.length > 0) {
                this.addCont("North America", conts.nAmerica);
            }
            if (conts.sAmerica.length > 0) {
                this.addCont("South America", conts.sAmerica);
            }
            if (conts.asia.length > 0) {
                this.addCont("Asia", conts.asia);
            }
            if (conts.australia.length > 0) {
                this.addCont("Australia", conts.australia);
            }
            if (conts.africa.length > 0) {
                this.addCont("Africa", conts.africa);
            }
        };
        AnytimeByContinentDis.prototype.addCont = function (name, countries) {
            var cont = {
                name: name,
                countries: countries
            };
            this.continents.push(cont);
        };
        return AnytimeByContinentDis;
    }());
    Planning.AnytimeByContinentDis = AnytimeByContinentDis;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeDisplayer.js.map