var Planning;
(function (Planning) {
    var AnytimeAggregator = (function () {
        function AnytimeAggregator() {
        }
        AnytimeAggregator.prototype.aggregate = function (connections, days) {
            var groupByDestCity = _.groupBy(connections, 'ToCityId');
            var results = [];
            for (var cityKey in groupByDestCity) {
                if (!groupByDestCity.hasOwnProperty(cityKey)) {
                    continue;
                }
                var cityGroup = groupByDestCity[cityKey];
                var city = cityGroup[0];
                var fromPrice = _.min(_.map(cityGroup, function (c) { return c.FromPrice; }));
                var result = { name: city.CityName, gid: cityKey, conns: cityGroup, fromPrice: fromPrice };
                var outConns = [];
                cityGroup.forEach(function (conn) {
                    var c = { fromAirport: conn.FromAirport, toAirport: conn.ToAirport, fromPrice: null, flights: [] };
                    var passedFlights = [];
                    conn.Flights.forEach(function (flight) {
                        var did = flight.DaysInDestination;
                        var fits = days === null || ((did >= (days - 1)) && (did <= (days + 1)));
                        if (fits) {
                            passedFlights.push(flight);
                        }
                    });
                    if (passedFlights.length > 0) {
                        c.flights = passedFlights;
                        c.fromPrice = _.min(_.map(passedFlights, function (c) { return c.Price; }));
                        outConns.push(c);
                    }
                });
                result.conns = outConns;
                results.push(result);
            }
            return results;
        };
        return AnytimeAggregator;
    }());
    Planning.AnytimeAggregator = AnytimeAggregator;
    var AnytimeDisplay = (function () {
        function AnytimeDisplay($cont) {
            this.connections = [];
            this.aggr = new AnytimeAggregator();
            this.$cont = $cont;
            this.$filter = $("#tabsCont");
        }
        AnytimeDisplay.prototype.render = function (connections, days) {
            if (days === void 0) { days = null; }
            this.connections = connections;
            var cities = this.aggr.aggregate(connections, days);
            this.$filter.html(this.getCombo());
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
                var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
                lgi.customMapping = function (i) {
                    return {
                        from: i.fromAirport,
                        to: i.toAirport,
                        price: i.fromPrice
                    };
                };
                lgi.evnt("td", function (e, $connection, $target) {
                    var from = $connection.data("f");
                    var to = $connection.data("t");
                    var gid = $cityBox.data("gid");
                    alert(gid + "-" + from + "-" + to);
                });
                lgi.generateList(item.conns);
            };
            lg.generateList(cities);
        };
        AnytimeDisplay.prototype.getCombo = function () {
            var _this = this;
            var from = 2;
            var to = 14;
            var $combo = $("<select id=\"days\"><select>");
            var $oe = $("<option value=\"-\">Days uspecified</option>");
            $combo.append($oe);
            for (var act = from; act <= to; act++) {
                var $o = $("<option value=\"" + act + "\">" + act + " Days</option>");
                $combo.append($o);
            }
            $combo.change(function (e) {
                e.preventDefault();
                var val = $combo.val();
                _this.daysFilterChange(val);
            });
            return $combo;
        };
        AnytimeDisplay.prototype.daysFilterChange = function (val) {
            var days = (val === "-") ? null : parseInt(val);
            this.render(this.connections, days);
        };
        return AnytimeDisplay;
    }());
    Planning.AnytimeDisplay = AnytimeDisplay;
    var WeekendByWeekDisplay = (function () {
        function WeekendByWeekDisplay($cont) {
            this.aggregator = new WeekendByWeekAggregator();
            this.$cont = $cont;
        }
        WeekendByWeekDisplay.prototype.render = function (connections) {
            var _this = this;
            var weeks = this.aggregator.getByWeek(connections);
            weeks = _.sortBy(weeks, "weekNo");
            this.$cont.html("");
            weeks.forEach(function (week) {
                var $week = _this.genWeek(week);
                _this.$cont.append($week);
            });
        };
        WeekendByWeekDisplay.prototype.genWeek = function (week) {
            var _this = this;
            var weekendRange = DateOps.getWeekendRange(week.weekNo);
            var $week = $("<div class=\"weekCont\"></div>");
            var $title = $("<div style=\"border-bottom: 1px solid red;\"><b>Weekend: " + week.weekNo + ".</b> (" + DateOps.dateToStr(weekendRange.friday) + " - " + DateOps.dateToStr(weekendRange.sunday) + ")</div>");
            $week.append($title);
            week.cities = _.sortBy(week.cities, "fromPrice");
            week.cities.forEach(function (city) {
                var $city = _this.genCity(city, week.weekNo);
                $week.append($city);
            });
            $week.append("<div class=\"fCont\"></div>");
            return $week;
        };
        WeekendByWeekDisplay.prototype.genCity = function (city, weekNo) {
            var _this = this;
            var $city = $("<div style=\"border: 1px solid blue; width: 250px; display: inline-block;\"><div>To: " + city.name + "</div></div>");
            city.fromToOffers.forEach(function (offer) {
                var $fromTo = _this.genFromTo(offer, weekNo);
                $city.append($fromTo);
            });
            return $city;
        };
        WeekendByWeekDisplay.prototype.genFromTo = function (item, weekNo) {
            var _this = this;
            var $fromTo = $("<div>" + item.fromAirport + "-" + item.toAirport + " from: eur " + item.fromPrice + " <a data-wn=\"" + weekNo + "\" data-f=\"" + item.fromAirport + "\" data-t=\"" + item.toAirport + "\" href=\"#\">see flights</a></div>");
            $fromTo.find("a").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var weekNo = $target.data("wn");
                var from = $target.data("f");
                var to = $target.data("t");
                _this.displayFlights($target, weekNo, from, to);
            });
            return $fromTo;
        };
        WeekendByWeekDisplay.prototype.displayFlights = function ($target, weekNo, from, to) {
            var _this = this;
            var data = [["weekNo", weekNo], ["from", from], ["to", to]];
            Views.ViewBase.currentView.apiGet("GetFlights", data, function (flights) {
                var $flights = _this.genFlights(flights);
                var $cont = $target.closest(".weekCont").find(".fCont");
                $cont.html($flights);
                var $aClose = $("<a href=\"#\">Close</a>");
                $aClose.click(function (e) {
                    e.preventDefault();
                    $cont.html("");
                });
                $cont.prepend($aClose);
            });
        };
        WeekendByWeekDisplay.prototype.genFlights = function (flights) {
            var _this = this;
            var $cont = $("<div></div>");
            flights.forEach(function (flight) {
                var $flight = _this.genFlightItem(flight);
                $cont.append($flight);
            });
            return $cont;
        };
        WeekendByWeekDisplay.prototype.genFlightItem = function (flight) {
            var $flight = $("<table><tr><td colspan=\"2\"></td></tr></table>");
            $flight.append(this.getLine("Price", flight.Price));
            $flight.append(this.getLine("Connections", flight.Connections));
            $flight.append(this.getLine("HoursDuration", flight.HoursDuration));
            $flight.append(this.getLine("FlightScore", flight.FlightScore));
            $flight.append(this.getLine("FlightPartsStr", flight.FlightPartsStr));
            return $flight;
        };
        WeekendByWeekDisplay.prototype.getLine = function (cap, val) {
            var $row = $("<tr><td>" + cap + "</td><td>" + val + "</td></tr>");
            return $row;
        };
        return WeekendByWeekDisplay;
    }());
    Planning.WeekendByWeekDisplay = WeekendByWeekDisplay;
    var WeekendByCityDisplay = (function () {
        function WeekendByCityDisplay($cont) {
            this.aggregator = new WeekendByCityAggregator();
            this.$cont = $cont;
        }
        WeekendByCityDisplay.prototype.render = function (connections) {
            var _this = this;
            var cities = this.aggregator.getByCity(connections);
            cities = _.sortBy(cities, "fromPrice");
            cities.forEach(function (city) {
                var $city = _this.genCity(city);
                _this.$cont.append($city);
            });
        };
        WeekendByCityDisplay.prototype.genCity = function (city) {
            var $city = $("<div style=\"border: 1px solid blue; width: 250px; display: inline-block;\"><div>To: " + city.name + "</div><div>FromPrice: " + city.fromPrice + "</div></div>");
            return $city;
        };
        return WeekendByCityDisplay;
    }());
    Planning.WeekendByCityDisplay = WeekendByCityDisplay;
    var WeekendByCountryDisplay = (function () {
        function WeekendByCountryDisplay($cont) {
            this.aggregator = new WeekendByCountryAggregator();
            this.$cont = $cont;
        }
        WeekendByCountryDisplay.prototype.render = function (connections) {
            var _this = this;
            var cs = this.aggregator.getByCountry(connections);
            cs = _.sortBy(cs, "fromPrice");
            cs.forEach(function (city) {
                var $c = _this.genCountry(city);
                _this.$cont.append($c);
            });
        };
        WeekendByCountryDisplay.prototype.genCountry = function (c) {
            var $c = $("<div style=\"border: 1px solid blue; width: 250px; display: inline-block;\"><div>To: " + c.name + "</div><div>FromPrice: " + c.fromPrice + "</div></div>");
            return $c;
        };
        return WeekendByCountryDisplay;
    }());
    Planning.WeekendByCountryDisplay = WeekendByCountryDisplay;
    var WeekendByCityAggregator = (function () {
        function WeekendByCityAggregator() {
        }
        WeekendByCityAggregator.prototype.getByCity = function (connections) {
            var groupByDestCity = _.groupBy(connections, 'ToCityId');
            var results = [];
            for (var cityKey in groupByDestCity) {
                if (!groupByDestCity.hasOwnProperty(cityKey)) {
                    continue;
                }
                var cityGroup = groupByDestCity[cityKey];
                var city = cityGroup[0];
                var result = { name: city.CityName, gid: city.ToCityId, fromPrice: null };
                cityGroup.forEach(function (connection) {
                    connection.WeekFlights.forEach(function (weekFlightsGroup) {
                        var fromPrice = weekFlightsGroup.FromPrice;
                        if (!result.fromPrice) {
                            result.fromPrice = fromPrice;
                        }
                        else if (result.fromPrice > fromPrice) {
                            result.fromPrice = fromPrice;
                        }
                    });
                });
                results.push(result);
            }
            return results;
        };
        return WeekendByCityAggregator;
    }());
    Planning.WeekendByCityAggregator = WeekendByCityAggregator;
    var WeekendByWeekAggregator = (function () {
        function WeekendByWeekAggregator() {
        }
        WeekendByWeekAggregator.prototype.getByWeek = function (connections) {
            var _this = this;
            var groupByDestCity = _.groupBy(connections, 'ToCityId');
            var results = [];
            for (var cityKey in groupByDestCity) {
                if (!groupByDestCity.hasOwnProperty(cityKey)) {
                    continue;
                }
                var cityGroup = groupByDestCity[cityKey];
                cityGroup.forEach(function (connection) {
                    connection.WeekFlights.forEach(function (weekFlightsGroup) {
                        var fromPrice = weekFlightsGroup.FromPrice;
                        var weekResult = _this.getOrCreateWeekResult(results, weekFlightsGroup.WeekNo);
                        var city = _this.getOrCreateCityResult(weekResult.cities, connection.ToMapId, connection.CityName);
                        if (!city.fromPrice) {
                            city.fromPrice = fromPrice;
                        }
                        else if (city.fromPrice > fromPrice) {
                            city.fromPrice = fromPrice;
                        }
                        var fromToOffer = { fromAirport: connection.FromAirport, toAirport: connection.ToAirport, fromPrice: fromPrice };
                        city.fromToOffers.push(fromToOffer);
                    });
                });
            }
            return results;
        };
        WeekendByWeekAggregator.prototype.getOrCreateCityResult = function (cities, toPlace, name) {
            var city = _.find(cities, function (c) {
                return c.toPlace === toPlace;
            });
            if (!city) {
                city = { fromToOffers: [], toPlace: toPlace, name: name };
                cities.push(city);
            }
            return city;
        };
        WeekendByWeekAggregator.prototype.getOrCreateWeekResult = function (results, weekNo) {
            var result = _.find(results, function (result) {
                return result.weekNo === weekNo;
            });
            if (!result) {
                result = {
                    weekNo: weekNo,
                    cities: []
                };
                results.push(result);
            }
            return result;
        };
        return WeekendByWeekAggregator;
    }());
    Planning.WeekendByWeekAggregator = WeekendByWeekAggregator;
    var WeekendByCountryAggregator = (function () {
        function WeekendByCountryAggregator() {
        }
        WeekendByCountryAggregator.prototype.getByCountry = function (connections) {
            var groups = _.groupBy(connections, 'CountryCode');
            var results = [];
            for (var key in groups) {
                if (!groups.hasOwnProperty(key)) {
                    continue;
                }
                var group = groups[key];
                var result = { name: key, fromPrice: null };
                group.forEach(function (connection) {
                    connection.WeekFlights.forEach(function (weekFlightsGroup) {
                        var fromPrice = weekFlightsGroup.FromPrice;
                        if (!result.fromPrice) {
                            result.fromPrice = fromPrice;
                        }
                        else if (result.fromPrice > fromPrice) {
                            result.fromPrice = fromPrice;
                        }
                    });
                });
                results.push(result);
            }
            return results;
        };
        return WeekendByCountryAggregator;
    }());
    Planning.WeekendByCountryAggregator = WeekendByCountryAggregator;
    var DateOps = (function () {
        function DateOps() {
        }
        DateOps.dateToStr = function (date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            return dd + "." + mm + "." + yyyy;
        };
        DateOps.getWeekendRange = function (weekNo) {
            var year = 2016;
            var currentDate = new Date(year, 0);
            var currWeekNo = 0;
            var day11 = currentDate.getDay();
            if (day11 <= 4) {
                currWeekNo = 1;
            }
            while (currWeekNo < weekNo) {
                currentDate = this.addDays(currentDate, 1);
                if (currentDate.getDay() === 1) {
                    currWeekNo++;
                }
            }
            var friday = this.addDays(currentDate, 4);
            var sunday = this.addDays(friday, 2);
            return { friday: friday, sunday: sunday };
        };
        DateOps.addDays = function (date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };
        return DateOps;
    }());
    Planning.DateOps = DateOps;
})(Planning || (Planning = {}));
//# sourceMappingURL=DisplayAndAgg.js.map