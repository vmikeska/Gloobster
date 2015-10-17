var LoginManager = (function () {
    function LoginManager() {
        this.loadCookies();
        if (!this.isAlreadyLogged()) {
            this.facebookUserCreator = new CreateUserFacebook();
            this.googleUserCreator = new CreateUserGoogle();
            this.localUserCreator = new CreateUserLocal();
        }
    }
    LoginManager.prototype.loadCookies = function () {
        var cookieLogStr = $.cookie(Constants.cookieName);
        //!cookieLogStr.startsWith("{")
        if (!cookieLogStr) {
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
    LoginManager.prototype.logout = function () {
        //$.cookie(Constants.cookieName, {}, { path: '/' });
        $.removeCookie(Constants.cookieName);
        window.location.href = "/";
    };
    return LoginManager;
})();
var CookieLogin = (function () {
    function CookieLogin() {
    }
    return CookieLogin;
})();
//# sourceMappingURL=LoginManager.js.map