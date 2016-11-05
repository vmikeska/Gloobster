var Planning;
(function (Planning) {
    var WeekendPageSetter = (function () {
        function WeekendPageSetter(v) {
            this.grouping = Planning.LocationGrouping.ByCity;
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.v = v;
        }
        WeekendPageSetter.prototype.setConnections = function (conns) {
            this.connections = conns;
            this.onFilterChanged();
        };
        WeekendPageSetter.prototype.init = function () {
            var layoutTmp = this.v.registerTemplate("filtering-weekend-template");
            this.$filter.html(layoutTmp());
            this.initWeekendFilters();
            this.displayer = new Planning.WeekendDisplayer(this.$cont);
        };
        WeekendPageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.connections, this.grouping);
        };
        WeekendPageSetter.prototype.initWeekendFilters = function () {
            var _this = this;
            var f = new Planning.Filtering();
            f.onFilterChanged = function () {
                var state = f.getState();
                _this.grouping = state.actItem;
                _this.onFilterChanged();
            };
            f.init([
                Planning.LocationGrouping.ByCity,
                Planning.LocationGrouping.ByCountry,
                Planning.LocationGrouping.ByContinent
            ], Planning.LocationGrouping.ByCity, true);
        };
        return WeekendPageSetter;
    }());
    Planning.WeekendPageSetter = WeekendPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendPageSetter.js.map