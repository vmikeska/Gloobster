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
        this.mapsManager = new MapsManager(this);
        this.mapsManager.switchToView(Maps.ViewType.D2);
        this.placeSearch = new PlaceSearchBox(this, "cities", "0,1,2,3");
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
var PlaceSearchBox = (function () {
    function PlaceSearchBox(owner, elementId, providers) {
        this.owner = owner;
        this.registerHandler(elementId);
        this.providers = providers;
    }
    PlaceSearchBox.prototype.searchPlaces = function (placeName) {
        var _this = this;
        var minChars = 3;
        if (placeName.length < minChars) {
            return;
        }
        var params = [["placeName", placeName], ["types", this.providers]];
        this.owner.apiGet("place", params, function (places) { _this.fillPlacesSearchBoxHtml(places); });
    };
    PlaceSearchBox.prototype.registerHandler = function (elementId) {
        //var elemId = "#" + elementId;
        //$(elemId).on("input", () => {
        //	var placeName = $(elemId + " input").val();
        var _this = this;
        //	this.searchPlaces(placeName);
        //});
        var $elem = $("#" + elementId);
        $elem.on("input", function () {
            var placeName = $elem.find("input").val();
            _this.searchPlaces(placeName);
        });
    };
    PlaceSearchBox.prototype.fillPlacesSearchBoxHtml = function (places) {
        var _this = this;
        $("#cities ul").show();
        var htmlContent = '';
        places.forEach(function (item) {
            htmlContent += _this.getItemHtml(item);
        });
        $("#cities li").unbind();
        $("#cities ul").html(htmlContent);
        $("#cities li").click(function (clickedPlace) {
            _this.placeAdd(clickedPlace, places);
            $("#cities input").val("");
        });
    };
    PlaceSearchBox.prototype.placeAdd = function (clickedPlace, places) {
        var sourceId = $(clickedPlace.currentTarget).data("value");
        var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
        var sourceType = parseInt(sourceTypeStr);
        var newPlaceRequest = {
            "SourceId": sourceId,
            "SourceType": sourceType
        };
        $("#cities ul").hide();
        this.onPlaceSelected(newPlaceRequest);
        //this.saveNewPlace(newPlaceRequest);
    };
    PlaceSearchBox.prototype.getIconForSearch = function (sourceType) {
        switch (sourceType) {
            case SourceType.FB:
                return "icon-facebook";
            case SourceType.City:
                return "icon-city";
            case SourceType.Country:
                return "icon-country";
            case SourceType.S4:
                return "icon-foursquare";
        }
        return "";
    };
    PlaceSearchBox.prototype.getItemHtml = function (item) {
        var icoClass = this.getIconForSearch(item.SourceType);
        return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="' + icoClass + ' left mright10"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
    };
    return PlaceSearchBox;
})();
//# sourceMappingURL=PinBoardView.js.map