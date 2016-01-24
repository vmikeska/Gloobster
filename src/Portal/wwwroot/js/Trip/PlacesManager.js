var Trip;
(function (Trip) {
    (function (NewPlacePosition) {
        NewPlacePosition[NewPlacePosition["ToLeft"] = 0] = "ToLeft";
        NewPlacePosition[NewPlacePosition["ToRight"] = 1] = "ToRight";
    })(Trip.NewPlacePosition || (Trip.NewPlacePosition = {}));
    var NewPlacePosition = Trip.NewPlacePosition;
    (function (TravelType) {
        TravelType[TravelType["Walk"] = 0] = "Walk";
        TravelType[TravelType["Plane"] = 1] = "Plane";
        TravelType[TravelType["Car"] = 2] = "Car";
        TravelType[TravelType["Bus"] = 3] = "Bus";
        TravelType[TravelType["Train"] = 4] = "Train";
        TravelType[TravelType["Ship"] = 5] = "Ship";
        TravelType[TravelType["Bike"] = 6] = "Bike";
    })(Trip.TravelType || (Trip.TravelType = {}));
    var TravelType = Trip.TravelType;
    var Place = (function () {
        function Place() {
        }
        return Place;
    })();
    Trip.Place = Place;
    var PlaceLocation = (function () {
        function PlaceLocation() {
        }
        return PlaceLocation;
    })();
    Trip.PlaceLocation = PlaceLocation;
    var Travel = (function () {
        function Travel() {
        }
        return Travel;
    })();
    Trip.Travel = Travel;
    var PlacesManager = (function () {
        function PlacesManager(tripId) {
            this.places = [];
            this.travels = [];
            this.tripId = tripId;
        }
        PlacesManager.prototype.mapTravel = function (resp, from, to) {
            var t = new Travel();
            t.id = resp.id;
            t.type = resp.type;
            t.arrivingDateTime = Trip.Utils.dateStringToUtcDate(resp.arrivingDateTime);
            t.leavingDateTime = Trip.Utils.dateStringToUtcDate(resp.leavingDateTime);
            t.from = from;
            t.to = to;
            return t;
        };
        PlacesManager.prototype.mapPlace = function (resp, arriving, leaving) {
            var p = new Place();
            p.id = resp.id;
            p.orderNo = resp.orderNo;
            p.place = resp.place;
            p.arriving = arriving;
            p.leaving = leaving;
            return p;
        };
        PlacesManager.prototype.setData = function (travels, places) {
            var _this = this;
            places.forEach(function (place) {
                var p = _this.mapPlace(place, null, null);
                if (place.arrivingId !== Constants.emptyId) {
                    p.arriving = _this.getOrCreateTravelById(place.arrivingId, travels);
                    p.arriving.to = p;
                }
                if (place.leavingId !== Constants.emptyId) {
                    p.leaving = _this.getOrCreateTravelById(place.leavingId, travels);
                    p.leaving.from = p;
                }
                _this.places.push(p);
            });
        };
        PlacesManager.prototype.getOrCreateTravelById = function (travelId, travelsInput) {
            var cachedTravel = _.find(this.travels, function (travel) {
                return travel.id === travelId;
            });
            if (cachedTravel) {
                return cachedTravel;
            }
            var newTravel = _.find(travelsInput, function (travel) {
                return travel.id === travelId;
            });
            var newTravelObj = this.mapTravel(newTravel, null, null);
            this.travels.push(newTravelObj);
            return newTravelObj;
        };
        PlacesManager.prototype.getTravelById = function (id) {
            return _.find(this.travels, function (travel) { return travel.id === id; });
        };
        PlacesManager.prototype.getLastPlace = function () {
            var lastPlace = _.max(this.places, function (place) { return place.orderNo; });
            return lastPlace;
        };
        return PlacesManager;
    })();
    Trip.PlacesManager = PlacesManager;
})(Trip || (Trip = {}));
//# sourceMappingURL=PlacesManager.js.map