var Common;
(function (Common) {
    var F = (function () {
        function F() {
        }
        F.tryParseInt = function (str, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            var retValue = defaultValue;
            if (str) {
                if (str.length > 0) {
                    if (!isNaN(str)) {
                        retValue = parseInt(str);
                    }
                }
            }
            return retValue;
        };
        return F;
    }());
    Common.F = F;
})(Common || (Common = {}));
//# sourceMappingURL=F.js.map