var Views;
(function (Views) {
    var WikiSearchCombo = (function () {
        function WikiSearchCombo() {
        }
        WikiSearchCombo.prototype.initId = function (id) {
            this.$combo = $("#" + id);
            this.init();
        };
        WikiSearchCombo.prototype.initElement = function ($combo) {
            this.$combo = $combo;
            this.init();
        };
        WikiSearchCombo.prototype.init = function () {
            var _this = this;
            this.$input = this.$combo.find("input");
            this.delayedCallback = new Common.DelayedCallback(this.$input);
            this.delayedCallback.callback = function (query) { return _this.search(query); };
        };
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
            var $ul = this.$combo.find("ul");
            $ul.html(htmlContent);
            if (this.selectionCallback) {
                $ul.find("a").click(function (e) {
                    e.preventDefault();
                    _this.selectionCallback($(e.target));
                });
            }
        };
        WikiSearchCombo.prototype.getItemHtml = function (item) {
            return "<li><a data-articleId=\"" + item.articleId + "\" href=\"/wiki/" + item.language + "/" + item.link + "\">" + item.title + "</a></li>";
        };
        return WikiSearchCombo;
    })();
    Views.WikiSearchCombo = WikiSearchCombo;
})(Views || (Views = {}));
//# sourceMappingURL=WikiSearchCombo.js.map