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
            this.regUserMenu();
            if (this.pageType !== PageType.HomePage) {
                this.loginButtonsManager = new Reg.LoginButtonsManager();
                this.loginButtonsManager.createPageDialog();
            }
        }
        Object.defineProperty(ViewBase.prototype, "pageType", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewBase.prototype, "fullReg", {
            get: function () {
                return this.cookieManager.getString(Constants.fullRegCookieName) === "true";
            },
            enumerable: true,
            configurable: true
        });
        ViewBase.prototype.regUserMenu = function () {
            var _this = this;
            $("#logoutUser").click(function (e) {
                _this.logout();
            });
        };
        ViewBase.prototype.hasSocNetwork = function (net) {
            var prms = ViewBase.nets.split(",");
            if (_.contains(prms, net.toString())) {
                return true;
            }
            return false;
        };
        ViewBase.prototype.logout = function () {
            this.cookieManager.removeCookie(Constants.tokenCookieName);
            window.location.href = "/";
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