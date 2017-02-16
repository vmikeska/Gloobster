var Planning;
(function (Planning) {
    var DealsSearch = (function () {
        function DealsSearch() {
        }
        DealsSearch.prototype.init = function () {
            var _this = this;
            this.resultsEngine = new Planning.ResultsManager();
            this.resultsEngine.onDrawQueue = function () {
                var qv = new Planning.QueueVisualize();
                if (any(_this.resultsEngine.queue)) {
                    qv.draw(_this.resultsEngine.timeType, _this.resultsEngine.queue);
                }
                else {
                    qv.hide();
                }
            };
            this.resultsEngine.onResultsChanged = function (queries) {
                _this.currentSetter.setQueries(queries);
                var de = new Planning.DelasEval(_this.resultsEngine.timeType, queries);
                de.dispayDeals();
            };
            this.planningMap.onMapLoaded = function () {
            };
            this.planningMap.onSelectionChanged = function (id, newState, type) {
                var customId = null;
                _this.resultsEngine.selectionChanged(id, newState, type, customId);
            };
            this.locDlg = new Planning.LocationSettingsDialog();
        };
        DealsSearch.prototype.enableMap = function (state) {
            var disabler = $("#mapDisabler");
            if (state) {
                disabler.removeClass("map-disabled");
            }
            else {
                disabler.addClass("map-disabled");
            }
        };
        return DealsSearch;
    }());
    Planning.DealsSearch = DealsSearch;
})(Planning || (Planning = {}));
//# sourceMappingURL=DealsSearch.js.map