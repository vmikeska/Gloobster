var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TwitterAuthView = (function (_super) {
        __extends(TwitterAuthView, _super);
        function TwitterAuthView() {
            _super.call(this);
            this.twInterval = null;
        }
        Object.defineProperty(TwitterAuthView.prototype, "pageType", {
            get: function () { return Views.PageType.TwitterAuth; },
            enumerable: true,
            configurable: true
        });
        TwitterAuthView.prototype.onResponse = function (resp) {
            var data = resp;
            this.apiPost("TwitterUser", resp, function (r) {
                alert(JSON.stringify(r));
                //todo: save auth cookie
                //todo: close page 
            });
            //this.twitterLoginWatch();
        };
        return TwitterAuthView;
    })(Views.ViewBase);
    Views.TwitterAuthView = TwitterAuthView;
})(Views || (Views = {}));
//# sourceMappingURL=TwitterAuthView.js.map