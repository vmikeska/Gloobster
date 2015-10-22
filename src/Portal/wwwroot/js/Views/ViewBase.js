var Views;
(function (Views) {
    (function (PageType) {
        PageType[PageType["HomePage"] = 0] = "HomePage";
        PageType[PageType["PinBoard"] = 1] = "PinBoard";
        PageType[PageType["TripList"] = 2] = "TripList";
        PageType[PageType["TwitterAuth"] = 3] = "TwitterAuth";
        PageType[PageType["Friends"] = 4] = "Friends";
    })(Views.PageType || (Views.PageType = {}));
    var PageType = Views.PageType;
    var ViewBase = (function () {
        function ViewBase() {
            this.cookieManager = new CookieManager();
            this.loginManager = new LoginManager();
            var isAlreadyLogged = this.loginManager.isAlreadyLogged();
            if (!isAlreadyLogged) {
                this.initializeGoogle();
                this.initializeFacebook();
                $("#loginSection").show();
            }
            else {
                console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);
                if (this.loginManager.cookieLogin.networkType === NetworkType.Facebook) {
                    this.initializeFacebook();
                }
            }
        }
        Object.defineProperty(ViewBase.prototype, "pageType", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        ViewBase.prototype.initializeGoogle = function () {
            var self = this;
            var btnGoogle = new GoogleButton();
            btnGoogle.successfulCallback = function (googleUser) {
                self.loginManager.googleUserCreator.registerOrLogin(googleUser);
            };
            var btnName = (this.pageType === PageType.HomePage) ? "googleLoginBtnHome" : "googleLoginBtn";
            btnGoogle.elementId = btnName;
            btnGoogle.initialize();
        };
        ViewBase.prototype.initializeFacebook = function () {
            var self = this;
            var fbInit = new FacebookInit();
            fbInit.onFacebookInitialized = function () {
                self.loginManager.facebookUserCreator.registerOrLogin();
            };
            fbInit.initialize();
        };
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("getting: " + endpoint);
            var request = new RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendGet();
        };
        ViewBase.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("posting: " + endpoint);
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