var Planning;
(function (Planning) {
    var AnytimePageSetter = (function () {
        function AnytimePageSetter(dealsSearch) {
            this.grouping = Planning.LocationGrouping.ByCity;
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.dealsSearch = dealsSearch;
        }
        AnytimePageSetter.prototype.setQueries = function (queries) {
            this.queries = queries;
            this.onFilterChanged();
        };
        AnytimePageSetter.prototype.init = function (callback) {
            var layoutTmp = this.dealsSearch.v.registerTemplate("filtering-template");
            this.$filter.html(layoutTmp());
            this.initFilters();
            this.displayer = new Planning.AnytimeDisplayer(this.$cont, this.filter);
            callback();
        };
        AnytimePageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.queries, this.grouping);
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
        AnytimePageSetter.prototype.getCustomId = function () {
            return null;
        };
        return AnytimePageSetter;
    }());
    Planning.AnytimePageSetter = AnytimePageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimePageSetter.js.map