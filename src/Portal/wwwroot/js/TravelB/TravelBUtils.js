var TravelB;
(function (TravelB) {
    var TravelBUtils = (function () {
        function TravelBUtils() {
        }
        TravelBUtils.waitingMins = function (waitingUntil) {
            var now = new Date();
            var untilDate = new Date(waitingUntil);
            var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            var untilUtc = new Date(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate(), untilDate.getUTCHours(), untilDate.getUTCMinutes(), untilDate.getUTCSeconds());
            var dd = Math.abs(nowUtc.getTime() - untilUtc.getTime());
            var diffMins = Math.ceil(dd / (1000 * 60));
            return diffMins;
        };
        TravelBUtils.i = function (id, text) {
            return { id: id, text: text };
        };
        TravelBUtils.wantDoDB = function () {
            return [
                TravelBUtils.i(0, "Walking tour"),
                TravelBUtils.i(1, "Bar or Pub"),
                TravelBUtils.i(2, "Date"),
                TravelBUtils.i(3, "Sport")
            ];
        };
        TravelBUtils.interestsDB = function () {
            return [
                TravelBUtils.i(0, "Traveling"),
                TravelBUtils.i(1, "Partying"),
                TravelBUtils.i(2, "Sport"),
                TravelBUtils.i(3, "Drinking"),
                TravelBUtils.i(2, "Eating")
            ];
        };
        return TravelBUtils;
    }());
    TravelB.TravelBUtils = TravelBUtils;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=TravelBUtils.js.map