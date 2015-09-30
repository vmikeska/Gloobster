var FacebookInit = (function () {
    function FacebookInit() {
        var _this = this;
        this.asyncInit = function () {
            FB.init({
                appId: '1519189774979242',
                cookie: true,
                xfbml: true,
                version: 'v2.2'
            });
            _this.onFacebookInitialized();
        };
    }
    FacebookInit.prototype.initialize = function () {
        window['fbAsyncInit'] = this.asyncInit;
        this.sdkLoad(document);
    };
    FacebookInit.prototype.sdkLoad = function (doc) {
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
    return FacebookInit;
})();
var Views;
(function (Views) {
    var ViewBase = (function () {
        function ViewBase() {
            var _this = this;
            this.statusChangeCallback = function (response) {
                if (response.status === 'connected') {
                    _this.onFacebookConnected(response.authResponse);
                }
                else if (response.status === 'not_authorized') {
                }
                else {
                }
            };
            this.initializeFacebook();
            this.googleInit = new GoogleInit();
        }
        ViewBase.prototype.initializeFacebook = function () {
            var _this = this;
            var fbInit = new FacebookInit();
            fbInit.onFacebookInitialized = function () {
                _this.onFacebookInitialized();
            };
            fbInit.initialize();
        };
        ViewBase.prototype.onFacebookInitialized = function () {
            //this happens when fb is initialized, it checks if user is already paired with this app		
            FB.getLoginStatus(this.statusChangeCallback);
        };
        ViewBase.prototype.onFacebookButtonPressed = function () {
            //this happends when app is authorized over the button
            FB.getLoginStatus(this.statusChangeCallback);
        };
        ViewBase.prototype.onFacebookConnected = function (authResponse) {
            var facebookUser = new CreateUserFacebook();
            facebookUser.handleRoughResponse(authResponse);
        };
        //		googleInit.onSuccess = function onSuccess(googleUser) {
        //			var dbgStr = 'Logged in as: ' + googleUser.getBasicProfile().getName();
        //			console.log(dbgStr);
        //			alert(dbgStr);
        //			currentView.googleUserLogged(googleUser);
        //		}
        //		function renderButton() {
        //googleInit.renderButton();
        //}
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            var request = new RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendGet();
        };
        ViewBase.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            var request = new RequestSender(endpoint, data, true);
            request.serializeData();
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sentPost();
        };
        return ViewBase;
    })();
    Views.ViewBase = ViewBase;
})(Views || (Views = {}));
//# sourceMappingURL=ViewBase.js.map