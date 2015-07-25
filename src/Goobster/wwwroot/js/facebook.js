var Gloobster = Gloobster || {};
Gloobster.Facebook = Gloobster.Facebook || {};

Gloobster.Facebook.Login = function (config) {

    var loc = this;

    // Logged into your app and Facebook.
    this.onFacebookConnected = (config && config.onFacebookConnected) ? config.onFacebookConnected : null;

    // The person is logged into Facebook, but not your app.
    this.onFacebookNotAuthorized = (config && config.onFacebookNotAuthorized) ? config.onFacebookNotAuthorized : null;

    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    this.onFacebookNotLogged = (config && config.onFacebookNotLogged) ? config.onFacebookNotLogged : null;

    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            loc.onFacebookConnected(response.authResponse);
        } else if (response.status === 'not_authorized') {
            loc.onFacebookNotAuthorized();
        } else {
            loc.onFacebookNotLogged();
        }
    }

    this.refreshLoginStatus = function() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }
}

Gloobster.Facebook.Initialization = function (onInitializedCallback) {

    var loc = this;

    this.onInitialized = onInitializedCallback;

    this.sdkLoad = function (doc) {
        var scriptElementName = 'script';
        var scriptElementId = 'facebook-jssdk';
        var src = "//connect.facebook.net/en_US/sdk.js";

        var isSdkAlreadyLoaded = doc.getElementById(scriptElementId);
        if (isSdkAlreadyLoaded) return;

        //create SCRIPT element for SDK
        var js = doc.createElement(scriptElementName);
        js.id = scriptElementId;
        js.src = src;

        //add loaded script before all the previous scripts
        var fjs = doc.getElementsByTagName(scriptElementName)[0];
        fjs.parentNode.insertBefore(js, fjs);
    }

    this.asyncInit = function () {
        FB.init({
            appId: '1519189774979242',
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.2'
        });

        if (loc.onInitialized) {
            loc.onInitialized();
        }
    }
}