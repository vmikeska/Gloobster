var Planning;
(function (Planning) {
    var WeekendPageSetter = (function () {
        function WeekendPageSetter(v) {
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.v = v;
        }
        WeekendPageSetter.prototype.setConnections = function (conns) {
            this.connections = conns;
            this.onFilterChanged();
        };
        WeekendPageSetter.prototype.init = function () {
            var layoutTmp = this.v.registerTemplate("weekend-layout-template");
            this.$filter.html(layoutTmp());
            this.initWeekendFilters();
            this.displayer = new Planning.WeekendDisplayer(this.$cont);
        };
        WeekendPageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.connections, this.grouping, this.order);
        };
        WeekendPageSetter.prototype.initWeekendFilters = function () {
            var _this = this;
            var tabsg = new Planning.Tabs(this.$filter.find(".grouping-filter"), "groupingFilter", 40);
            tabsg.addTab("tabByCity", "By city", function () {
                _this.grouping = Planning.LocationGrouping.ByCity;
            });
            tabsg.addTab("tabByCountry", "By country", function () {
                _this.grouping = Planning.LocationGrouping.ByCountry;
            });
            tabsg.addTab("tabNoGrouping", "No location grouping", function () {
                _this.grouping = Planning.LocationGrouping.None;
            });
            tabsg.create();
            var tabso = new Planning.Tabs($(this.$filter.find(".list-order-filter")), "listOrder", 40);
            tabso.addTab("tabByWeek", "By week", function () {
                _this.order = Planning.ListOrder.ByWeek;
            });
            tabso.addTab("tabByPrice", "By price", function () {
                _this.order = Planning.ListOrder.ByPrice;
            });
            tabsg.onChange = function () {
                _this.onFilterChanged();
            };
            tabso.onChange = function () {
                _this.onFilterChanged();
            };
            tabso.create();
        };
        return WeekendPageSetter;
    }());
    Planning.WeekendPageSetter = WeekendPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendPageSetter.js.map