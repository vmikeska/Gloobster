var Planning;
(function (Planning) {
    var MonthsSelector = (function () {
        function MonthsSelector($cont) {
            this.actCls = "active";
            this.$comp = $("<div class=\"months-filter\"></div>");
            $cont.html(this.$comp);
        }
        MonthsSelector.prototype.gen = function (cnt) {
            var _this = this;
            var items = this.getItems(cnt);
            var f = _.first(items);
            this.year = f.year;
            this.month = f.month;
            var lg = Common.ListGenerator.init(this.$comp, "month-item-filter-template");
            lg.evnt(null, function (e, $item, $target, item) {
                _this.month = item.month;
                _this.year = item.year;
                _this.$comp.find(".month").removeClass(_this.actCls);
                $item.addClass(_this.actCls);
                _this.change();
            });
            var isFirst = true;
            lg.activeItem = function (item) {
                var r = {
                    cls: "active",
                    isActive: isFirst
                };
                isFirst = false;
                return r;
            };
            lg.generateList(items);
        };
        MonthsSelector.prototype.change = function () {
            if (this.onChange) {
                this.onChange();
            }
        };
        MonthsSelector.prototype.getItems = function (cnt) {
            var today = new Date();
            var items = [];
            for (var act = 0; act <= cnt - 1; act++) {
                var newDate = moment(today).add(act, "months");
                var txt = newDate.format("MMMM YY");
                var item = {
                    txt: txt,
                    month: newDate.month() + 1,
                    year: newDate.year()
                };
                items.push(item);
            }
            return items;
        };
        return MonthsSelector;
    }());
    Planning.MonthsSelector = MonthsSelector;
})(Planning || (Planning = {}));
//# sourceMappingURL=MonthsSelector.js.map