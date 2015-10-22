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
        this.mapsManager = new MapsManager(this);
        this.mapsManager.switchToView(Maps.ViewType.D2);
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
    PinBoardView.prototype.searchPlaces = function (placeName) {
        var _this = this;
        var minChars = 3;
        if (placeName.length < minChars) {
            return;
        }
        var params = [["placeName", placeName]];
        _super.prototype.apiGet.call(this, "place", params, function (places) { _this.fillPlacesSearchBoxHtml(places); });
    };
    PinBoardView.prototype.fillPlacesSearchBoxHtml = function (places) {
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
    PinBoardView.prototype.placeAdd = function (clickedPlace, places) {
        var sourceId = $(clickedPlace.currentTarget).data("value");
        var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
        var sourceType = parseInt(sourceTypeStr);
        var newPlaceRequest = {
            "SourceId": sourceId,
            "SourceType": sourceType
        };
        $("#cities ul").hide();
        this.saveNewPlace(newPlaceRequest);
    };
    PinBoardView.prototype.getIconForSearch = function (sourceType) {
        var link = "../images/PlaceSearch/";
        switch (sourceType) {
            case SourceType.FB:
                link += "FB.png";
                break;
            case SourceType.City:
                link += "Ci.png";
                break;
            case SourceType.Country:
                link += "Co.png";
                break;
            case SourceType.S4:
                link += "4S.png";
                break;
        }
        return link;
    };
    PinBoardView.prototype.getItemHtml = function (item) {
        var imgUrl = this.getIconForSearch(item.SourceType);
        return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="thumbnail"><img src="' + imgUrl + '"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
    };
    return PinBoardView;
})(Views.ViewBase);
//# sourceMappingURL=PinBoardView.js.map