var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HomePageView = (function (_super) {
    __extends(HomePageView, _super);
    function HomePageView() {
        _super.apply(this, arguments);
    }
    HomePageView.prototype.initialize = function () {
    };
    HomePageView.prototype.googleUserLogged = function (user) {
        _super.prototype.apiPost.call(this, "GoogleUser", user, function (response) {
            alert('response;');
        });
    };
    return HomePageView;
})(Views.ViewBase);
//# sourceMappingURL=HomePageView.js.map