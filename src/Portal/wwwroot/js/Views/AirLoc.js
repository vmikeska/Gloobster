var Views;
(function (Views) {
    var AirLoc = (function () {
        function AirLoc() {
        }
        AirLoc.registerLocationCombo = function ($c, callback) {
            if (callback === void 0) { callback = null; }
            var c = new Common.PlaceSearchConfig();
            c.providers = "2";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            c.selOjb = $c;
            var box = new Common.PlaceSearchBox(c);
            $c.change(function (e, request, place) {
                var data = { gid: place.SourceId };
                Views.ViewBase.currentView.apiPut("DealsCurrentLocation", data, function (res) {
                    callback(place);
                });
            });
            return box;
        };
        return AirLoc;
    }());
    Views.AirLoc = AirLoc;
})(Views || (Views = {}));
//# sourceMappingURL=AirLoc.js.map