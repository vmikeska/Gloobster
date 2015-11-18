var Utils = (function () {
    function Utils() {
    }
    Utils.dateStringToUtcDate = function (dateStr) {
        var dateLocal = new Date(Date.parse(dateStr));
        var userOffset = dateLocal.getTimezoneOffset() * 60000;
        var utcTime = new Date(dateLocal.getTime() + userOffset);
        return utcTime;
    };
    Utils.dateToUtcDate = function (dateLocal) {
        var userOffset = dateLocal.getTimezoneOffset() * 60000;
        var localUtcTime = new Date(dateLocal.getTime() - userOffset);
        var utcDate = new Date(Date.UTC(localUtcTime.getUTCFullYear(), localUtcTime.getUTCMonth(), localUtcTime.getUTCDate()));
        return utcDate;
    };
    return Utils;
})();
//# sourceMappingURL=Utils.js.map