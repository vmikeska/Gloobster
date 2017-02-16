var Planning;
(function (Planning) {
    var WeekendPageSetter = (function () {
        function WeekendPageSetter(dealsSearch) {
            this.grouping = Planning.LocationGrouping.ByCity;
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.dealsSearch = dealsSearch;
        }
        WeekendPageSetter.prototype.setQueries = function (queries) {
            this.queries = queries;
            this.onFilterChanged();
        };
        WeekendPageSetter.prototype.init = function (callback) {
            this.initFilters();
            this.displayer = new Planning.WeekendDisplayer(this.$cont, this.filtering);
            callback();
        };
        WeekendPageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.queries, this.grouping);
        };
        WeekendPageSetter.prototype.initFilters = function () {
            var _this = this;
            this.filtering = new Planning.FilteringWeekend();
            this.filtering.onFilterChanged = function () {
                var state = _this.filtering.getStateBase();
                _this.grouping = state.grouping;
                _this.onFilterChanged();
            };
            this.filtering.initW([
                Planning.LocationGrouping.ByCity,
                Planning.LocationGrouping.ByCountry
            ], Planning.LocationGrouping.ByCity, false);
        };
        WeekendPageSetter.prototype.getCustomId = function () {
            return null;
        };
        return WeekendPageSetter;
    }());
    Planning.WeekendPageSetter = WeekendPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=WeekendPageSetter.js.map