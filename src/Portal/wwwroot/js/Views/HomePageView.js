var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var HomePageView = (function (_super) {
        __extends(HomePageView, _super);
        //private cookieSaver: Reg.AuthCookieSaver;
        function HomePageView() {
            //this.cookieSaver = new Reg.AuthCookieSaver();
            _super.call(this);
            this.initialize("fbBtnHome", "googleBtnHome", "twitterBtnHome");
        }
        HomePageView.prototype.initialize = function (fb, google, twitter) {
            var _this = this;
            var fbBtn = new Reg.FacebookButtonInit(fb);
            fbBtn.onBeforeExecute = function () { return _this.onBefore(); };
            fbBtn.onAfterExecute = function () { return _this.onAfter(); };
            var googleBtn = new Reg.GoogleButtonInit(google);
            googleBtn.onBeforeExecute = function () { return _this.onBefore(); };
            googleBtn.onAfterExecute = function () { return _this.onAfter(); };
            var twitterBtn = new Reg.TwitterButtonInit(twitter);
            twitterBtn.onBeforeExecute = function () { return _this.onBefore(); };
            twitterBtn.onAfterExecute = function () { return _this.onAfter(); };
        };
        HomePageView.prototype.onBefore = function () {
            $(".logins").hide();
        };
        HomePageView.prototype.onAfter = function () {
            window.location.href = Constants.firstRedirectUrl;
        };
        Object.defineProperty(HomePageView.prototype, "pageType", {
            get: function () { return Views.PageType.HomePage; },
            enumerable: true,
            configurable: true
        });
        return HomePageView;
    })(Views.ViewBase);
    Views.HomePageView = HomePageView;
})(Views || (Views = {}));
//# sourceMappingURL=HomePageView.js.map