var Planning;
(function (Planning) {
    var DelasEval = (function () {
        function DelasEval(timeType, queries) {
            this.res = { Excellent: 0, Good: 0, Standard: 0 };
            this.timeType = timeType;
            this.queries = queries;
        }
        DelasEval.prototype.countDeals = function () {
            var _this = this;
            Planning.FlightsExtractor.f(this.queries, function (f, r, q) {
                var stars = Planning.AnytimeAggUtils.getScoreStars(f.score);
                _this.incCategory(stars);
            });
        };
        DelasEval.prototype.incCategory = function (stars) {
            if (stars >= 4) {
                this.res.Excellent++;
            }
            else if (stars >= 2) {
                this.res.Good++;
            }
            else {
                this.res.Standard++;
            }
        };
        DelasEval.prototype.dispayDeals = function () {
            this.countDeals();
            $("#delasEx").html(this.res.Excellent);
            $("#delasGo").html(this.res.Good);
            $("#delasSt").html(this.res.Standard);
        };
        return DelasEval;
    }());
    Planning.DelasEval = DelasEval;
})(Planning || (Planning = {}));
//# sourceMappingURL=DelasEval.js.map