var Planning;
(function (Planning) {
    var WeekendByWeekDisplay = (function () {
        function WeekendByWeekDisplay() {
            this.weekendByWeekAggregator = new WeekendByWeekAggregator();
            this.$cont = $("#results2");
        }
        WeekendByWeekDisplay.prototype.displayByWeek = function (connections) {
            var _this = this;
            var weeks = this.weekendByWeekAggregator.getByWeek(connections);
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
            var $fromTo = $("<div>" + item.fromAirport + "-" + item.toAirport + " from: \u20AC" + item.fromPrice + " <a data-wn=\"" + weekNo + "\" data-f=\"" + item.fromAirport + "\" data-t=\"" + item.toAirport + "\" href=\"#\">see flights</a></div>");
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
    var ResultsManager = (function () {
        function ResultsManager() {
            this.connections = [];
            this.queue = [];
            this.doRequery = true;
        }
        ResultsManager.prototype.initalCall = function () {
            this.getQueries([]);
        };
        ResultsManager.prototype.getQueries = function (params) {
            var _this = this;
            console.log("Getting queries");
            Views.ViewBase.currentView.apiGet("SearchFlights", params, function (results) {
                _this.recieveResults(results);
            });
        };
        ResultsManager.prototype.recieveResults = function (results) {
            var _this = this;
            console.log("receiving results");
            this.stopQuerying();
            results.forEach(function (result) {
                if (result.NotFinishedYet) {
                }
                else if (result.QueryStarted) {
                    _this.queue.push({ from: result.From, to: result.To, type: result.Type });
                }
                else {
                    console.log("queue length: " + _this.queue.length);
                    _this.queue = _.reject(_this.queue, function (qi) { return qi.from === result.From && qi.to === result.To; });
                    console.log("queue length: " + _this.queue.length);
                    _this.drawQueue();
                    _this.connections = _this.connections.concat(result.Connections);
                    if (_this.onConnectionsChanged) {
                        _this.onConnectionsChanged(_this.connections);
                    }
                }
            });
            if (this.queue.length > 0) {
                this.startQuerying();
            }
        };
        ResultsManager.prototype.stopQuerying = function () {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                console.log("Querying stopped");
            }
        };
        ResultsManager.prototype.startQuerying = function () {
            var _this = this;
            if (!this.doRequery) {
                return;
            }
            this.intervalId = setInterval(function () {
                console.log("Querying started");
                _this.drawQueue();
                if (_this.queue.length === 0) {
                    _this.stopQuerying();
                }
                var prms = _this.buildQueueParams(_this.queue);
                _this.getQueries(prms);
            }, 3000);
        };
        ResultsManager.prototype.drawQueue = function () {
            var $queue = $("#queue");
            if (this.queue.length > 0) {
                $queue.html("<div>Queue: <img class=\"loader\" src=\"/images/loader-gray.gif\"/></div>");
            }
            else {
                $queue.html("");
            }
            this.queue.forEach(function (i) {
                $queue.append("<div style=\"display: inline; width: 50px; border: 1px solid red;\">" + i.from + "-->" + i.to + "</div>");
            });
        };
        ResultsManager.prototype.buildQueueParams = function (queue) {
            var strParams = [];
            var i = 0;
            queue.forEach(function (itm) {
                strParams.push(["q", (itm.from + "-" + itm.to + "-" + itm.type)]);
                i++;
            });
            return strParams;
        };
        ResultsManager.prototype.selectionChanged = function (id, newState, type) {
            this.drawQueue();
            this.getQueries([["p", (id + "-" + type)]]);
        };
        return ResultsManager;
    }());
    Planning.ResultsManager = ResultsManager;
})(Planning || (Planning = {}));
//# sourceMappingURL=ResultsManager.js.map