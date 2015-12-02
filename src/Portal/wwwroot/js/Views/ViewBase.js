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
            ViewBase.currentView = this;
            this.cookieManager = new Common.CookieManager();
            this.loginManager = new Reg.LoginManager();
            var isAlreadyLogged = this.loginManager.isAlreadyLogged();
            if (!isAlreadyLogged) {
                this.initializeGoogle();
                this.initializeFacebook();
                $("#loginSection").show();
            }
            else {
                console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);
                if (this.loginManager.cookieLogin.networkType === Reg.NetworkType.Facebook) {
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
            var btnGoogle = new Reg.GoogleButton();
            btnGoogle.successfulCallback = function (googleUser) {
                self.loginManager.googleUserCreator.registerOrLogin(googleUser);
            };
            var btnName = (this.pageType === PageType.HomePage) ? "googleLoginBtnHome" : "googleLoginBtn";
            btnGoogle.elementId = btnName;
            btnGoogle.initialize();
        };
        ViewBase.prototype.initializeFacebook = function () {
            var self = this;
            var fbInit = new Reg.FacebookInit();
            fbInit.onFacebookInitialized = function () {
                self.loginManager.facebookUserCreator.registerOrLogin();
            };
            fbInit.initialize();
        };
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("getting: " + endpoint);
            var request = new Common.RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendGet();
        };
        ViewBase.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("posting: " + endpoint);
            var request = new Common.RequestSender(endpoint, data, true);
            request.serializeData();
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendPost();
        };
        ViewBase.prototype.apiPut = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("putting: " + endpoint);
            var request = new Common.RequestSender(endpoint, data, true);
            request.serializeData();
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendPut();
        };
        ViewBase.prototype.apiDelete = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("deleting: " + endpoint);
            var request = new Common.RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendDelete();
        };
        ViewBase.prototype.registerTemplate = function (name) {
            var source = $("#" + name).html();
            return Handlebars.compile(source);
        };
        return ViewBase;
    })();
    Views.ViewBase = ViewBase;
})(Views || (Views = {}));
//# sourceMappingURL=ViewBase.js.map