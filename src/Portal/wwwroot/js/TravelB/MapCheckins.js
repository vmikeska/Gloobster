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
                var marker = L.marker([coord.Lat, coord.Lng], { icon: _this.getVisitedPin() }).addTo(_this.mapObj);
                marker.on("click", function (e) {
                    _this.displayPopup(e.latlng, c.userId);
                });
                _this.markers.push(marker);
            });
        };
        MapCheckins.prototype.displayPopup = function (latlng, userId) {
            var _this = this;
            Views.ViewBase.currentView.apiGet("CheckinNow", [["id", userId]], function (checkin) {
                var d = new Date();
                var curYear = d.getFullYear();
                var context = {
                    id: checkin.userId,
                    name: checkin.displayName,
                    age: curYear - checkin.birthYear,
                    waitingFor: Views.TravelBView.getGenderStr(checkin.wantMeet),
                    wants: Views.TravelBView.getActivityStr(checkin.wantDo),
                    waitingMins: TravelB.TravelBUtils.waitingMins(checkin.waitingUntil)
                };
                var ppCont = _this.popupTemplate(context);
                var popup = new L.Popup();
                popup.setLatLng(latlng);
                popup.setContent(ppCont);
                _this.mapObj.openPopup(popup);
            });
        };
        MapCheckins.prototype.getVisitedPin = function () {
            if (this.visitedPin == null) {
                this.visitedPin = L.icon({
                    iconUrl: '../images/visited-ico.png',
                    iconSize: [26, 31],
                    iconAnchor: [13, 31],
                    popupAnchor: [-3, -76]
                });
            }
            return this.visitedPin;
        };
        return MapCheckins;
    }());
    TravelB.MapCheckins = MapCheckins;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=MapCheckins.js.map