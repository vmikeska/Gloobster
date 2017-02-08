var Planning;
(function (Planning) {
    var CustomPageSetter = (function () {
        function CustomPageSetter(dealsSearch) {
            this.grouping = Planning.LocationGrouping.ByCity;
            this.$cont = $("#resultsCont");
            this.$filter = $("#filterCont");
            this.dealsSearch = dealsSearch;
        }
        CustomPageSetter.prototype.setQueries = function (queries) {
            this.queries = queries;
            this.onFilterChanged();
        };
        CustomPageSetter.prototype.init = function (callback) {
            var layoutTmp = this.dealsSearch.v.registerTemplate("filtering-template");
            this.$filter.html(layoutTmp());
            this.initFilters();
            this.displayer = new Planning.AnytimeDisplayer(this.$cont, this.filter);
            this.customForm = new Planning.CustomFrom(this.dealsSearch);
            this.customForm.init(function () {
                callback();
            });
        };
        CustomPageSetter.prototype.getCustomId = function () {
            return this.customForm.searchId;
        };
        CustomPageSetter.prototype.onFilterChanged = function () {
            this.displayer.showResults(this.queries, this.grouping);
        };
        CustomPageSetter.prototype.initFilters = function () {
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
        return CustomPageSetter;
    }());
    Planning.CustomPageSetter = CustomPageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=CustomPageSetter.js.map