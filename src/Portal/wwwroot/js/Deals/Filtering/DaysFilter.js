var Planning;
(function (Planning) {
    var DaysFilter = (function () {
        function DaysFilter($cbCont, $filterCont) {
            this.enabled = false;
            this.focusTimeoutId = null;
            this.$cbCont = $cbCont;
            this.$filterCont = $filterCont;
        }
        DaysFilter.prototype.init = function (useDaysFilter) {
            this.initCb(useDaysFilter);
            this.initSelect();
        };
        DaysFilter.prototype.getActItems = function () {
            var acts = this.$filterCont.find(".act").toArray();
            var o = _.map(acts, function (a) { return parseInt($(a).data("i")); });
            var from = 6;
            if (_.contains(o, 5)) {
                from = 5;
            }
            if (_.contains(o, 4)) {
                from = 4;
            }
            var to = 6;
            if (_.contains(o, 7)) {
                to = 7;
            }
            if (_.contains(o, 1)) {
                to = 1;
            }
            return { from: from, to: to };
        };
        DaysFilter.prototype.getState = function () {
            var days = null;
            if (this.cbUse.isChecked()) {
                days = this.getActItems();
            }
            return days;
        };
        DaysFilter.prototype.initCb = function (useDaysFilter) {
            var _this = this;
            this.cbUse = new Common.CustomCheckbox(this.$cbCont, useDaysFilter);
            this.cbUse.onChange = function () {
                var state = _this.cbUse.isChecked();
                _this.setEnabled(state);
                _this.change();
            };
            this.setEnabled(useDaysFilter);
        };
        DaysFilter.prototype.setEnabled = function (state) {
            this.enabled = state;
            var $c = this.$filterCont;
            if (state) {
                $c.addClass("enabled");
                $c.removeClass("disabled");
            }
            else {
                $c.removeClass("enabled");
                $c.addClass("disabled");
            }
        };
        DaysFilter.prototype.initSelect = function () {
            var _this = this;
            var v = Views.ViewBase.currentView;
            var items = [
                { ni: 4, name: v.t("SelDayThu", "jsDeals") },
                { ni: 5, name: v.t("SelDayFri", "jsDeals") },
                { ni: 6, name: v.t("SelDaySat", "jsDeals"), c: "perm-sel" },
                { ni: 7, name: v.t("SelDaySun", "jsDeals") },
                { ni: 1, name: v.t("SelDayMon", "jsDeals") }
            ];
            var lg = Common.ListGenerator.init(this.$filterCont.find(".ftbl"), "weekend-day-selector-template");
            lg.onItemAppended = function ($item, item) {
                if (item.ni === 5 || item.ni === 7) {
                    $item.find(".day").addClass("act");
                }
            };
            lg.evnt(".day", function (e, $item, $target, item) {
                _this.itemClicked(item.ni);
            });
            lg.evnt(".day", function (e, $item, $target, item) {
                if (_this.focusTimeoutId) {
                    clearTimeout(_this.focusTimeoutId);
                    _this.focusTimeoutId = null;
                }
                _this.showFocus(item.ni);
            })
                .setEvent("mouseenter");
            lg.evnt(".day", function (e, $item, $target, item) {
                _this.focusTimeoutId = setTimeout(function () {
                    _this.focusTimeoutId = null;
                    _this.unsetFocus(null);
                }, 200);
            })
                .setEvent("mouseleave");
            lg.generateList(items);
        };
        DaysFilter.prototype.removeActNo = function (no) {
            var $i = this.getItemByNo(no);
            $i.removeClass("act");
        };
        DaysFilter.prototype.addActNo = function (no) {
            var $i = this.getItemByNo(no);
            $i.addClass("act");
        };
        DaysFilter.prototype.itemClicked = function (no) {
            if (!this.enabled) {
                return;
            }
            var $i = this.getItemByNo(no);
            var isAct = $i.hasClass("act");
            if (no === 4) {
                this.remAdd(isAct ? [4] : null, isAct ? null : [4, 5]);
            }
            if (no === 5) {
                this.remAdd(isAct ? [4, 5] : null, isAct ? null : [5]);
            }
            if (no === 7) {
                this.remAdd(isAct ? [7, 1] : null, isAct ? null : [7]);
            }
            if (no === 1) {
                this.remAdd(isAct ? [1] : null, isAct ? null : [7, 1]);
            }
            this.change();
        };
        DaysFilter.prototype.change = function () {
            if (this.onFilterChange) {
                this.onFilterChange();
            }
        };
        DaysFilter.prototype.remAdd = function (remms, adds) {
            var _this = this;
            if (remms) {
                remms.forEach(function (r) {
                    _this.removeActNo(r);
                });
            }
            if (adds) {
                adds.forEach(function (a) {
                    _this.addActNo(a);
                });
            }
        };
        DaysFilter.prototype.showFocus = function (no) {
            var _this = this;
            if (!this.enabled) {
                return;
            }
            var nos = [];
            if (no === 4) {
                nos = [4, 5];
            }
            if (no === 5) {
                nos = [5];
            }
            if (no === 7) {
                nos = [7];
            }
            if (no === 1) {
                nos = [7, 1];
            }
            this.unsetFocus(null);
            nos.forEach(function (noi) {
                _this.setFocus(noi);
            });
        };
        DaysFilter.prototype.unsetFocus = function (no) {
            if (no) {
                var $i = this.getItemByNo(no);
                $i.removeClass("foc");
            }
            else {
                this.$filterCont.find(".day").removeClass("foc");
            }
        };
        DaysFilter.prototype.setFocus = function (no) {
            var $i = this.getItemByNo(no);
            $i.addClass("foc");
        };
        DaysFilter.prototype.getItemByNo = function (no) {
            var $i = this.$filterCont.find("[data-i=\"" + no + "\"]");
            return $i;
        };
        return DaysFilter;
    }());
    Planning.DaysFilter = DaysFilter;
})(Planning || (Planning = {}));
//# sourceMappingURL=DaysFilter.js.map