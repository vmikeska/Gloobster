var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PinBoardView = (function (_super) {
    __extends(PinBoardView, _super);
    function PinBoardView() {
        _super.apply(this, arguments);
    }
    PinBoardView.prototype.initialize = function () {
        this.mapsManager = new MapsManager();
        this.mapsManager.switchToView(Maps.ViewType.D2);
        this.getVisitedCountries();
        this.getVisitedPlaces();
    };
    Object.defineProperty(PinBoardView.prototype, "countryConfig", {
        get: function () {
            var countryConfig = new Maps.PolygonConfig();
            countryConfig.fillColor = "#009900";
            return countryConfig;
        },
        enumerable: true,
        configurable: true
    });
    PinBoardView.prototype.onVisitedCountriesResponse = function (visitedCountries) {
        this.visitedCountries = visitedCountries;
        var countryConf = this.countryConfig;
        var mappedCountries = _.map(this.visitedCountries, function (countryCode) {
            var country = new Maps.CountryHighligt();
            country.countryCode = countryCode;
            country.countryConfig = countryConf;
            return country;
        });
        this.mapsManager.setVisitedCountries(mappedCountries);
    };
    PinBoardView.prototype.onVisitedPlacesResponse = function (response) {
        this.visitedPlaces = response.Places;
        var mappedPlaces = _.map(this.visitedPlaces, function (place) {
            var marker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
            return marker;
        });
        this.mapsManager.setVisitedPlaces(mappedPlaces);
    };
    PinBoardView.prototype.saveNewPlace = function (dataRecord) {
        var self = this;
        _super.prototype.apiPost.call(this, "visitedPlace", dataRecord, function (response) {
            var placeAdded = response.length > 0;
            if (placeAdded) {
                var place = response[0];
                var newMarker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
                self.mapsManager.places.push(newMarker);
                self.mapsManager.mapsOperations.drawPlace(newMarker);
            }
            self.mapsManager.mapsDriver.moveToAnimated(dataRecord.PlaceLatitude, dataRecord.PlaceLongitude, 5);
        });
    };
    PinBoardView.prototype.getVisitedPlaces = function () {
        var self = this;
        _super.prototype.apiGet.call(this, "visitedPlace", null, function (response) {
            self.onVisitedPlacesResponse(response);
        });
    };
    PinBoardView.prototype.getVisitedCountries = function () {
        var self = this;
        //[["userId", this.getUserId()]]
        _super.prototype.apiGet.call(this, "visitedCountry", null, function (response) {
            self.onVisitedCountriesResponse(response.Countries3);
        });
    };
    return PinBoardView;
})(Views.ViewBase);
//# sourceMappingURL=PinBoardView.js.map