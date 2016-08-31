var Maps;
(function (Maps) {
    var CountryHighligt = (function () {
        function CountryHighligt() {
        }
        return CountryHighligt;
    }());
    Maps.CountryHighligt = CountryHighligt;
    var PlaceMarker = (function () {
        function PlaceMarker() {
        }
        return PlaceMarker;
    }());
    Maps.PlaceMarker = PlaceMarker;
    var PolygonConfig = (function () {
        function PolygonConfig() {
            var defaultColor = '#2F81DE';
            this.borderColor = defaultColor;
            this.borderOpacity = 1;
            this.borderWeight = 1;
            this.fillColor = defaultColor;
            this.fillOpacity = 0.6;
        }
        return PolygonConfig;
    }());
    Maps.PolygonConfig = PolygonConfig;
    var Places = (function () {
        function Places() {
        }
        return Places;
    }());
    Maps.Places = Places;
    var PlacesDisplay = (function () {
        function PlacesDisplay() {
        }
        return PlacesDisplay;
    }());
    Maps.PlacesDisplay = PlacesDisplay;
    (function (MapType) {
        MapType[MapType["D2"] = 0] = "D2";
        MapType[MapType["D3"] = 1] = "D3";
    })(Maps.MapType || (Maps.MapType = {}));
    var MapType = Maps.MapType;
    (function (DataType) {
        DataType[DataType["Cities"] = 0] = "Cities";
        DataType[DataType["Countries"] = 1] = "Countries";
        DataType[DataType["Places"] = 2] = "Places";
    })(Maps.DataType || (Maps.DataType = {}));
    var DataType = Maps.DataType;
    var PeopleSelection = (function () {
        function PeopleSelection() {
        }
        return PeopleSelection;
    }());
    Maps.PeopleSelection = PeopleSelection;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsInterfaces.js.map