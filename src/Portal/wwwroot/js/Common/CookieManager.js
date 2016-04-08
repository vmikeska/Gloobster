var Common;
(function (Common) {
    var CookieManager = (function () {
        function CookieManager() {
            //todo: change in production
            this.domain = null;
        }
        CookieManager.prototype.getString = function (cookieName) {
            var value = $.cookie(cookieName);
            return value;
        };
        CookieManager.prototype.getJson = function (cookieName) {
            var valStr = this.getString(cookieName);
            if (!valStr) {
                return null;
            }
            var valObj = JSON.parse(valStr);
            return valObj;
        };
        CookieManager.prototype.setString = function (cookieName, cookieValue) {
            $.cookie(cookieName, cookieValue, { "domain": this.domain, "path": "/" });
        };
        CookieManager.prototype.setJson = function (cookieName, cookieValue) {
            var valStr = JSON.stringify(cookieValue);
            this.setString(cookieName, valStr);
        };
        CookieManager.prototype.removeCookie = function (cookieName) {
            $.removeCookie(cookieName, { path: "/" });
        };
        return CookieManager;
    })();
    Common.CookieManager = CookieManager;
})(Common || (Common = {}));
//# sourceMappingURL=CookieManager.js.map