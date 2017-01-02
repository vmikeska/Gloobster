var Common;
(function (Common) {
    var Tabs = (function () {
        function Tabs($cont, tabGroup) {
            this.isFirst = true;
            this.initCall = true;
            this.btnClass = "btn";
            this.btnContClass = "btn-cont";
            this.contClass = "tab-menu";
            this.actClass = "act";
            this.tabs = [];
            this.$cont = $cont;
            this.tabGroup = tabGroup;
        }
        Tabs.prototype.addTab = function (id, text, callback) {
            if (callback === void 0) { callback = null; }
            this.tabs.push({ id: id, text: text, callback: callback });
        };
        Tabs.prototype.addTabConf = function (config, callback) {
            if (callback === void 0) { callback = null; }
            var cfg = $.extend(config, { callback: callback });
            this.tabs.push(cfg);
        };
        Tabs.prototype.create = function () {
            var _this = this;
            this.tabs.forEach(function (t) {
                var $t = _this.genTab(t);
                if (t.cls) {
                    $t.addClass(t.cls);
                }
                _this.$cont.append($t);
            });
            this.$cont.addClass(this.contClass);
            if (this.initCall) {
                this.tabs[0].callback();
            }
            this.activeTabId = this.tabs[0].id;
        };
        Tabs.prototype.activateTab = function ($btn) {
            this.deactivate();
            this.activate($btn);
        };
        Tabs.prototype.genTab = function (t) {
            var _this = this;
            var $t = $("<div class=\"" + this.btnContClass + "\"><div id=\"" + t.id + "\" class=\"" + this.btnClass + " " + this.tabGroup + "\">" + t.text + "</div></div>");
            var $btn = $t.find(".btn");
            if (this.isFirst) {
                $btn.addClass(this.actClass);
                this.isFirst = false;
            }
            $btn.click(function (e) {
                e.preventDefault();
                if ($btn.hasClass(_this.actClass)) {
                    return;
                }
                if (_this.onBeforeSwitch) {
                    _this.onBeforeSwitch();
                }
                var $target = $(e.target);
                _this.deactivate();
                _this.activate($target);
                if (t.callback) {
                    t.callback(t.id);
                }
                if (_this.onChange) {
                    _this.onChange(t.id);
                }
            });
            return $t;
        };
        Tabs.prototype.activate = function ($btn) {
            $btn.addClass(this.actClass);
            this.activeTabId = $btn.attr("id");
        };
        Tabs.prototype.deactivate = function () {
            $("." + this.tabGroup).removeClass(this.actClass);
        };
        return Tabs;
    }());
    Common.Tabs = Tabs;
})(Common || (Common = {}));
//# sourceMappingURL=Tabs.js.map