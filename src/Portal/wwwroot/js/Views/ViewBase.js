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
            $(document).tooltip();
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
        ViewBase.prototype.t = function (key, module) {
            var modules = window["modules"];
            if (!modules) {
                return "NoModules";
            }
            var mod = _.find(modules, function (m) {
                return m.Name === module;
            });
            if (!mod) {
                return "NotFoundModule";
            }
            var text = _.find(mod.Texts, function (t) {
                return t.Name === key;
            });
            if (!text) {
                return "KeyNotFound";
            }
            return text.Text;
        };
        ViewBase.prototype.logout = function () {
            var auth = new Reg.AuthCookieSaver();
            auth.removeCookies();
            window.location.href = "/";
        };
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = "/api/" + endpointName;
            console.log("getting: " + endpoint);
            var request = new Common.RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert("error: " + endpointName); };
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
        ViewBase.prototype.makeRandomString = function (cnt) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        return ViewBase;
    }());
    Views.ViewBase = ViewBase;
})(Views || (Views = {}));
//# sourceMappingURL=ViewBase.js.map