var Planning;
(function (Planning) {
    var QueriesBuilder = (function () {
        function QueriesBuilder() {
            this.prms = [];
            this.firstQuery = false;
            this.ccs = [];
            this.gids = [];
            this.qids = [];
        }
        QueriesBuilder.new = function () {
            return new QueriesBuilder();
        };
        QueriesBuilder.prototype.addCC = function (cc) {
            this.ccs.push(cc);
            return this;
        };
        QueriesBuilder.prototype.addGID = function (gid) {
            this.gids.push(gid);
            return this;
        };
        QueriesBuilder.prototype.addQID = function (qid) {
            this.qids.push(qid);
            return this;
        };
        QueriesBuilder.prototype.setFirstQuery = function (state) {
            this.firstQuery = state;
            return this;
        };
        QueriesBuilder.prototype.setTimeType = function (val) {
            this.timeType = val;
            return this;
        };
        QueriesBuilder.prototype.setCustomId = function (val) {
            this.customId = val;
            return this;
        };
        QueriesBuilder.prototype.build = function () {
            var _this = this;
            this.addPrm("timeType", this.timeType);
            this.addPrm("firstQuery", this.firstQuery);
            this.addPrm("customId", this.customId);
            if (this.firstQuery) {
                return this.prms;
            }
            this.ccs.forEach(function (cc) {
                _this.addPrm("ccs", cc);
            });
            this.gids.forEach(function (gid) {
                _this.addPrm("gids", gid);
            });
            this.qids.forEach(function (qid) {
                _this.addPrm("qids", qid);
            });
            return this.prms;
        };
        QueriesBuilder.prototype.addPrm = function (name, val) {
            if (notNull(val)) {
                var p = [name, val.toString()];
                this.prms.push(p);
            }
        };
        return QueriesBuilder;
    }());
    Planning.QueriesBuilder = QueriesBuilder;
    var ResultsManager = (function () {
        function ResultsManager() {
            this.finishedQueries = [];
            this.queue = [];
            this.doRequery = true;
            this.lastCustomId = "";
            this.maxQueries = 60;
        }
        ResultsManager.prototype.refresh = function () {
            this.initalCall(this.timeType, this.lastCustomId);
        };
        ResultsManager.prototype.initalCall = function (timeType, customId) {
            if (customId === void 0) { customId = ""; }
            this.lastCustomId = customId;
            this.timeType = timeType;
            this.stopQuerying();
            this.queue = [];
            this.finishedQueries = [];
            this.resultsChanged();
            var request = QueriesBuilder.new()
                .setFirstQuery(true)
                .setTimeType(timeType)
                .setCustomId(customId)
                .build();
            this.getQueries(request);
        };
        ResultsManager.prototype.recieveQueries = function (queries) {
            var _this = this;
            var newResults = false;
            queries.forEach(function (query) {
                if (query.state === QueryState.Failed) {
                    _this.removeFromQueue(query.qid);
                }
                if (query.state === QueryState.Finished) {
                    _this.addToFinished(query);
                    newResults = true;
                }
                if (query.state === QueryState.Saved || query.state === QueryState.Started) {
                    _this.addToQueue(query);
                }
            });
            this.drawQueue();
            if (newResults) {
                this.resultsChanged();
            }
            if (this.queue.length > 0) {
                this.startQuerying();
            }
        };
        ResultsManager.prototype.addToQueue = function (query) {
            var exists = _.find(this.queue, function (item) { return item.qid === query.qid; });
            if (exists) {
                return;
            }
            this.queue.push(query);
        };
        ResultsManager.prototype.addToFinished = function (query) {
            this.finishedQueries.push(query);
            this.removeFromQueue(query.qid);
        };
        ResultsManager.prototype.removeFromQueue = function (id) {
            this.queue = _.reject(this.queue, function (item) { return item.qid === id; });
        };
        ResultsManager.prototype.selectionChanged = function (id, newState, type, customId) {
            if (customId === void 0) { customId = ""; }
            this.lastCustomId = customId;
            if (newState) {
                this.drawQueue();
                var qb = QueriesBuilder.new()
                    .setTimeType(this.timeType)
                    .setCustomId(customId);
                if (type === FlightCacheRecordType.City) {
                    qb.addGID(parseInt(id));
                }
                if (type === FlightCacheRecordType.Country) {
                    qb.addCC(id);
                }
                var prms = qb.build();
                this.getQueries(prms);
            }
            else {
                this.finishedQueries = _.reject(this.finishedQueries, function (c) { return c.to === id; });
                this.resultsChanged();
            }
        };
        ResultsManager.prototype.getQueries = function (params) {
            var _this = this;
            this.stopQuerying();
            Views.ViewBase.currentView.apiGet("Deals", params, function (queries) {
                _this.recieveQueries(queries);
            });
        };
        ResultsManager.prototype.resultsChanged = function () {
            if (this.onResultsChanged) {
                this.onResultsChanged(this.finishedQueries);
            }
        };
        ResultsManager.prototype.stopQuerying = function () {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        };
        ResultsManager.prototype.startQuerying = function () {
            var _this = this;
            this.drawQueue();
            if (!this.doRequery) {
                return;
            }
            this.intervalId = setInterval(function () {
                _this.drawQueue();
                if (_this.queue.length === 0) {
                    _this.stopQuerying();
                }
                var qb = QueriesBuilder.new()
                    .setTimeType(_this.timeType);
                if (_this.queue.length > _this.maxQueries) {
                    for (var act = 0; act <= _this.maxQueries - 1; act++) {
                        var q = _this.queue[act];
                        qb.addQID(q.qid);
                    }
                }
                else {
                    _this.queue.forEach(function (q) {
                        qb.addQID(q.qid);
                    });
                }
                var prms = qb.build();
                _this.getQueries(prms);
            }, 3000);
        };
        ResultsManager.prototype.drawQueue = function () {
            if (this.onDrawQueue) {
                this.onDrawQueue();
            }
        };
        return ResultsManager;
    }());
    Planning.ResultsManager = ResultsManager;
    var QueueVisualize = (function () {
        function QueueVisualize($rootCont) {
            this.$rootCont = $rootCont;
            this.$mainCont = this.$rootCont.find(".cat-queue");
            this.$cont = this.$mainCont.find(".cont");
            this.itemTmp = Views.ViewBase.currentView.registerTemplate("queue-item-tmp");
        }
        QueueVisualize.prototype.draw = function (timeType, queries) {
            var _this = this;
            this.$cont.empty();
            this.$mainCont.removeClass("hidden");
            var maxItems = 7;
            var qd = queries;
            var shrinkQueue = qd.length > maxItems;
            var origSize = qd.length;
            if (shrinkQueue) {
                qd = qd.slice(0, maxItems);
            }
            var itemsCut = origSize - qd.length;
            var v = Views.ViewBase.currentView;
            qd.forEach(function (query) {
                var prmsTxt = "";
                if (timeType === PlanningType.Weekend) {
                    var dates = ParamsParsers.weekend(query.prms);
                    prmsTxt = "(" + dates.week + ". " + v.t("WeekNo", "jsDeals") + ", " + dates.year + ")";
                }
                var text = query.from + " - " + query.toName + " " + prmsTxt;
                var context = {
                    text: text
                };
                var $itm = _this.itemTmp(context);
                _this.$cont.append($itm);
            });
            if (shrinkQueue) {
                this.$cont.append("<span>+ " + itemsCut + " more</span>");
            }
        };
        QueueVisualize.prototype.hide = function () {
            this.$cont.empty();
            this.$mainCont.addClass("hidden");
        };
        return QueueVisualize;
    }());
    Planning.QueueVisualize = QueueVisualize;
    var ParamsParsers = (function () {
        function ParamsParsers() {
        }
        ParamsParsers.weekend = function (prms) {
            var ps = prms.split("_");
            return {
                week: ps[0],
                year: ps[1]
            };
        };
        ParamsParsers.custom = function (prms) {
            var ps = prms.split("_");
            return {
                userId: ps[0],
                searchId: ps[1]
            };
        };
        return ParamsParsers;
    }());
    Planning.ParamsParsers = ParamsParsers;
})(Planning || (Planning = {}));
//# sourceMappingURL=ResultsManager.js.map