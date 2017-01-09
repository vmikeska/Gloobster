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
        WikiSearchCombo.prototype.getDisabledItem = function (text) {
            return "<li class=\"disabled\">" + text + "</li>";
        };
        WikiSearchCombo.prototype.showResults = function (places) {
            var _this = this;
            places = _.sortBy(places, function (p) { return p.rating; }).reverse();
            var $ul = this.$combo.find("ul");
            $ul.empty();
            $ul.show();
            var v = Views.ViewBase.currentView;
            var hasRated = (places.length > 0 && places[0].rating > 0);
            if (hasRated) {
                $ul.append(this.getDisabledItem(v.t("ArticlesRich", "jsWiki")));
            }
            var ratedFinished = false;
            places.forEach(function (item) {
                if (item.rating === 0 && !ratedFinished) {
                    $ul.append(_this.getDisabledItem(v.t("ArticlesHelpUs", "jsWiki")));
                    ratedFinished = true;
                }
                var $li = _this.getItemHtml(item);
                $ul.append($li);
            });
            if (this.selectionCallback) {
                $ul.find("a").click(function (e) {
                    e.preventDefault();
                    _this.selectionCallback($(e.target));
                });
            }
            this.loader(false);
        };
        WikiSearchCombo.prototype.getItemHtml = function (item) {
            var $stars = $("<div class=\"stars\"></div>");
            if (this.config && this.config.showRating) {
                for (var act = 1; act <= 10; act = act + 2) {
                    var actd_l = act / 2;
                    var actd_r = (act + 1) / 2;
                    var color_l = (actd_l <= item.rating) ? "active" : "inactive";
                    var color_r = (actd_r <= item.rating) ? "active" : "inactive";
                    var $star = $("\n\t\t\t\t\t\t\t\t<div class=\"star\" data-i=\"" + act + "\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"icon-star-left " + color_l + "\"></div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"icon-star-right " + color_r + "\"></div>\n\t\t\t\t\t\t\t\t</div>");
                    $stars.append($star);
                }
            }
            var $li = $("<li><a data-articleId=\"" + item.articleId + "\" href=\"/wiki/" + item.language + "/" + item.link + "\">" + item.title + "</a></li>");
            $li.append($stars);
            return $li;
        };
        return WikiSearchCombo;
    }());
    Views.WikiSearchCombo = WikiSearchCombo;
})(Views || (Views = {}));
//# sourceMappingURL=WikiSearchCombo.js.map