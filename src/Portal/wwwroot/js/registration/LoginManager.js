var Reg;
(function (Reg) {
    var LoginManager = (function () {
        function LoginManager() {
            this.cookieManager = new Common.CookieManager();
            this.loadCookies();
            if (!this.isAlreadyLogged()) {
                this.facebookUserCreator = new Reg.CreateUserFacebook();
                this.googleUserCreator = new Reg.CreateUserGoogle();
                this.localUserCreator = new Reg.CreateUserLocal();
                this.twitterUserCreator = new Reg.CreateUserTwitter();
            }
        }
        LoginManager.prototype.loadCookies = function () {
            this.cookieLogin = this.cookieManager.getJson(Constants.cookieName);
        };
        LoginManager.prototype.isAlreadyLogged = function () {
            if (this.cookieLogin) {
                return true;
            }
            return false;
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
    var CookieLogin = (function () {
        function CookieLogin() {
        }
        return CookieLogin;
    })();
    Reg.CookieLogin = CookieLogin;
})(Reg || (Reg = {}));
//# sourceMappingURL=LoginManager.js.map