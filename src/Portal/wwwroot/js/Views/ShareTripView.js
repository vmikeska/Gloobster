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
            this.cityMarkers = [];
            this.cityPopupTemp = this.registerTemplate("cityPopup-template");
            this.travelPopupTemp = this.registerTemplate("travelPopup-template");
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
        ShareTripView.prototype.getTravel = function (trip, id) {
            return _.find(trip.travels, function (t) { return t.id === id; });
        };
        ShareTripView.prototype.drawTravelType = function (coord, type, number, fromPlace, toPlace) {
            var marker = L.marker([coord.lat, coord.lng], { icon: this.getIcon(type) })
                .addTo(this.maps.mapObj);
            var context = {
                number: number,
                fromCity: fromPlace.place.selectedName,
                toCity: toPlace.place.selectedName
            };
            this.drawTravelPopUp(marker, context);
            return marker;
        };
        ShareTripView.prototype.drawCity = function (actPlace) {
            var coord = actPlace.place.coordinates;
            var marker = L.marker([coord.Lat, coord.Lng])
                .addTo(this.maps.mapObj);
            var context = {
                cityName: actPlace.place.selectedName,
                bothDates: true,
                fromDate: "",
                toDate: ""
            };
            if (actPlace.leavingDateTime) {
                context.toDate = moment.utc(actPlace.leavingDateTime).format("lll");
            }
            else {
                context.bothDates = false;
            }
            if (actPlace.arrivingDateTime) {
                context.fromDate = moment.utc(actPlace.arrivingDateTime).format("lll");
            }
            else {
                context.bothDates = false;
            }
            this.drawCityPopUp(marker, context);
            this.cityMarkers.push(marker);
            return marker;
        };
        ShareTripView.prototype.drawCityPopUp = function (marker, context) {
            var popupContent = this.cityPopupTemp(context);
            marker.bindPopup(popupContent, {
                closeButton: true,
                minWidth: 200
            });
        };
        ShareTripView.prototype.drawTravelPopUp = function (marker, context) {
            var popupContent = this.travelPopupTemp(context);
            marker.bindPopup(popupContent, {
                closeButton: true,
                minWidth: 200
            });
        };
        ShareTripView.prototype.getIcon = function (type) {
            var iconBase = {
                iconUrl: "",
                iconSize: [22, 22],
                iconAnchor: [11, 11],
            };
            switch (type) {
                case TravelType.Bus:
                    iconBase.iconUrl = this.icoUrl("bus");
                    break;
                case TravelType.Car:
                    iconBase.iconUrl = this.icoUrl("car");
                    break;
                case TravelType.Plane:
                    iconBase.iconUrl = this.icoUrl("plane");
                    break;
                case TravelType.Ship:
                    iconBase.iconUrl = this.icoUrl("ship");
                    break;
                case TravelType.Walk:
                    iconBase.iconUrl = this.icoUrl("walk");
                    break;
                case TravelType.Bike:
                    iconBase.iconUrl = this.icoUrl("bike");
                    break;
                case TravelType.Train:
                    iconBase.iconUrl = this.icoUrl("train");
                    break;
            }
            return L.icon(iconBase);
        };
        ShareTripView.prototype.icoUrl = function (type) {
            return "/images/sm/" + type + ".png";
        };
        ShareTripView.prototype.getCenter = function (p1, p2) {
            return { lat: (p1.lat + p2.lat) / 2, lng: (p1.lng + p2.lng) / 2 };
        };
        ShareTripView.prototype.draw = function (trip) {
            for (var p = 0; p <= trip.places.length - 1; p++) {
                var actPlace = trip.places[p];
                this.drawCity(actPlace);
                if (actPlace.leavingId) {
                    var travel = this.getTravel(trip, actPlace.leavingId);
                    var pointList = _.map(travel.waypoints, function (p) { return new L.LatLng(p.Lat, p.Lng); });
                    var center = null;
                    if (pointList.length === 2) {
                        center = this.getCenter(pointList[0], pointList[1]);
                    }
                    else if (pointList.length > 2) {
                        var ci = Math.floor(pointList.length / 2);
                        center = pointList[ci];
                    }
                    var nextPlace = trip.places[p + 1];
                    var no = p + 1;
                    this.drawTravelType(center, travel.type, no, actPlace, nextPlace);
                    var c = {
                        color: "#550000",
                        weight: 5,
                        opacity: 0.5,
                        smoothFactor: 1
                    };
                    if (_.contains([TravelType.Ship, TravelType.Plane, TravelType.Train], travel.type)) {
                        $.extend(c, { dashArray: [5, 5] });
                    }
                    var firstpolyline = new L.polyline(pointList, c);
                    firstpolyline.addTo(this.map);
                }
            }
            var cities = new L.featureGroup(this.cityMarkers);
            this.map.fitBounds(cities.getBounds());
        };
        ShareTripView.prototype.getData = function (callback) {
            var prms = [["tripId", this.tripId]];
            Views.ViewBase.currentView.apiGet("tripShare", prms, function (trip) { return callback(trip); });
        };
        return ShareTripView;
    }(Views.ViewBase));
    Views.ShareTripView = ShareTripView;
})(Views || (Views = {}));
//# sourceMappingURL=ShareTripView.js.map