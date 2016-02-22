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
                if (this.onLogin) {
                    this.onLogin();
                }
            }
            this.regUserMenu();
        }
        Object.defineProperty(ViewBase.prototype, "pageType", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        ViewBase.prototype.regUserMenu = function () {
            var _this = this;
            $("#userMenu input").change(function (e) {
                var value = $(e.target).val();
                if (value === "logout") {
                    _this.loginManager.logout();
                }
                if (value === "settings") {
                    window.location.href = "/PortalUser/Settings";
                }
                if (value === "notifications") {
                    window.location.href = "/PortalUser/Notifications";
                }
                if (value === "friends") {
                    window.location.href = "/Friends/List";
                }
            });
        };
        ViewBase.prototype.hasSocNetwork = function (net) {
            var netTypesStr = this.cookieManager.getString(Constants.networkTypes);
            if (!netTypesStr) {
                return false;
            }
            var prms = netTypesStr.split(",");
            if (net === Reg.NetworkType.Facebook && _.contains(prms, "F")) {
                return true;
            }
            if (net === Reg.NetworkType.Google && _.contains(prms, "G")) {
                return true;
            }
            if (net === Reg.NetworkType.Twitter && _.contains(prms, "T")) {
                return true;
            }
            return false;
        };
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
                console.log("fb initialized");
                self.loginManager.facebookUserCreator.registerOrLogin();
            };
            fbInit.initialize();
        };
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = "/api/" + endpointName;
            console.log("getting: " + endpoint);
            var request = new Common.RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert("error"); };
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