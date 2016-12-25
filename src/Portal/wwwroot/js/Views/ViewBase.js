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
            this.loginButtonsManager = new Reg.LoginButtonsManager();
            this.loginButtonsManager.createPageDialog();
            if ($(document).tooltip) {
                $(document).tooltip();
            }
            this.initDemoFnc();
            this.initTitleFnc();
            this.infoCookie();
        }
        ViewBase.v = function () {
            return this.currentView;
        };
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
        ViewBase.prototype.infoCookie = function () {
            var _this = this;
            $("#confirmCookies").click(function (e) {
                e.preventDefault();
                _this.cookieManager.setString("CookiesConfirmed", "a");
                $(".cookies-info").remove();
            });
        };
        ViewBase.prototype.initTitleFnc = function () {
            var _this = this;
            var $ibAll = $(".info-block-bck");
            var $btn = $ibAll.find(".showHide");
            $btn.click(function (e) {
                e.preventDefault();
                var id = $ibAll.attr("id");
                var $ib = $ibAll.find(".info-block");
                var visible = $ib.css("display") === "block";
                $btn.html(visible ? $btn.data("ts") : $btn.data("th"));
                if (!visible) {
                    $ibAll.removeClass("collapsed");
                }
                var data = _this.cookieManager.getJson("InfoBlocks");
                if (data) {
                    var thisInfo = _.find(data.infos, function (info) {
                        return info.id === id;
                    });
                    if (thisInfo) {
                        thisInfo.visible = !visible;
                    }
                    else {
                        data.infos.push({ id: id, visible: false });
                    }
                }
                else {
                    data = { infos: [{ id: id, visible: false }] };
                }
                _this.cookieManager.setJson("InfoBlocks", data);
                $ib.slideToggle(function () {
                    if (visible) {
                        $ibAll.addClass("collapsed");
                    }
                });
            });
        };
        ViewBase.prototype.initDemoFnc = function () {
            var _this = this;
            $("#switchVersion").click(function (e) {
                var ds = _this.cookieManager.getString("Demo");
                var newVal = ds === "on" ? "off" : "on";
                _this.cookieManager.setString("Demo", newVal);
                location.reload();
            });
            var ds = this.cookieManager.getString("Demo");
            var urlParam = this.getUrlParam("demo");
            if (urlParam && !ds) {
                this.cookieManager.setString("Demo", "on");
                location.reload();
            }
            if (ds) {
                $(".ver-switch").show();
                var href = $("#switchVersion");
                if (ds === "on") {
                    href.addClass("icon-toggle-on");
                }
                else {
                    href.addClass("icon-toggle-off");
                }
            }
        };
        ViewBase.prototype.getUrlParam = function (name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
            var results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return "";
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        ViewBase.prototype.regUserMenu = function () {
            var _this = this;
            $("#logoutUser").click(function (e) {
                _this.logout();
            });
            $("#admin-btn").click(function (e) {
                $(".admin-menu-all").toggle();
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
            var $t = $("#" + name);
            if ($t.length === 0) {
                console.log("Template '" + name + " not found");
            }
            var source = $t.html();
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