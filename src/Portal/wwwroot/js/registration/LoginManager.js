var Reg;
(function (Reg) {
    var LoginManager = (function () {
        function LoginManager() {
            this.cookieManager = new Common.CookieManager();
            this.loadCookies();
        }
        LoginManager.prototype.loadCookies = function () {
            this.cookieLogin = this.cookieManager.getString(Constants.cookieName);
        };
        LoginManager.prototype.logout = function () {
            this.cookieManager.removeCookie(Constants.cookieName);
            if (this.cookieLogin.networkType === Reg.NetworkType.Facebook) {
                FB.getLoginStatus(function () {
                    FB.logout(function () {
                        window.location.href = "/";
                    });
                });
            }
            else {
                window.location.href = "/";
            }
        };
        return LoginManager;
    })();
    Reg.LoginManager = LoginManager;
})(Reg || (Reg = {}));
//# sourceMappingURL=LoginManager.js.map