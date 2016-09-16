var Common;
(function (Common) {
    var GlobalUtils = (function () {
        function GlobalUtils() {
        }
        GlobalUtils.getSocLink = function (sourceType, sourceId) {
            var link = "";
            if (sourceType === SourceType.FB) {
                link = "http://facebook.com/" + sourceId;
            }
            if (sourceType === SourceType.S4) {
                link = "http://foursquare.com/v/" + sourceId;
            }
            if (sourceType === SourceType.Yelp) {
                link = "http://www.yelp.com/biz/" + sourceId;
            }
            return link;
        };
        return GlobalUtils;
    }());
    Common.GlobalUtils = GlobalUtils;
})(Common || (Common = {}));
//# sourceMappingURL=GlobalUtils.js.map