var LoginManager = (function () {
    function LoginManager() {
        this.loadCookies();
        if (!this.isAlreadyLogged()) {
            this.facebookUserCreator = new CreateUserFacebook();
            this.googleUserCreator = new CreateUserGoogle();
        }
    }
    LoginManager.prototype.loadCookies = function () {
        var cookieLogStr = $.cookie(Constants.cookieName);
        if ($.isEmptyObject(cookieLogStr)) {
            return;
        }
        var cookieLogObj = JSON.parse(cookieLogStr);
        this.cookieLogin = new CookieLogin();
        this.cookieLogin.encodedToken = cookieLogObj.encodedToken;
        this.cookieLogin.networkType = cookieLogObj.networkType;
    };
    LoginManager.prototype.isAlreadyLogged = function () {
        if (this.cookieLogin) {
            return true;
        }
        return false;
    };
    return LoginManager;
})();
var CookieLogin = (function () {
    function CookieLogin() {
    }
    return CookieLogin;
})();
//# sourceMappingURL=LoginManager.js.map