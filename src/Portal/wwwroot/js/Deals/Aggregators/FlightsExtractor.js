var Planning;
(function (Planning) {
    var FlightsExtractor = (function () {
        function FlightsExtractor() {
        }
        FlightsExtractor.f = function (queries, callback) {
            queries.forEach(function (q) {
                q.results.forEach(function (r) {
                    r.fs.forEach(function (f) {
                        callback(f, r, q);
                    });
                });
            });
        };
        FlightsExtractor.r = function (queries, callback) {
            queries.forEach(function (q) {
                q.results.forEach(function (r) {
                    callback(r, q);
                });
            });
        };
        FlightsExtractor.getResults = function (queries) {
            var res = [];
            this.r(queries, function (r) { res.push(r); });
            return res;
        };
        return FlightsExtractor;
    }());
    Planning.FlightsExtractor = FlightsExtractor;
})(Planning || (Planning = {}));
//# sourceMappingURL=FlightsExtractor.js.map