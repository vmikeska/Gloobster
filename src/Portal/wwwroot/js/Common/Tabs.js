var Common;
(function (Common) {
    var Tabs = (function () {
        function Tabs($cont, tabGroup) {
            this.isFirst = true;
            this.initCall = true;
            this.btnClass = "btn";
            this.btnContClass = "btn-cont";
            this.contClass = "tab-menu";
            this.tabs = [];
            this.$cont = $cont;
            this.tabGroup = tabGroup;
        }
        Tabs.prototype.addTab = function (id, text, callback) {
            if (callback === void 0) { callback = null; }
            this.tabs.push({ id: id, text: text, callback: callback });
        };
        Tabs.prototype.create = function () {
            var _this = this;
            this.tabs.forEach(function (t) {
                var $t = _this.genTab(t);
                _this.$cont.append($t);
            });
            this.$cont.addClass(this.contClass);
            if (this.initCall) {
                this.tabs[0].callback();
            }
            this.activeTabId = this.tabs[0].id;
        };
        Tabs.prototype.genTab = function (t) {
            var _this = this;
            var $t = $("<div class=\"" + this.btnContClass + "\"><div id=\"" + t.id + "\" class=\"" + this.btnClass + " " + this.tabGroup + "\">" + t.text + "</div></div>");
            var $btn = $t.find(".btn");
            if (this.isFirst) {
                $btn.addClass("act");
                this.isFirst = false;
            }
            $btn.click(function (e) {
                e.preventDefault();
                if ($btn.hasClass("act")) {
                    return;
                }
                if (_this.onBeforeSwitch) {
                    _this.onBeforeSwitch();
                }
                var $target = $(e.target);
                $("." + _this.tabGroup).removeClass("act");
                $target.addClass("act");
                _this.activeTabId = $target.attr("id");
                if (t.callback) {
                    t.callback(t.id);
                }
                if (_this.onChange) {
                    _this.onChange(t.id);
                }
            });
            return $t;
        };
        return Tabs;
    }());
    Common.Tabs = Tabs;
})(Common || (Common = {}));
//# sourceMappingURL=Tabs.js.map