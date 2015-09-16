var FacebookLoginExecutor = (function () {
    function FacebookLoginExecutor() {
    }
    FacebookLoginExecutor.prototype.execute = function () {
        var onFacebookConnected = function (authResponse) {
            var facebookUser = new CreateUserFacebook();
            facebookUser.handleRoughResponse(authResponse);
        };
        //this.fbLogin = new FacebookLogin(loginConfig);			
        this.fbLogin = new FacebookLogin();
        this.fbLogin.onFacebookConnected = onFacebookConnected;
        this.fbInit = new FacebookInit(this.fbLogin.refreshLoginStatus);
        window['fbAsyncInit'] = this.fbInit.asyncInit;
        this.fbInit.sdkLoad(document);
    };
    return FacebookLoginExecutor;
})();
//# sourceMappingURL=FacebookExecutor.js.map