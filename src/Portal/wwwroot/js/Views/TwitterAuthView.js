var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TwitterAuthView = (function (_super) {
    __extends(TwitterAuthView, _super);
    function TwitterAuthView() {
        _super.call(this);
    }
    Object.defineProperty(TwitterAuthView.prototype, "pageType", {
        get: function () { return Views.PageType.TwitterAuth; },
        enumerable: true,
        configurable: true
    });
    return TwitterAuthView;
})(Views.ViewBase);
//# sourceMappingURL=TwitterAuthView.js.map