var Reg;
(function (Reg) {
    var LoginManager = (function () {
        function LoginManager() {
            this.cookieManager = new Common.CookieManager();
            this.loadCookies();
        }
        LoginManager.prototype.loadCookies = function () {
            this.cookieLogin = this.cookieManager.getString(Constants.tokenCookieName);
        };
        LoginManager.prototype.logout = function () {
            this.cookieManager.removeCookie(Constants.tokenCookieName);
            window.location.href = "/";
        };
        return LoginManager;
    })();
    Reg.LoginManager = LoginManager;
})(Reg || (Reg = {}));
//# sourceMappingURL=LoginManager.js.map