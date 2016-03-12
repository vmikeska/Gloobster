var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiHomeView = (function (_super) {
        __extends(WikiHomeView, _super);
        function WikiHomeView() {
            _super.call(this);
            this.combo = new WikiSearchCombo("SearchCombo");
        }
        return WikiHomeView;
    })(Views.ViewBase);
    Views.WikiHomeView = WikiHomeView;
    var WikiSearchCombo = (function () {
        function WikiSearchCombo(id) {
            var _this = this;
            this.$combo = $("#" + id);
            this.$input = this.$combo.find("input");
            this.delayedCallback = new Common.DelayedCallback(this.$input);
            this.delayedCallback.callback = function (query) { return _this.search(query); };
        }
        WikiSearchCombo.prototype.search = function (query) {
            var _this = this;
            var params = [["query", query]];
            Views.ViewBase.currentView.apiGet("WikiSearch", params, function (places) { _this.showResults(places); });
        };
        WikiSearchCombo.prototype.showResults = function (places) {
            var _this = this;
            this.$combo.find("ul").show();
            var htmlContent = "";
            places.forEach(function (item) {
                htmlContent += _this.getItemHtml(item);
            });
            this.$combo.find("ul").html(htmlContent);
        };
        WikiSearchCombo.prototype.getItemHtml = function (item) {
            return "<li><a href=\"/wiki/" + item.language + "/" + item.link + "\">" + item.title + "</a></li>";
        };
        return WikiSearchCombo;
    })();
    Views.WikiSearchCombo = WikiSearchCombo;
})(Views || (Views = {}));
//# sourceMappingURL=WikiHomeView.js.map