var Planning;
(function (Planning) {
    var WeekendDisplay = (function () {
        function WeekendDisplay() {
        }
        WeekendDisplay.prototype.displayByWeek = function (connections) {
            var results = this.getByWeek(connections);
            results = _.sortBy(results, "weekNo");
            var $results = $("#results2");
            $results.html("");
            results.forEach(function (result) {
                var weekendRange = DateOps.getWeekendRange(result.weekNo);
                var $title = $("<div style=\"border-bottom: 1px solid red;\"><b>Weekend: " + result.weekNo + ".</b> (" + DateOps.dateToStr(weekendRange.friday) + " - " + DateOps.dateToStr(weekendRange.sunday) + ")</div>");
                $results.append($title);
                result.cities = _.sortBy(result.cities, "fromPrice");
                result.cities.forEach(function (city) {
                    var $city = $("<div style=\"border: 1px solid blue; width: 200px; display: inline-block;\"><div>To: " + city.name + "</div></div>");
                    city.fromToOffers.forEach(function (fromToOffer) {
                        var $fromTo = $("<div>" + fromToOffer.fromAirport + "-" + fromToOffer.toAirport + " from: " + fromToOffer.fromPrice + "</div>");
                        $city.append($fromTo);
                    });
                    $results.append($city);
                });
            });
        };
        WeekendDisplay.prototype.getByWeek = function (connections) {
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
        WeekendDisplay.prototype.getOrCreateCityResult = function (cities, toPlace, name) {
            var city = _.find(cities, function (c) {
                return c.toPlace === toPlace;
            });
            if (!city) {
                city = { fromToOffers: [], toPlace: toPlace, name: name };
                cities.push(city);
            }
            return city;
        };
        WeekendDisplay.prototype.getOrCreateWeekResult = function (results, weekNo) {
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
        return WeekendDisplay;
    }());
    Planning.WeekendDisplay = WeekendDisplay;
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