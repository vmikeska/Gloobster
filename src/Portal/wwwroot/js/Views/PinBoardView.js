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
        this.mapsManager = new MapsManager(this);
        this.mapsManager.switchToView(Maps.ViewType.D2);
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
    PinBoardView.prototype.searchPlaces = function (placeName) {
        var minChars = 3;
        if (placeName.length < minChars) {
            return;
        }
        var params = [["placeName", placeName]];
        var self = this;
        _super.prototype.apiGet.call(this, "place", params, function (response) {
            $("#countriesResult").show();
            var htmlContent = '';
            response.forEach(function (item) {
                htmlContent += self.getItemHtml(item);
            });
            $("#countriesResult").html(htmlContent);
            $(".cityMenuItem").unbind();
            $(".cityMenuItem").click(function (item) {
                var geoId = $(item.currentTarget).data('id');
                var dataRecord = _.find(response, { 'geonameId': geoId });
                var newPlaceRequest = {
                    "CountryCode": dataRecord.countryCode,
                    "City": dataRecord.name,
                    "PlaceLatitude": dataRecord.lat,
                    "PlaceLongitude": dataRecord.lng,
                    "SourceId": dataRecord.geonameId,
                    "SourceType": "GeoNames"
                };
                $("#countriesResult").hide();
                self.saveNewPlace(newPlaceRequest);
            });
        });
    };
    PinBoardView.prototype.getItemHtml = function (item) {
        return '<div class="cityMenuItem" data-id="' + item.SourceId + '" data-type="' + item.SourceType + '">' + item.Name + ', ' + item.CountryCode + ' (pop: ' + item.population + ')' + '</div>';
    };
    return PinBoardView;
})(Views.ViewBase);
//# sourceMappingURL=PinBoardView.js.map