var TravelB;
(function (TravelB) {
    var MapCheckins = (function () {
        function MapCheckins(mapObj) {
            this.markers = [];
            this.mapObj = mapObj;
            this.popupTemplate = Views.ViewBase.currentView.registerTemplate("userPopup-template");
        }
        MapCheckins.prototype.clearMarkers = function () {
            var _this = this;
            this.markers.forEach(function (m) {
                _this.mapObj.removeLayer(m);
            });
            this.markers = [];
        };
        MapCheckins.prototype.genCheckins = function (checkins) {
            var _this = this;
            this.clearMarkers();
            checkins.forEach(function (c) {
                var coord = c.waitingCoord;
                var ico = MapPins.getByGender(c.gender);
                var marker = L.marker([coord.Lat, coord.Lng], { icon: ico }).addTo(_this.mapObj);
                marker.on("click", function (e) {
                    _this.displayPopup(e.latlng, c.userId);
                });
                _this.markers.push(marker);
            });
        };
        MapCheckins.prototype.genMPs = function (mps) {
            var _this = this;
            this.clearMarkers();
            mps.forEach(function (c) {
                var marker = L.marker([c.coord.Lat, c.coord.Lng], { icon: MapPins.mpPin() }).addTo(_this.mapObj);
                _this.markers.push(marker);
            });
        };
        MapCheckins.prototype.displayPopup = function (latlng, userId) {
            var _this = this;
            Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "id"], ["id", userId]], function (checkin) {
                var d = new Date();
                var curYear = d.getFullYear();
                var context = {
                    id: checkin.userId,
                    name: checkin.displayName,
                    age: curYear - checkin.birthYear,
                    waitingFor: Views.StrOpers.getGenderStr(checkin.wantMeet),
                    wants: Views.StrOpers.getActivityStr(checkin.wantDo),
                    waitingMins: TravelB.TravelBUtils.waitingMins(checkin.waitingUntil),
                    interests: Views.StrOpers.getInterestsStr(checkin.interests)
                };
                var ppCont = _this.popupTemplate(context);
                var popup = new L.Popup();
                popup.setLatLng(latlng);
                popup.setContent(ppCont);
                _this.mapObj.openPopup(popup);
            });
        };
        return MapCheckins;
    }());
    TravelB.MapCheckins = MapCheckins;
    var MapPins = (function () {
        function MapPins() {
        }
        MapPins.getByGender = function (gender) {
            if (gender === Gender.F) {
                return this.womanPin();
            }
            if (gender === Gender.M) {
                return this.manPin();
            }
            return null;
        };
        MapPins.mpPin = function () {
            if (this.mpPinVal == null) {
                this.mpPinVal = L.icon({
                    iconUrl: '../images/tb/mp.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                });
            }
            return this.mpPinVal;
        };
        MapPins.manPin = function () {
            if (this.manPinVal == null) {
                this.manPinVal = L.icon({
                    iconUrl: '../images/tb/man.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                });
            }
            return this.manPinVal;
        };
        MapPins.womanPin = function () {
            if (this.womanPinVal == null) {
                this.womanPinVal = L.icon({
                    iconUrl: '../images/tb/woman.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                });
            }
            return this.womanPinVal;
        };
        MapPins.youPin = function () {
            if (this.youPinVal == null) {
                this.youPinVal = L.icon({
                    iconUrl: '../images/tb/you.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                });
            }
            return this.youPinVal;
        };
        MapPins.manPinVal = null;
        MapPins.womanPinVal = null;
        MapPins.youPinVal = null;
        MapPins.mpPinVal = null;
        return MapPins;
    }());
    TravelB.MapPins = MapPins;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=MapCheckins.js.map