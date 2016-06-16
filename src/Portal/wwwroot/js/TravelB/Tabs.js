var TravelB;
(function (TravelB) {
    var Tabs = (function () {
        function Tabs($cont, tabGroup, height) {
            this.tabs = [];
            this.isFirst = true;
            this.$cont = $cont;
            this.tabGroup = tabGroup;
            this.height = height;
        }
        Tabs.prototype.addTab = function (id, text, callback) {
            this.tabs.push({ id: id, text: text, callback: callback });
        };
        Tabs.prototype.create = function () {
            var _this = this;
            this.tabs.forEach(function (t) {
                var $t = _this.genTab(t);
                _this.$cont.append($t);
            });
            this.tabs[0].callback();
            this.activeTabId = this.tabs[0].id;
        };
        Tabs.prototype.genTab = function (t) {
            var _this = this;
            var width = (100 / this.tabs.length) - 1;
            var $t = $("<div class=\"myTab " + this.tabGroup + "\" style=\"width: " + width + "%; height: " + this.height + "px\">" + t.text + "</div>");
            if (this.isFirst) {
                $t.addClass("act");
                this.isFirst = false;
            }
            $t.click(function (e) {
                e.preventDefault();
                if ($t.hasClass("act")) {
                    return;
                }
                if (_this.onBeforeSwitch) {
                    _this.onBeforeSwitch();
                }
                var $target = $(e.target);
                $("." + _this.tabGroup).removeClass("act");
                $target.addClass("act");
                _this.activeTabId = $target.attr("id");
                t.callback(t.id);
            });
            return $t;
        };
        return Tabs;
    }());
    TravelB.Tabs = Tabs;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=Tabs.js.map