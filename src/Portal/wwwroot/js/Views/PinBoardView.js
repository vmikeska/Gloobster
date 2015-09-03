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
    //public countryShapes: CountryShapes;
    PinBoardView.prototype.initialize = function () {
        //this.mapsCreator = new MapsCreator('earth_div');
        //this.mapsCreator.initializeGlobe(MapTypes.MQCDN1);
        this.mapsManager = new MapsManager();
        this.mapsManager.switchToView(Maps.ViewType.D3);
        //this.mapsBaseOperations = new MapsBaseOperation3D(this.mapsCreator.earth);
        //this.mapsOperations = new MapsOperations3D(this.mapsBaseOperations);
        //this.countryShapes = new CountryShapes();
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
    //public setView(lat, lng) {
    //		this.mapsCreator.earth.setView([lat, lng], 3);
    //}
    PinBoardView.prototype.displayVisitedCountries = function () {
        //this.clearDisplayedCountries();
        //var countryConf = this.countryConfig;
        //this.visitedCountries.forEach(countryCode => {
        //	var countryCoordinates = this.countryShapes.getCoordinatesByCountry(countryCode);
        //	this.mapsOperations.drawCountry(countryCoordinates, countryConf);
        //});
    };
    PinBoardView.prototype.displayVisitedPlaces = function () {
        //this.visitedPlaces.forEach(place => {
        //	this.mapsOperations.drawPlace(place.PlaceLatitude, place.PlaceLongitude);
        //});
    };
    PinBoardView.prototype.clearDisplayedCountries = function () {
    };
    PinBoardView.prototype.getUserId = function () {
        return '55e0b1d7ff89d0435456e6f5';
    };
    PinBoardView.prototype.onVisitedCountriesResponse = function (visitedCountries) {
        this.mapsManager.countries =
            this.visitedCountries = visitedCountries;
        this.displayVisitedCountries();
    };
    PinBoardView.prototype.getVisitedPlaces = function () {
        var self = this;
        _super.prototype.apiGet.call(this, "visitedPlace", [["userId", this.getUserId()]], function (response) {
            self.visitedPlaces = response.Places;
            self.displayVisitedPlaces();
        });
    };
    PinBoardView.prototype.getVisitedCountries = function () {
        var self = this;
        _super.prototype.apiGet.call(this, "visitedCountry", [["userId", this.getUserId()]], function (response) {
            self.onVisitedCountriesResponse(response.Countries3);
        });
    };
    return PinBoardView;
})(Views.ViewBase);
//# sourceMappingURL=PinBoardView.js.map