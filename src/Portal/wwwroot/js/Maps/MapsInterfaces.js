var Maps;
(function (Maps) {
    var CountryHighligt = (function () {
        function CountryHighligt() {
        }
        return CountryHighligt;
    })();
    Maps.CountryHighligt = CountryHighligt;
    var PlaceMarker = (function () {
        function PlaceMarker() {
        }
        return PlaceMarker;
    })();
    Maps.PlaceMarker = PlaceMarker;
    var PolygonConfig = (function () {
        function PolygonConfig() {
            var defaultColor = '#2F81DE';
            this.borderColor = defaultColor;
            this.borderOpacity = 1;
            this.borderWeight = 1;
            this.fillColor = defaultColor;
            this.fillOpacity = 0.5;
        }
        return PolygonConfig;
    })();
    Maps.PolygonConfig = PolygonConfig;
    (function (ViewType) {
        ViewType[ViewType["D3"] = 0] = "D3";
        ViewType[ViewType["D2"] = 1] = "D2";
        ViewType[ViewType["D1"] = 2] = "D1";
    })(Maps.ViewType || (Maps.ViewType = {}));
    var ViewType = Maps.ViewType;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsInterfaces.js.map