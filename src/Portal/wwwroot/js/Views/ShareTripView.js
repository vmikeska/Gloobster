var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var ShareTripView = (function (_super) {
        __extends(ShareTripView, _super);
        function ShareTripView(tripId) {
            _super.call(this);
            this.initialize(tripId);
        }
        ShareTripView.prototype.initialize = function (tripId) {
            var _this = this;
            this.tripId = tripId;
            this.maps = new Maps.MapsCreatorMapBox2D();
            this.maps.setRootElement("map");
            this.maps.show(function (map) {
                _this.map = map;
                _this.getData(function (trip) {
                    _this.trip = trip;
                    _this.draw(trip);
                });
            });
        };
        ShareTripView.prototype.draw = function (trip) {
            for (var p = 0; p <= trip.places.length - 2; p++) {
                var actPlace = trip.places[p];
                var nextPlace = trip.places[p + 1];
                var fromP = new L.LatLng(actPlace.place.coordinates.Lat, actPlace.place.coordinates.Lng);
                var toP = new L.LatLng(nextPlace.place.coordinates.Lat, nextPlace.place.coordinates.Lng);
                var pointList = [fromP, toP];
                var c = {
                    color: 'red',
                    weight: 3,
                    opacity: 0.5,
                    smoothFactor: 1
                };
                var firstpolyline = new L.polyline(pointList, c);
                firstpolyline.addTo(this.map);
            }
        };
        ShareTripView.prototype.getData = function (callback) {
            var prms = [["tripId", this.tripId]];
            Views.ViewBase.currentView.apiGet("tripShare", prms, function (trip) { return callback(trip); });
        };
        return ShareTripView;
    })(Views.ViewBase);
    Views.ShareTripView = ShareTripView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareTripView.js.map