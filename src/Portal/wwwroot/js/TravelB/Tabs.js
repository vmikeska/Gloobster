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
            });
            return $t;
        };
        return Tabs;
    }());
    TravelB.Tabs = Tabs;
    var MenuTabs = (function () {
        function MenuTabs($cont) {
            this.activeCls = "active";
            this.tabs = [];
            this.isFirst = true;
            this.$cont = $cont;
        }
        MenuTabs.prototype.addTab = function (config, callback) {
            this.tabs.push({ id: config.id, text: config.text, customClass: config.customClass, callback: callback });
        };
        MenuTabs.prototype.create = function (btnTemplate) {
            var _this = this;
            this.btnTemplate = btnTemplate;
            this.tabs.forEach(function (t) {
                var $t = _this.genTab(t);
                _this.$cont.append($t);
            });
            this.tabs[0].callback();
            this.activeTabId = this.tabs[0].id;
        };
        MenuTabs.prototype.genTab = function (t) {
            var _this = this;
            var $t = $(this.btnTemplate);
            $t.html(t.text);
            $t.prepend("<span class=\"" + t.customClass + "\"></span>");
            $t.attr("id", t.id);
            if (this.isFirst) {
                $t.addClass(this.activeCls);
                this.isFirst = false;
            }
            $t.click(function (e) {
                e.preventDefault();
                if ($t.hasClass(_this.activeCls)) {
                    return;
                }
                if (_this.onBeforeSwitch) {
                    _this.onBeforeSwitch();
                }
                var $target = $(e.target);
                _this.$cont.children().removeClass(_this.activeCls);
                $target.addClass(_this.activeCls);
                _this.activeTabId = $target.attr("id");
                t.callback(t.id);
            });
            return $t;
        };
        return MenuTabs;
    }());
    TravelB.MenuTabs = MenuTabs;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=Tabs.js.map