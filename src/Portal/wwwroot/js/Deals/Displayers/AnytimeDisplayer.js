var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Planning;
(function (Planning) {
    var AnytimeDisplayer = (function () {
        function AnytimeDisplayer($section) {
            this.$section = $section;
        }
        AnytimeDisplayer.prototype.refresh = function (grouping) {
            this.showResults(this.queries, grouping);
        };
        AnytimeDisplayer.prototype.showResults = function (queries, grouping) {
            this.queries = queries;
            var results = Planning.FlightsExtractor.getResults(this.queries);
            if (grouping === Planning.LocationGrouping.ByCity) {
                var agg1 = new Planning.AnytimeByCityAgg(this.queries);
                agg1.exe(Planning.DealsLevelFilter.currentStars);
                var $wrap1 = this.$section.find(".cat-res");
                var $cont1 = ResultsItemsGenerator.addCont($wrap1);
                var dis1 = new AnytimeCityResultsItemsGenerator($cont1, results, Planning.DealsLevelFilter.currentScore);
                dis1.generate(agg1.cities);
            }
            if (grouping === Planning.LocationGrouping.ByCountry) {
                var agg2 = new Planning.AnytimeByCountryAgg(this.queries);
                agg2.exe(Planning.DealsLevelFilter.currentStars);
                var $wrap2 = this.$section.find(".cat-res");
                var $cont2 = ResultsItemsGenerator.addCont($wrap2);
                var dis2 = new AnytimeCountryResultsItemsGenerator($cont2, results, Planning.DealsLevelFilter.currentScore);
                dis2.generate(agg2.countries);
            }
            if (grouping === Planning.LocationGrouping.ByContinent) {
                var agg3 = new Planning.AnytimeByContinentAgg(this.queries);
                agg3.exe(Planning.DealsLevelFilter.currentStars);
                var dis3 = new AnytimeContinentResultsItemsGenerator(this.$section, results, Planning.DealsLevelFilter.currentScore);
                dis3.render(agg3.getAllConts());
            }
        };
        return AnytimeDisplayer;
    }());
    Planning.AnytimeDisplayer = AnytimeDisplayer;
    var ResultConfigs = (function () {
        function ResultConfigs() {
        }
        ResultConfigs.init = function () {
            this.bigCity = {
                groupTemplate: "result-box-city-template",
                groupClass: "flight-result",
                groupLimitLessTmp: "flights-list-less-tmp",
                groupLimitMoreTmp: "flights-list-more-tmp",
                groupLimitCnt: 4,
                itemTemplate: "one-offer-airports-template",
                collapserTemplate: "offers-collapser-template",
                expanderTemplate: "offers-expander-template",
                limitOffers: true
            };
            this.smallCity = {
                groupTemplate: "result-box-city-small-template",
                groupClass: "flight-result-small",
                groupLimitLessTmp: "flights-list-less-small-tmp",
                groupLimitMoreTmp: "flights-list-more-small-tmp",
                groupLimitCnt: 4,
                itemTemplate: "one-offer-airports-template",
                collapserTemplate: "",
                expanderTemplate: "",
                limitOffers: false
            };
            this.bigCountry = {
                groupTemplate: "result-box-country-template",
                groupClass: "flight-result",
                groupLimitLessTmp: "flights-list-less-tmp",
                groupLimitMoreTmp: "flights-list-more-tmp",
                groupLimitCnt: 4,
                itemTemplate: "one-offer-city-template",
                collapserTemplate: "offers-collapser-template",
                expanderTemplate: "offers-expander-template",
                limitOffers: true
            };
            this.smallCountry = {
                groupTemplate: "result-box-country-small-template",
                groupClass: "flight-result-small",
                groupLimitLessTmp: "flights-list-less-small-tmp",
                groupLimitMoreTmp: "flights-list-more-small-tmp",
                groupLimitCnt: 4,
                itemTemplate: "one-offer-city-template",
                collapserTemplate: "",
                expanderTemplate: "",
                limitOffers: false
            };
        };
        return ResultConfigs;
    }());
    Planning.ResultConfigs = ResultConfigs;
    var ResultsItemsGenerator = (function () {
        function ResultsItemsGenerator(bigConfig, smallConfig, $cont, results, scoreLevel) {
            this.bigConfig = bigConfig;
            this.smallConfig = smallConfig;
            this.$cont = $cont;
            this.results = results;
            this.scoreLevel = scoreLevel;
        }
        Object.defineProperty(ResultsItemsGenerator.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        ResultsItemsGenerator.addCont = function ($wrap) {
            var $cont = $("<div class=\"cont\"></div>");
            $wrap.html($cont);
            return $cont;
        };
        ResultsItemsGenerator.prototype.generate = function (groups) {
            var _this = this;
            groups = _.sortBy(groups, "fromPrice");
            var lg = Common.ListGenerator.init(this.$cont, this.config.groupTemplate);
            lg.listLimit = this.config.groupLimitCnt;
            lg.listLimitMoreTmp = this.config.groupLimitMoreTmp;
            lg.listLimitLessTmp = this.config.groupLimitLessTmp;
            lg.listLimitLast = false;
            lg.clearCont = true;
            lg.emptyTemplate = "no-destinations-tmp";
            lg.customMapping = function (group) {
                var g = _this.groupMapping(group);
                return g;
            };
            lg.onItemAppended = function ($group, group) {
                _this.generateItems($group, group);
            };
            lg.beforeItemAppended = function ($group, group) {
                if (Views.DealsView.listSize === ListSize.Big) {
                    var id = "";
                    if (_this.type === FlightCacheRecordType.City) {
                        id = $group.data("gid").toString();
                    }
                    if (_this.type === FlightCacheRecordType.Country) {
                        id = $group.data("cc").toString();
                    }
                    Planning.ImagesCache.getImageById(id, _this.type, Views.DealsView.listSize, $group);
                }
            };
            lg.generateList(groups);
        };
        ResultsItemsGenerator.prototype.generateItems = function ($group, group) {
            var _this = this;
            var $itemsCont = $group.find("table");
            var items = this.getItems(group);
            var lgi = Common.ListGenerator.init($itemsCont, this.config.itemTemplate);
            lgi.customMapping = function (item) {
                var i = _this.itemMapping(item);
                return i;
            };
            if (this.config.limitOffers) {
                lgi.listLimit = 2;
                lgi.listLimitMoreTmp = "offers-expander-template";
                lgi.listLimitLessTmp = "offers-collapser-template";
            }
            lgi.evnt("td", function (e, $item, $td, item) {
                _this.regEvent($group, $item, group, item);
            });
            lgi.generateList(items);
        };
        ResultsItemsGenerator.prototype.groupMapping = function (group) {
            return group;
        };
        ResultsItemsGenerator.prototype.itemMapping = function (item) {
            return item;
        };
        ResultsItemsGenerator.prototype.getItems = function (data) {
            return data;
        };
        ResultsItemsGenerator.prototype.regEvent = function ($group, $item, group, item) {
        };
        Object.defineProperty(ResultsItemsGenerator.prototype, "config", {
            get: function () {
                return Views.DealsView.listSize === ListSize.Big ? this.bigConfig : this.smallConfig;
            },
            enumerable: true,
            configurable: true
        });
        return ResultsItemsGenerator;
    }());
    Planning.ResultsItemsGenerator = ResultsItemsGenerator;
    var AnytimeCityResultsItemsGenerator = (function (_super) {
        __extends(AnytimeCityResultsItemsGenerator, _super);
        function AnytimeCityResultsItemsGenerator($cont, results, scoreLevel) {
            _super.call(this, ResultConfigs.bigCity, ResultConfigs.smallCity, $cont, results, scoreLevel);
            this.type = FlightCacheRecordType.City;
        }
        AnytimeCityResultsItemsGenerator.prototype.getItems = function (data) {
            return data.bestFlights;
        };
        AnytimeCityResultsItemsGenerator.prototype.regEvent = function ($group, $item, group, item) {
            var from = $item.data("f");
            var to = $item.data("t");
            var gid = $group.data("gid");
            var name = $group.data("name");
            var result = _.find(this.results, function (r) { return r.from === from && r.to === to; });
            var flights = Planning.FlightConvert2.cFlights(result.fs);
            var title = this.v.t("DealsFor", "jsDeals") + " " + name;
            var pairs = [{ from: from, to: to }];
            var cd = new Planning.CityDetail(this.scoreLevel, pairs, title, name, gid);
            cd.createLayout();
            cd.init(flights);
        };
        AnytimeCityResultsItemsGenerator.prototype.groupMapping = function (group) {
            return {
                gid: group.gid,
                title: group.name,
                price: group.fromPrice
            };
        };
        return AnytimeCityResultsItemsGenerator;
    }(ResultsItemsGenerator));
    Planning.AnytimeCityResultsItemsGenerator = AnytimeCityResultsItemsGenerator;
    var AnytimeCountryResultsItemsGenerator = (function (_super) {
        __extends(AnytimeCountryResultsItemsGenerator, _super);
        function AnytimeCountryResultsItemsGenerator($cont, results, scoreLevel) {
            _super.call(this, ResultConfigs.bigCountry, ResultConfigs.smallCountry, $cont, results, scoreLevel);
            this.type = FlightCacheRecordType.Country;
        }
        AnytimeCountryResultsItemsGenerator.prototype.getItems = function (data) {
            return data.cities;
        };
        AnytimeCountryResultsItemsGenerator.prototype.groupMapping = function (group) {
            return {
                cc: group.cc,
                title: group.name,
                price: group.fromPrice
            };
        };
        AnytimeCountryResultsItemsGenerator.prototype.itemMapping = function (item) {
            return {
                gid: item.gid,
                name: item.name,
                price: item.fromPrice
            };
        };
        AnytimeCountryResultsItemsGenerator.prototype.regEvent = function ($group, $item, group, item) {
            var gid = $item.data("gid");
            var results = _.filter(this.results, function (r) { return r.gid === gid; });
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
            var title = this.v.t("DealsFor", "jsDeals") + " " + name;
            var cd = new Planning.CityDetail(this.scoreLevel, pairs, title, name, gid);
            cd.createLayout();
            cd.init(flights);
        };
        return AnytimeCountryResultsItemsGenerator;
    }(ResultsItemsGenerator));
    Planning.AnytimeCountryResultsItemsGenerator = AnytimeCountryResultsItemsGenerator;
    var AnytimeContinentResultsItemsGenerator = (function () {
        function AnytimeContinentResultsItemsGenerator($section, results, scoreLevel) {
            this.continents = [];
            this.results = results;
            this.scoreLevel = scoreLevel;
            this.$res = $section.find(".cat-res");
        }
        AnytimeContinentResultsItemsGenerator.prototype.render = function (conts) {
            var _this = this;
            this.mapContObjs(conts);
            var lg = Common.ListGenerator.init(this.$res, "continent-group-template");
            lg.clearCont = true;
            lg.onItemAppended = function ($continent, continent) {
                _this.genCountries($continent, continent.countries);
            };
            lg.evnt(".visi", function (e, $item, $target, item) {
                var oc = "opened";
                var $cont = $item.find(".cont");
                var isOpened = $item.hasClass(oc);
                $cont.slideToggle(!isOpened, function () {
                    $item.toggleClass(oc, !isOpened);
                });
            });
            lg.generateList(this.continents);
        };
        AnytimeContinentResultsItemsGenerator.prototype.genCountries = function ($continent, countries) {
            var bc = new AnytimeCountryResultsItemsGenerator($continent.find(".cont"), this.results, this.scoreLevel);
            bc.generate(countries);
        };
        AnytimeContinentResultsItemsGenerator.prototype.mapContObjs = function (conts) {
            var v = Views.ViewBase.currentView;
            if (conts.europe.length > 0) {
                this.addCont(v.t("Europe", "jsDeals"), conts.europe);
            }
            if (conts.nAmerica.length > 0) {
                this.addCont(v.t("NorthAmerica", "jsDeals"), conts.nAmerica);
            }
            if (conts.sAmerica.length > 0) {
                this.addCont(v.t("SouthAmerica", "jsDeals"), conts.sAmerica);
            }
            if (conts.asia.length > 0) {
                this.addCont(v.t("Asia", "jsDeals"), conts.asia);
            }
            if (conts.australia.length > 0) {
                this.addCont(v.t("Australia", "jsDeals"), conts.australia);
            }
            if (conts.africa.length > 0) {
                this.addCont(v.t("Africa", "jsDeals"), conts.africa);
            }
        };
        AnytimeContinentResultsItemsGenerator.prototype.addCont = function (name, countries) {
            var cont = {
                name: name,
                countries: countries
            };
            this.continents.push(cont);
        };
        return AnytimeContinentResultsItemsGenerator;
    }());
    Planning.AnytimeContinentResultsItemsGenerator = AnytimeContinentResultsItemsGenerator;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeDisplayer.js.map