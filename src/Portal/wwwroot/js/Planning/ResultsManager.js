var Planning;
(function (Planning) {
    var ResultsManager = (function () {
        function ResultsManager() {
            this.connections = [];
            this.queue = [];
            this.doRequery = true;
        }
        ResultsManager.prototype.initalCall = function (timeType) {
            this.timeType = timeType;
            this.stopQuerying();
            this.queue = [];
            this.connections = [];
            this.getQueries([["tt", timeType]]);
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
                    _this.connections = _this.connections.concat(result.Result);
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
            strParams.push(["tt", this.timeType]);
            return strParams;
        };
        ResultsManager.prototype.selectionChanged = function (id, newState, type) {
            this.drawQueue();
            this.getQueries([["p", (id + "-" + type)], ["tt", this.timeType]]);
        };
        return ResultsManager;
    }());
    Planning.ResultsManager = ResultsManager;
    var ListGeneratorTest = (function () {
        function ListGeneratorTest() {
        }
        ListGeneratorTest.prototype.test = function (myItems) {
            var lg = new ListGenerator();
            lg.config.$cont = $("#theCont");
            lg.config.itemTemplate = "myItem-template";
            lg.config.evnt($(".delete"), function (e, $target) {
            });
            lg.config.evnt($(".add"), function (e, $target) {
            });
            lg.generateList(myItems);
        };
        return ListGeneratorTest;
    }());
    Planning.ListGeneratorTest = ListGeneratorTest;
    var ListGeneratorConfig = (function () {
        function ListGeneratorConfig() {
            this.clearCont = false;
        }
        ListGeneratorConfig.prototype.evnt = function ($selector, handler) {
            this.eventHandlers.push(new EventHandler($selector, handler));
        };
        return ListGeneratorConfig;
    }());
    Planning.ListGeneratorConfig = ListGeneratorConfig;
    var EventHandler = (function () {
        function EventHandler($selector, handler) {
            this.event = "click";
            this.$selector = $selector;
            this.handler = handler;
        }
        return EventHandler;
    }());
    Planning.EventHandler = EventHandler;
    var ListGenerator = (function () {
        function ListGenerator() {
        }
        ListGenerator.prototype.generateList = function (items) {
            var _this = this;
            this.itemTemplate = Views.ViewBase.currentView.registerTemplate(this.config.itemTemplate);
            if (this.config.clearCont) {
                this.config.$cont.empty();
            }
            items.forEach(function (item) {
                _this.generateItem(item);
            });
        };
        ListGenerator.prototype.generateItem = function (item) {
            var context = item;
            var $item = $(this.itemTemplate(context));
            this.config.eventHandlers.forEach(function (eh) {
                eh.$selector.on(eh.event, function (e) {
                    e.preventDefault();
                    var $target = $(e.target);
                    eh.handler(e, $target);
                });
            });
            this.config.$cont.append($item);
        };
        return ListGenerator;
    }());
    Planning.ListGenerator = ListGenerator;
})(Planning || (Planning = {}));
//# sourceMappingURL=ResultsManager.js.map