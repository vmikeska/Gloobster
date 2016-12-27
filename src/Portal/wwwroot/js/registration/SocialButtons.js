var Reg;
(function (Reg) {
    var LoginButtonsManager = (function () {
        function LoginButtonsManager() {
        }
        LoginButtonsManager.prototype.initialize = function (fb, google, twitter) {
            var _this = this;
            var fbBtn = new FacebookButtonInit(fb);
            fbBtn.onBeforeExecute = function () { return _this.onBefore(SocialNetworkType.Facebook); };
            fbBtn.onAfterExecute = function () { return _this.onAfter(SocialNetworkType.Facebook); };
            var googleBtn = new GoogleButtonInit(google);
            googleBtn.onBeforeExecute = function () { return _this.onBefore(SocialNetworkType.Google); };
            googleBtn.onAfterExecute = function () { return _this.onAfter(SocialNetworkType.Google); };
            var twitterBtn = new TwitterButtonInit(twitter);
            twitterBtn.onBeforeExecute = function () { return _this.onBefore(SocialNetworkType.Twitter); };
            twitterBtn.onAfterExecute = function () { return _this.onAfter(SocialNetworkType.Twitter); };
            this.cookieSaver = new AuthCookieSaver();
            this.regEmailDialog();
        };
        LoginButtonsManager.prototype.onBefore = function (net) {
            this.$socDialog.hide();
        };
        LoginButtonsManager.prototype.onAfter = function (net) {
            var hint = new Common.HintDialog();
            hint.create("You are successfully connected!");
            $(".login-all").remove();
            Views.ViewBase.fullRegistration = true;
            if (this.onAfterCustom) {
                this.onAfterCustom(net);
            }
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
                this.$socDialog = $("#socDlg");
                this.$emailDialog = $("#emailDlg");
                this.$socDialog.show();
                this.initialize("fbBtnReg", "googleBtnReg", "twitterBtnReg");
                $(".login-all").find(".close").click(function (e) {
                    e.preventDefault();
                    var $act = $(e.target).closest(".login-all");
                    $act.hide();
                    if ($act.attr("id") === "emailDlg") {
                        _this.$socDialog.show();
                    }
                });
                $("#emailBtn").click(function (e) {
                    _this.$socDialog.hide();
                    _this.$emailDialog.show();
                });
                $("#emailCancel").click(function (e) {
                    _this.$emailDialog.hide();
                    _this.$socDialog.show();
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
                    _this.onAfter(SocialNetworkType.Base);
                });
            });
        };
        return LoginButtonsManager;
    }());
    Reg.LoginButtonsManager = LoginButtonsManager;
    var LoginResponseValidator = (function () {
        function LoginResponseValidator() {
        }
        LoginResponseValidator.prototype.validate = function (res) {
            var v = Views.ViewBase.currentView;
            var id = new Common.InfoDialog();
            if (!res) {
                id.create(v.t("UnsuccessLogin", "jsLayout"), v.t("UnsuccessLoginBody", "jsLayout"));
                return false;
            }
            if (res.AccountAlreadyInUse) {
                id.create(v.t("CannotPair", "jsLayout"), v.t("CannotPairBody", "jsLayout"));
                return false;
            }
            return true;
        };
        return LoginResponseValidator;
    }());
    Reg.LoginResponseValidator = LoginResponseValidator;
    var AuthCookieSaver = (function () {
        function AuthCookieSaver() {
            this.cookiesMgr = new Common.CookieManager();
        }
        AuthCookieSaver.prototype.saveCookies = function (res) {
            this.cookiesMgr.setString(Constants.tokenCookieName, res.Token);
            this.cookiesMgr.setString(Constants.nameCookieName, res.DisplayName);
            this.cookiesMgr.setString(Constants.fullRegCookieName, res.FullRegistration);
            if (res.NetType === SocialNetworkType.Facebook) {
                Views.ViewBase.fbt = res.SocToken;
            }
        };
        AuthCookieSaver.prototype.removeCookies = function () {
            this.cookiesMgr.removeCookie(Constants.tokenCookieName);
            this.cookiesMgr.removeCookie(Constants.nameCookieName);
            this.cookiesMgr.removeCookie(Constants.fullRegCookieName);
            this.cookiesMgr.removeCookie(Constants.twitterLoggedCookieName);
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
    }());
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
    }());
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
                    var lrv = new LoginResponseValidator();
                    var resValid = lrv.validate(r);
                    if (!resValid) {
                        return;
                    }
                    _this.cookiesSaver.saveCookies(r);
                    if (_this.onAfterExecute) {
                        _this.onAfterExecute();
                    }
                });
            };
            btnGoogle.initialize(btnId);
        };
        return GoogleButtonInit;
    }());
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
                            var lrv = new LoginResponseValidator();
                            var resValid = lrv.validate(r);
                            if (!resValid) {
                                return;
                            }
                            _this.cookiesSaver.saveCookies(r);
                            if (_this.onAfterExecute) {
                                _this.onAfterExecute();
                            }
                        });
                    };
                    auth.login();
                });
            });
        };
        FacebookButtonInit.prototype.initializeFacebookSdk = function (callback) {
            var fbInit = new Reg.FacebookInit();
            fbInit.initialize(callback);
        };
        return FacebookButtonInit;
    }());
    Reg.FacebookButtonInit = FacebookButtonInit;
})(Reg || (Reg = {}));
//# sourceMappingURL=SocialButtons.js.map