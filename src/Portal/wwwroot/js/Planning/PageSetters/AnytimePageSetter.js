var Planning;
(function (Planning) {
    var AnytimePageSetter = (function () {
        function AnytimePageSetter(v) {
            this.grouping = Planning.LocationGrouping.ByCity;
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.v = v;
        }
        AnytimePageSetter.prototype.setConnections = function (conns) {
            this.connections = conns;
            this.onFilterChanged();
        };
        AnytimePageSetter.prototype.init = function () {
            var layoutTmp = this.v.registerTemplate("filtering-template");
            this.$filter.html(layoutTmp());
            this.initFilters();
            this.displayer = new Planning.AnytimeDisplayer(this.$cont, this.filter);
        };
        AnytimePageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.connections, this.grouping);
        };
        AnytimePageSetter.prototype.initFilters = function () {
            var _this = this;
            this.filter = new Planning.FilteringAnytime();
            this.filter.onFilterChanged = function () {
                var state = _this.filter.getStateBase();
                _this.grouping = state.grouping;
                _this.onFilterChanged();
            };
            this.filter.initA([
                Planning.LocationGrouping.ByCity,
                Planning.LocationGrouping.ByCountry,
                Planning.LocationGrouping.ByContinent
            ], Planning.LocationGrouping.ByCity);
        };
        return AnytimePageSetter;
    }());
    Planning.AnytimePageSetter = AnytimePageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimePageSetter.js.map