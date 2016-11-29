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
        WeekendPageSetter.prototype.init = function (callback) {
            var layoutTmp = this.v.registerTemplate("filtering-template");
            this.$filter.html(layoutTmp());
            this.initFilters();
            this.displayer = new Planning.WeekendDisplayer(this.$cont);
            callback();
        };
        WeekendPageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.connections, this.grouping);
        };
        WeekendPageSetter.prototype.initFilters = function () {
            var _this = this;
            var f = new Planning.FilteringWeekend();
            f.onFilterChanged = function () {
                var state = f.getState();
                _this.grouping = state.actItem;
                _this.onFilterChanged();
            };
            f.initW([
                Planning.LocationGrouping.ByCity,
                Planning.LocationGrouping.ByCountry
            ], Planning.LocationGrouping.ByCity, true);
        };
        WeekendPageSetter.prototype.getCustomId = function () {
            return null;
        };
        return WeekendPageSetter;
    }());
    Planning.WeekendPageSetter = WeekendPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendPageSetter.js.map