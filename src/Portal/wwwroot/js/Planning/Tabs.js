var Planning;
(function (Planning) {
    var Tabs = (function () {
        function Tabs($cont, tabGroup, height) {
            this.isFirst = true;
            this.initCall = true;
            this.tabs = [];
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
            if (this.initCall) {
                this.tabs[0].callback();
            }
            this.activeTabId = this.tabs[0].id;
        };
        Tabs.prototype.genTab = function (t) {
            var _this = this;
            var width = (100 / this.tabs.length);
            var $t = $("<div id=\"" + t.id + "\" class=\"myTab " + this.tabGroup + "\" style=\"width: calc(" + width + "% - 2px); height: " + this.height + "px\">" + t.text + "</div>");
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
                if (_this.onChange) {
                    _this.onChange();
                }
            });
            return $t;
        };
        return Tabs;
    }());
    Planning.Tabs = Tabs;
})(Planning || (Planning = {}));
//# sourceMappingURL=Tabs.js.map