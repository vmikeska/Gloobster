var Planning;
(function (Planning) {
    var AnytimeAggUtils = (function () {
        function AnytimeAggUtils() {
        }
        AnytimeAggUtils.enrichMoreLess = function (lg) {
            lg.listLimit = 4;
            lg.listLimitMoreTmp = "flights-list-more-tmp";
            lg.listLimitLessTmp = "flights-list-less-tmp";
            lg.listLimitLast = false;
        };
        AnytimeAggUtils.checkFilter = function (flight, starsLevel) {
            var scoreOk = this.matchesScore(flight, starsLevel);
            return scoreOk;
        };
        AnytimeAggUtils.matchesScore = function (flight, starsLevel) {
            if (starsLevel === 1) {
                return true;
            }
            var stars = this.getScoreStars(flight.score);
            if ((starsLevel === 5) && _.contains([5, 4], stars)) {
                return true;
            }
            if ((starsLevel === 3) && _.contains([5, 4, 3, 2], stars)) {
                return true;
            }
            return false;
        };
        AnytimeAggUtils.getScoreStars = function (index) {
            var percents = index * 100;
            if (percents >= 90) {
                return 5;
            }
            if (percents >= 80) {
                return 4;
            }
            if (percents >= 70) {
                return 3;
            }
            if (percents >= 60) {
                return 2;
            }
            return 1;
        };
        return AnytimeAggUtils;
    }());
    Planning.AnytimeAggUtils = AnytimeAggUtils;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimeAggUtils.js.map