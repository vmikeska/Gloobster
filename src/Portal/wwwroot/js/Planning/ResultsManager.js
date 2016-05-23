var Planning;
(function (Planning) {
    var ResultsManager = (function () {
        function ResultsManager() {
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
                    _this.appendResult(result);
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
                if (_this.queue.length === 0) {
                    _this.stopQuerying();
                }
                var prms = _this.buildQueueParams(_this.queue);
                _this.getQueries(prms);
            }, 3000);
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
        ResultsManager.prototype.appendResult = function (result) {
            result.Connections.forEach(function (conn) {
                var $item = $("<div style=\"width: 200px: display: inline-block;\"><div style=\"border: 1px solid red\">From: " + result.From + ", To: " + result.To + "</div></div>");
                conn.WeekFlights.forEach(function (group) {
                    var $week = $("<div>FromPrice: " + group.FromPrice + ", WeekNo: " + group.WeekNo + "</div>");
                    $item.append($week);
                });
                $("#results").append($item);
            });
        };
        ResultsManager.prototype.selectionChanged = function (id, newState, type) {
            this.getQueries([["p", (id + "-" + type)]]);
        };
        return ResultsManager;
    }());
    Planning.ResultsManager = ResultsManager;
})(Planning || (Planning = {}));
//# sourceMappingURL=ResultsManager.js.map