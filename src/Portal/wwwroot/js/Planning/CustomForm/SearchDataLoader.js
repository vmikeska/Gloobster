var Planning;
(function (Planning) {
    var SearchDataLoader = (function () {
        function SearchDataLoader() {
        }
        SearchDataLoader.prototype.getInitData = function (callback) {
            var prms = [["actionName", "init"]];
            Views.ViewBase.currentView.apiGet("CustomSearch", prms, function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.getSearch = function (id, callback) {
            var prms = [["actionName", "search"], ["id", id]];
            Views.ViewBase.currentView.apiGet("CustomSearch", prms, function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.createNewSearch = function (callback) {
            var data = {
                actionName: "new"
            };
            Views.ViewBase.currentView.apiPost("CustomSearch", data, function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.deleteSearch = function (id, callback) {
            Views.ViewBase.currentView.apiDelete("CustomSearch", [["actionName", "search"], ["id", id]], function (res) {
                callback(res);
            });
        };
        SearchDataLoader.prototype.removeAirport = function (searchId, origId, callback) {
            var prms = [["actionName", "air"], ["id", searchId], ["paramId", origId]];
            Views.ViewBase.currentView.apiDelete("CustomSearch", prms, function (res) {
                callback(res);
            });
        };
        return SearchDataLoader;
    }());
    Planning.SearchDataLoader = SearchDataLoader;
})(Planning || (Planning = {}));
//# sourceMappingURL=SearchDataLoader.js.map