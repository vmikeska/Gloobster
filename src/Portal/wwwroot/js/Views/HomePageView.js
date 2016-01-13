var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var HomePageView = (function (_super) {
        __extends(HomePageView, _super);
        function HomePageView() {
            var _this = this;
            _super.call(this);
            this.twInterval = null;
            $("#twitterLoginBtnHome").click(function (e) {
                e.preventDefault();
                _this.twitterAuthorize();
            });
            $("#facebookLoginBtnHome").click(function (e) {
                e.preventDefault();
                _this.loginManager.facebookUserCreator.registerOrLogin();
            });
        }
        Object.defineProperty(HomePageView.prototype, "pageType", {
            get: function () { return Views.PageType.HomePage; },
            enumerable: true,
            configurable: true
        });
        HomePageView.prototype.registerNormal = function (mail, password) {
            var data = { "mail": mail, "password": password };
            _super.prototype.apiPost.call(this, "User", data, function (response) {
                alert("user registred");
            });
        };
        HomePageView.prototype.twitterAuthorize = function () {
            this.twitterLoginWatch();
            var url = '/TwitterUser/MailStep';
            var wnd = window.open(url, "Twitter authentication", "height=500px,width=400px");
        };
        HomePageView.prototype.twitterLoginWatch = function () {
            var _this = this;
            this.twInterval = setInterval(function () {
                var cookieVal = _this.cookieManager.getJson(Constants.cookieName);
                if (cookieVal) {
                    clearInterval(_this.twInterval);
                    window.location.href = Constants.firstRedirectUrl;
                }
                console.log("checking: " + JSON.stringify(cookieVal));
            }, 500);
        };
        return HomePageView;
    })(Views.ViewBase);
    Views.HomePageView = HomePageView;
})(Views || (Views = {}));
//# sourceMappingURL=HomePageView.js.map