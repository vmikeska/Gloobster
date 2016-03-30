var Reg;
(function (Reg) {
    var LoginButtonsManager = (function () {
        function LoginButtonsManager() {
        }
        LoginButtonsManager.prototype.initialize = function (fb, google, twitter) {
            var fbBtn = new FacebookButtonInit(fb);
            var googleBtn = new GoogleButtonInit(google);
            var twitterBtn = new TwitterButtonInit(twitter);
        };
        return LoginButtonsManager;
    })();
    Reg.LoginButtonsManager = LoginButtonsManager;
    var TwitterButtonInit = (function () {
        function TwitterButtonInit(btn) {
            var _this = this;
            this.twInterval = null;
            var $btn = $("#" + btn);
            $btn.click(function (e) {
                e.preventDefault();
                _this.twitterAuthorize();
            });
        }
        TwitterButtonInit.prototype.twitterAuthorize = function () {
            //this.twitterLoginWatch();
            var url = '/TwitterUser/Authorize';
            var wnd = window.open(url, "Twitter authentication", "height=500px,width=400px");
        };
        return TwitterButtonInit;
    })();
    Reg.TwitterButtonInit = TwitterButtonInit;
    var GoogleButtonInit = (function () {
        function GoogleButtonInit(btnId) {
            this.initialize(btnId);
        }
        GoogleButtonInit.prototype.initialize = function (btnId) {
            var btnGoogle = new Reg.GoogleButton();
            btnGoogle.successfulCallback = function (googleUser) {
                alert(JSON.stringify(googleUser));
            };
            btnGoogle.initialize(btnId);
        };
        return GoogleButtonInit;
    })();
    Reg.GoogleButtonInit = GoogleButtonInit;
    var FacebookButtonInit = (function () {
        function FacebookButtonInit(btnId) {
            this.registerFacebookButton(btnId);
        }
        FacebookButtonInit.prototype.registerFacebookButton = function (btnId) {
            var $btn = $("#" + btnId);
            this.initializeFacebookSdk(function () {
                $btn.click(function (e) {
                    e.preventDefault();
                    var auth = new Reg.FacebookAuth();
                    auth.onSuccessful = function (user) {
                        var data = user;
                        Views.ViewBase.currentView.apiPost("FacebookUser", data, function (r) {
                            alert(JSON.stringify(r));
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