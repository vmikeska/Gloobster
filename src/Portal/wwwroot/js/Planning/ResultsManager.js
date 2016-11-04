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
            var newConnections = false;
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
                    newConnections = true;
                }
            });
            if (newConnections) {
                if (this.onConnectionsChanged) {
                    this.onConnectionsChanged(this.connections);
                }
            }
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
})(Planning || (Planning = {}));
//# sourceMappingURL=ResultsManager.js.map