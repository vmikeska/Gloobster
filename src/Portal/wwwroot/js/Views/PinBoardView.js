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
    Object.defineProperty(PinBoardView.prototype, "pageType", {
        get: function () { return Views.PageType.PinBoard; },
        enumerable: true,
        configurable: true
    });
    PinBoardView.prototype.initialize = function () {
        var _this = this;
        this.mapsManager = new MapsManager();
        this.mapsManager.switchToView(Maps.ViewType.D2);
        var searchConfig = new PlaceSearchConfig();
        searchConfig.providers = "0,1,2,3";
        searchConfig.elementId = "cities";
        searchConfig.minCharsToSearch = 1;
        searchConfig.clearAfterSearch = true;
        this.placeSearch = new PlaceSearchBox(searchConfig);
        this.placeSearch.onPlaceSelected = function (request) { return _this.saveNewPlace(request); };
    };
    PinBoardView.prototype.saveNewPlace = function (request) {
        var self = this;
        _super.prototype.apiPost.call(this, "checkin", request, function (places) {
            var moveToLocation = null;
            if (places.VisitedCities) {
                places.VisitedCities.forEach(function (city) {
                    self.mapsManager.mapsDataLoader.places.cities.push(city);
                    moveToLocation = city.Location;
                });
            }
            if (places.VisitedPlaces) {
                places.VisitedPlaces.forEach(function (place) {
                    self.mapsManager.mapsDataLoader.places.places.push(place);
                    moveToLocation = place.Location;
                });
            }
            if (places.VisitedCountries) {
                places.VisitedCountries.forEach(function (country) {
                    self.mapsManager.mapsDataLoader.places.countries.push(country);
                });
            }
            if (moveToLocation) {
                self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
            }
            self.mapsManager.mapsDataLoader.mapToViewData();
            self.mapsManager.redrawDataCallback();
        });
    };
    return PinBoardView;
})(Views.ViewBase);
//# sourceMappingURL=PinBoardView.js.map