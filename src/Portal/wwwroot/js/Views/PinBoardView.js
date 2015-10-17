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
    PinBoardView.prototype.saveNewPlace = function (dataRecord) {
        //todo: rework
        //var self = this;
        //super.apiPost("visitedPlace", dataRecord, function(response) {
        //	var placeAdded = response.length > 0;
        //	if (placeAdded) {
        //	 var place = response[0];
        //	 var newMarker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
        //	 self.mapsManager.places.push(newMarker);
        //	 self.mapsManager.mapsOperations.drawPlace(newMarker); 
        //	}
        //	self.mapsManager.mapsDriver.moveToAnimated(dataRecord.PlaceLatitude, dataRecord.PlaceLongitude, 5);
        //});
    };
    PinBoardView.prototype.searchPlaces = function (placeName) {
        var _this = this;
        //var self = this;
        var minChars = 3;
        if (placeName.length < minChars) {
            return;
        }
        var params = [["placeName", placeName]];
        _super.prototype.apiGet.call(this, "place", params, function (response) {
            $("#cities ul").show();
            var htmlContent = '';
            response.forEach(function (item) {
                htmlContent += _this.getItemHtml(item);
            });
            $("#cities ul").html(htmlContent);
            $("#cities li").unbind();
            $("#cities li").click(function (item) {
                var geoId = $(item.currentTarget).data("value");
                var dataRecord = _.find(response, { "SourceId": geoId.toString() });
                var newPlaceRequest = {
                    "CountryCode": dataRecord.CountryCode,
                    "City": dataRecord.City,
                    "SourceId": dataRecord.SourceId,
                    "SourceType": dataRecord.SourceType
                };
                if (dataRecord.Coordinates) {
                    newPlaceRequest["PlaceLatitude"] = dataRecord.Coordinates.Lat;
                    newPlaceRequest["PlaceLongitude"] = dataRecord.Coordinates.Lng;
                }
                $("#cities ul").hide();
                _this.saveNewPlace(newPlaceRequest);
            });
        });
    };
    PinBoardView.prototype.getItemHtml = function (item) {
        var imgUrl = 'images/samples/sample11.png';
        return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="thumbnail"><img src="' + imgUrl + '"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
        //'<div class="cityMenuItem" data-id="' + item.SourceId + '" data-type="' + item.SourceType + '">' + item.Name + ', ' + item.CountryCode + ' (pop: ' + item.population + ')' + '</div>';
    };
    return PinBoardView;
})(Views.ViewBase);
//# sourceMappingURL=PinBoardView.js.map