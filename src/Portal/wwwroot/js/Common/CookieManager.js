var Common;
(function (Common) {
    var CookieManager = (function () {
        function CookieManager() {
        }
        CookieManager.prototype.getString = function (cookieName) {
            var value = Cookies.get(cookieName);
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
            Cookies.set(cookieName, cookieValue, { expires: 365 });
        };
        CookieManager.prototype.setJson = function (cookieName, cookieValue) {
            var valStr = JSON.stringify(cookieValue);
            this.setString(cookieName, valStr);
        };
        CookieManager.prototype.removeCookie = function (cookieName) {
            Cookies.remove(cookieName);
        };
        return CookieManager;
    })();
    Common.CookieManager = CookieManager;
})(Common || (Common = {}));
//# sourceMappingURL=CookieManager.js.map