var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
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
            this.mapsManager = new Maps.MapsManager();
            this.mapsManager.switchToView(Maps.ViewType.D2);
            this.shareDialogView = new Views.ShareDialogPinsView();
            var c = new Common.PlaceSearchConfig();
            c.providers = "0,1,2,3";
            c.elementId = "cities";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = true;
            this.placeSearch = new Common.PlaceSearchBox(c);
            this.placeSearch.onPlaceSelected = function (request) { return _this.saveNewPlace(request); };
            $("#mapType li").click(function (e) {
                var value = $(e.target).data("value");
                var parsedVal = parseInt(value);
                _this.mapsManager.switchToView(parsedVal);
            });
            $("#pluginType li").click(function (e) {
                var pluginType = $(e.target).data("value");
                var projectionType = parseInt($("#projectionType input").val());
                _this.mapsManager.getPluginData(pluginType, projectionType);
            });
            $("#projectionType li").click(function (e) {
                var pluginType = parseInt($("#pluginType input").val());
                var projectionType = $(e.target).data("value");
                _this.mapsManager.getPluginData(pluginType, projectionType);
            });
        };
        PinBoardView.prototype.setStatsRibbon = function (citiesCount, countriesCount, worldTraveledPercent) {
            $("#CitiesCount").text(citiesCount);
            $("#CountriesCount").text(countriesCount);
            $("#TraveledPercent").text(worldTraveledPercent);
            //DistanceLength
            //FriendsCount
            //BadgesCount		 
        };
        PinBoardView.prototype.saveNewPlace = function (request) {
            var _this = this;
            var self = this;
            this.apiPost("checkin", request, function (req) {
                var moveToLocation = null;
                if (req.visitedCities) {
                    req.visitedCities.forEach(function (city) {
                        self.mapsManager.mapsDataLoader.places.cities.push(city);
                        moveToLocation = city.Location;
                    });
                }
                if (req.visitedPlaces) {
                    req.visitedPlaces.forEach(function (place) {
                        self.mapsManager.mapsDataLoader.places.places.push(place);
                        moveToLocation = place.Location;
                    });
                }
                if (req.visitedCountries) {
                    req.visitedCountries.forEach(function (country) {
                        self.mapsManager.mapsDataLoader.places.countries.push(country);
                    });
                }
                if (moveToLocation) {
                    self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
                }
                _this.setStatsRibbon(req.citiesCount, req.countriesCount, req.worldTraveledPercent);
                self.mapsManager.mapsDataLoader.mapToViewData();
                self.mapsManager.redrawDataCallback();
            });
        };
        return PinBoardView;
    })(Views.ViewBase);
    Views.PinBoardView = PinBoardView;
})(Views || (Views = {}));
//# sourceMappingURL=PinBoardView.js.map