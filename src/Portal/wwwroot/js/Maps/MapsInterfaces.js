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
    (function (ViewType) {
        ViewType[ViewType["D3"] = 0] = "D3";
        ViewType[ViewType["D2"] = 1] = "D2";
        ViewType[ViewType["D1"] = 2] = "D1";
    })(Maps.ViewType || (Maps.ViewType = {}));
    var ViewType = Maps.ViewType;
    (function (DataType) {
        DataType[DataType["Visited"] = 0] = "Visited";
        DataType[DataType["Interested"] = 1] = "Interested";
    })(Maps.DataType || (Maps.DataType = {}));
    var DataType = Maps.DataType;
    (function (DisplayEntity) {
        DisplayEntity[DisplayEntity["Pin"] = 0] = "Pin";
        DisplayEntity[DisplayEntity["Countries"] = 1] = "Countries";
        DisplayEntity[DisplayEntity["Heat"] = 2] = "Heat";
    })(Maps.DisplayEntity || (Maps.DisplayEntity = {}));
    var DisplayEntity = Maps.DisplayEntity;
    var PeopleSelection = (function () {
        function PeopleSelection() {
        }
        return PeopleSelection;
    }());
    Maps.PeopleSelection = PeopleSelection;
})(Maps || (Maps = {}));
//# sourceMappingURL=MapsInterfaces.js.map