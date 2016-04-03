var Reg;
(function (Reg) {
    var LoginButtonsManager = (function () {
        function LoginButtonsManager() {
        }
        LoginButtonsManager.prototype.initialize = function (fb, google, twitter) {
            var _this = this;
            var fbBtn = new FacebookButtonInit(fb);
            fbBtn.onBeforeExecute = function () { return _this.onBefore(); };
            fbBtn.onAfterExecute = function () { return _this.onAfter(); };
            var googleBtn = new GoogleButtonInit(google);
            googleBtn.onBeforeExecute = function () { return _this.onBefore(); };
            googleBtn.onAfterExecute = function () { return _this.onAfter(); };
            var twitterBtn = new TwitterButtonInit(twitter);
            twitterBtn.onBeforeExecute = function () { return _this.onBefore(); };
            twitterBtn.onAfterExecute = function () { return _this.onAfter(); };
            this.cookieSaver = new AuthCookieSaver();
            this.regEmailDialog();
        };
        LoginButtonsManager.prototype.onBefore = function () {
            this.$socDialog.hide();
        };
        LoginButtonsManager.prototype.onAfter = function () {
            var hint = new Common.HintDialog();
            hint.create("You are successfully connected!");
            $("#MenuRegister").parent().remove();
            this.getUserMenu(function (r) {
                $("#ddMenus").append(r);
            });
        };
        LoginButtonsManager.prototype.getUserMenu = function (callback) {
            var endpoint = "/home/component/_UserMenu";
            var request = new Common.RequestSender(endpoint, null, true);
            request.params = [];
            request.onSuccess = callback;
            request.sendGet();
        };
        LoginButtonsManager.prototype.createPageDialog = function () {
            var _this = this;
            if (!Views.ViewBase.nets) {
                this.$socDialog = $("#popup-joinSoc");
                this.$emailDialog = $("#popup-joinMail");
                this.$socDialog.show();
                this.initialize("fbBtnHome", "googleBtnHome", "twitterBtnHome");
                $("#emailJoin").click(function (e) {
                    _this.$socDialog.hide();
                    _this.$emailDialog.show();
                });
            }
        };
        LoginButtonsManager.prototype.regEmailDialog = function () {
            var _this = this;
            $("#emailReg").click(function (e) {
                e.preventDefault();
                _this.$emailDialog.hide();
                var data = {
                    mail: $("#email").val(),
                    password: $("#password").val()
                };
                Views.ViewBase.currentView.apiPost("MailUser", data, function (r) {
                    _this.cookieSaver.saveCookies(r);
                    _this.onAfter();
                });
            });
        };
        return LoginButtonsManager;
    })();
    Reg.LoginButtonsManager = LoginButtonsManager;
    var AuthCookieSaver = (function () {
        function AuthCookieSaver() {
            this.cookiesMgr = new Common.CookieManager();
        }
        AuthCookieSaver.prototype.saveCookies = function (res) {
            this.cookiesMgr.setString(Constants.tokenCookieName, res.Token);
            this.cookiesMgr.setString(Constants.nameCookieName, res.DisplayName);
            if (res.NetType === SocialNetworkType.Facebook) {
                Views.ViewBase.fbt = res.SocToken;
            }
            //todo: implement
            //this.cookiesMgr.setString(Constants.socNetsCookieName, );
            //todo: remove ?
            //this.cookiesMgr.setString(, res.UserId);
        };
        AuthCookieSaver.prototype.saveTwitterLogged = function () {
            this.cookiesMgr.setString(Constants.twitterLoggedCookieName, "true");
        };
        AuthCookieSaver.prototype.isTwitterLogged = function () {
            var str = this.cookiesMgr.getString(Constants.twitterLoggedCookieName);
            if (str) {
                return true;
            }
            return false;
        };
        return AuthCookieSaver;
    })();
    Reg.AuthCookieSaver = AuthCookieSaver;
    var TwitterButtonInit = (function () {
        function TwitterButtonInit(btn) {
            var _this = this;
            this.twInterval = null;
            this.cookiesSaver = new AuthCookieSaver();
            var $btn = $("#" + btn);
            $btn.click(function (e) {
                e.preventDefault();
                if (_this.onBeforeExecute) {
                    _this.onBeforeExecute();
                }
                _this.twitterAuthorize();
            });
        }
        TwitterButtonInit.prototype.twitterAuthorize = function () {
            var _this = this;
            this.twitterLoginWatch(function () {
                if (_this.onAfterExecute) {
                    _this.onAfterExecute();
                }
            });
            var url = '/TwitterUser/Authorize';
            var wnd = window.open(url, "Twitter authentication", "height=500px,width=400px");
        };
        TwitterButtonInit.prototype.twitterLoginWatch = function (callback) {
            var _this = this;
            this.twInterval = setInterval(function () {
                var isLogged = _this.cookiesSaver.isTwitterLogged();
                if (isLogged) {
                    clearInterval(_this.twInterval);
                    callback();
                }
            }, 500);
        };
        return TwitterButtonInit;
    })();
    Reg.TwitterButtonInit = TwitterButtonInit;
    var GoogleButtonInit = (function () {
        function GoogleButtonInit(btnId) {
            this.cookiesSaver = new AuthCookieSaver();
            this.initialize(btnId);
        }
        GoogleButtonInit.prototype.initialize = function (btnId) {
            var _this = this;
            var btnGoogle = new Reg.GoogleButton();
            btnGoogle.onBeforeClick = function () {
                if (_this.onBeforeExecute) {
                    _this.onBeforeExecute();
                }
            };
            btnGoogle.successfulCallback = function (googleUser) {
                var data = googleUser;
                Views.ViewBase.currentView.apiPost("GoogleUser", data, function (r) {
                    _this.cookiesSaver.saveCookies(r);
                    if (_this.onAfterExecute) {
                        _this.onAfterExecute();
                    }
                    //unload sdk ?
                });
            };
            btnGoogle.initialize(btnId);
        };
        return GoogleButtonInit;
    })();
    Reg.GoogleButtonInit = GoogleButtonInit;
    var FacebookButtonInit = (function () {
        function FacebookButtonInit(btnId) {
            this.cookiesSaver = new AuthCookieSaver();
            this.registerFacebookButton(btnId);
        }
        FacebookButtonInit.prototype.registerFacebookButton = function (btnId) {
            var _this = this;
            var $btn = $("#" + btnId);
            this.initializeFacebookSdk(function () {
                $btn.click(function (e) {
                    e.preventDefault();
                    if (_this.onBeforeExecute) {
                        _this.onBeforeExecute();
                    }
                    var auth = new Reg.FacebookAuth();
                    auth.onSuccessful = function (user) {
                        var data = user;
                        Views.ViewBase.currentView.apiPost("FacebookUser", data, function (r) {
                            _this.cookiesSaver.saveCookies(r);
                            if (_this.onAfterExecute) {
                                _this.onAfterExecute();
                            }
                            //unload sdk ?
                        });
                    };
                    auth.login();
                });
            });
        };
        FacebookButtonInit.prototype.initializeFacebookSdk = function (callback) {
            var fbInit = new Reg.FacebookInit();
            fbInit.onFacebookInitialized = function () {
                console.log("fb initialized");
                callback();
            };
            fbInit.initialize();
        };
        return FacebookButtonInit;
    })();
    Reg.FacebookButtonInit = FacebookButtonInit;
})(Reg || (Reg = {}));
//# sourceMappingURL=SocialButtons.js.map