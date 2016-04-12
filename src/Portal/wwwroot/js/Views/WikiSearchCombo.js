var Views;
(function (Views) {
    var WikiSearchCombo = (function () {
        function WikiSearchCombo() {
        }
        WikiSearchCombo.prototype.initId = function (id, config) {
            if (config === void 0) { config = null; }
            this.config = config;
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
            this.delayedCallback.callback = function (query) {
                if (query) {
                    _this.loader(true);
                }
                _this.search(query);
            };
        };
        WikiSearchCombo.prototype.loader = function (state) {
            if (state) {
                this.$combo.find(".loader").show();
            }
            else {
                this.$combo.find(".loader").hide();
            }
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
            this.loader(false);
        };
        WikiSearchCombo.prototype.getItemHtml = function (item) {
            var ratingPercents = Math.round(item.rating * 20);
            var rating = "";
            if (this.config && this.config.showRating) {
                rating = "&#9;&#9;<span class=\"rating pct" + ratingPercents + " bottom right\"> </span>";
            }
            return "<li><span><a data-articleId=\"" + item.articleId + "\" href=\"/wiki/" + item.language + "/" + item.link + "\">" + item.title + "</a>  " + rating + "</span></li>";
        };
        return WikiSearchCombo;
    })();
    Views.WikiSearchCombo = WikiSearchCombo;
})(Views || (Views = {}));
//# sourceMappingURL=WikiSearchCombo.js.map