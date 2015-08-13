var FacebookLogin = (function () {
    function FacebookLogin(config) {
        this.config = config;
    }
    //var loc = this;
    // Logged into your app and Facebook.
    FacebookLogin.prototype.onFacebookConnected = function (response) {
        this.config.onFacebookConnected(response);
    };
    // The person is logged into Facebook, but not your app.
    FacebookLogin.prototype.onFacebookNotAuthorized = function () {
        this.config.onFacebookNotAuthorized();
    };
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    FacebookLogin.prototype.onFacebookNotLogged = function () {
        this.config.onFacebookNotLogged();
    };
    FacebookLogin.prototype.refreshLoginStatus = function () {
        var self = this;
        (function () { return FB.getLoginStatus(function (response) {
            this.statusChangeCallback(response);
        }); });
    };
    FacebookLogin.prototype.statusChangeCallback = function (response) {
        if (response.status === 'connected') {
            this.config.onFacebookConnected(response.authResponse);
        }
        else if (response.status === 'not_authorized') {
            this.config.onFacebookNotAuthorized();
        }
        else {
            this.config.onFacebookNotLogged();
        }
    };
    return FacebookLogin;
})();
var Gloobster = Gloobster || {};
Gloobster.Facebook = Gloobster.Facebook || {};
Gloobster.Facebook.Initialization = function (onInitializedCallback) {
    var loc = this;
    this.onInitialized = onInitializedCallback;
    this.sdkLoad = function (doc) {
        var scriptElementName = 'script';
        var scriptElementId = 'facebook-jssdk';
        var src = "//connect.facebook.net/en_US/sdk.js";
        var isSdkAlreadyLoaded = doc.getElementById(scriptElementId);
        if (isSdkAlreadyLoaded)
            return;
        //create SCRIPT element for SDK
        var js = doc.createElement(scriptElementName);
        js.id = scriptElementId;
        js.src = src;
        //add loaded script before all the previous scripts
        var fjs = doc.getElementsByTagName(scriptElementName)[0];
        fjs.parentNode.insertBefore(js, fjs);
    };
    this.asyncInit = function () {
        FB.init({
            appId: '1519189774979242',
            cookie: true,
            xfbml: true,
            version: 'v2.2'
        });
        if (loc.onInitialized) {
            loc.onInitialized();
        }
    };
};
