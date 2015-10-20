var LoginManager = (function () {
    function LoginManager() {
        this.cookieManager = new CookieManager();
        this.loadCookies();
        if (!this.isAlreadyLogged()) {
            this.facebookUserCreator = new CreateUserFacebook();
            this.googleUserCreator = new CreateUserGoogle();
            this.localUserCreator = new CreateUserLocal();
        }
        this.twitterUserCreator = new CreateUserTwitter();
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
        if (this.cookieLogin.networkType === NetworkType.Facebook) {
            FB.getLoginStatus(function () {
                FB.logout(function () {
                    window.location.href = "/";
                });
            });
        }
        else if (this.cookieLogin.networkType === NetworkType.Twitter) {
            window.location.href = "/";
        }
    };
    return LoginManager;
})();
var CookieLogin = (function () {
    function CookieLogin() {
    }
    return CookieLogin;
})();
//# sourceMappingURL=LoginManager.js.map