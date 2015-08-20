var FacebookLoginConfig = (function () {
    function FacebookLoginConfig() {
    }
    return FacebookLoginConfig;
})();
var FacebookLogin = (function () {
    function FacebookLogin() {
        var _this = this;
        this.refreshLoginStatus = function () {
            FB.getLoginStatus(_this.statusChangeCallback);
        };
        this.statusChangeCallback = function (response) {
            if (response.status === 'connected') {
                //this.config.onFacebookConnected(response.authResponse);
                _this.onFacebookConnected(response.authResponse);
            }
            else if (response.status === 'not_authorized') {
                _this.config.onFacebookNotAuthorized();
            }
            else {
                _this.config.onFacebookNotLogged();
            }
        };
        //config: FacebookLoginConfig
        //this.config = config;
    }
    // Logged into your app and Facebook.
    //  public onFacebookConnected(response: any) {
    //		this.config.onFacebookConnected(response);
    //}
    // The person is logged into Facebook, but not your app.
    FacebookLogin.prototype.onFacebookNotAuthorized = function () {
        this.config.onFacebookNotAuthorized();
    };
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    FacebookLogin.prototype.onFacebookNotLogged = function () {
        this.config.onFacebookNotLogged();
    };
    return FacebookLogin;
})();
//# sourceMappingURL=FacebookLogin.js.map