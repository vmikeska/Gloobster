var Planning;
(function (Planning) {
    var AnytimePageSetter = (function () {
        function AnytimePageSetter() {
        }
        AnytimePageSetter.prototype.setQueries = function (queries) {
            this.queries = queries;
            this.onFilterChanged();
        };
        AnytimePageSetter.prototype.init = function (callback) {
            this.initFilters();
            callback();
        };
        AnytimePageSetter.prototype.onFilterChanged = function () {
        };
        AnytimePageSetter.prototype.initFilters = function () {
            this.filter = new Planning.FilteringAnytime();
            this.filter.onFilterChanged = function () {
            };
        };
        return AnytimePageSetter;
    }());
    Planning.AnytimePageSetter = AnytimePageSetter;
})(Planning || (Planning = {}));
//# sourceMappingURL=AnytimePageSetter.js.map