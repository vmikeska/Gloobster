var Common;
(function (Common) {
    var GNOnlineSearchBox = (function () {
        function GNOnlineSearchBox(id) {
            var _this = this;
            this.$combo = $("#" + id);
            var input = this.$combo.find(".inputed");
            var d = new Common.DelayedCallback(input);
            d.callback = function (query) {
                _this.search(query);
            };
        }
        GNOnlineSearchBox.prototype.search = function (query) {
            var _this = this;
            var data = [["q", query]];
            Views.ViewBase.currentView.apiGet("GnOnline", data, function (cities) {
                _this.fillItems(cities);
            });
        };
        GNOnlineSearchBox.prototype.fillItems = function (cities) {
            var _this = this;
            this.$combo.find("li").remove();
            cities.forEach(function (city) {
                var ch = _this.getCityHtml(city);
                _this.$combo.find("ul").append(ch);
            });
            this.registerEvents();
        };
        GNOnlineSearchBox.prototype.registerEvents = function () {
            var _this = this;
            this.$combo.find("li").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                if (_this.onSelected) {
                    _this.onSelected($target.data("city"));
                }
                _this.$combo.find("li").remove();
            });
        };
        GNOnlineSearchBox.prototype.getCityHtml = function (city) {
            var $li = $("<li>" + city.name + ", " + city.countryName + "</li>");
            $li.data("city", city);
            return $li;
        };
        return GNOnlineSearchBox;
    })();
    Common.GNOnlineSearchBox = GNOnlineSearchBox;
})(Common || (Common = {}));
//# sourceMappingURL=GNOnlineSearchBox.js.map