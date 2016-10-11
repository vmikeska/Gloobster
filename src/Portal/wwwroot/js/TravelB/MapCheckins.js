var TravelB;
(function (TravelB) {
    var MapCheckins = (function () {
        function MapCheckins(mapObj) {
            this.popupTemplateNow = Views.ViewBase.currentView.registerTemplate("userPopupNow-template");
            this.popupTemplateCity = Views.ViewBase.currentView.registerTemplate("userPopupCity-template");
            this.popupMP = Views.ViewBase.currentView.registerTemplate("mpPopup-template");
            this.mapObj = mapObj;
        }
        MapCheckins.prototype.clearCheckins = function () {
            if (this.checkinsLayer) {
                this.mapObj.removeLayer(this.checkinsLayer);
                this.checkinsLayer = null;
            }
        };
        MapCheckins.prototype.clearMPs = function () {
            if (this.clusterLayerMPs) {
                this.mapObj.removeLayer(this.clusterLayerMPs);
                this.clusterLayerMPs = null;
            }
        };
        MapCheckins.prototype.genCheckins = function (checkins, type) {
            var _this = this;
            this.clearCheckins();
            this.checkinsLayer = new L.LayerGroup();
            checkins.forEach(function (c) {
                var coord = c.waitingCoord;
                var isYou = c.userId === Views.ViewBase.currentUserId;
                if (isYou) {
                    var mc = MapPins.getYourCheckinCont(c);
                    var m = L.marker([coord.Lat, coord.Lng], { icon: mc, title: "Your checkin" });
                    m.on("click", function (e) {
                        var win = new TravelB.CheckinWin();
                        win.showNowCheckin();
                    });
                    _this.checkinsLayer.addLayer(m);
                }
                else {
                    var markerCont = MapPins.getCheckinCont(c);
                    var marker = L.marker([coord.Lat, coord.Lng], { icon: markerCont });
                    marker.on("click", function (e) {
                        if (type === CheckinType.Now) {
                            _this.displayPopupNow(e.latlng, c.userId);
                        }
                        if (type === CheckinType.City) {
                            _this.displayPopupCity(e.latlng, c.id);
                        }
                    });
                    _this.checkinsLayer.addLayer(marker);
                }
            });
            this.mapObj.addLayer(this.checkinsLayer);
        };
        MapCheckins.prototype.genMPs = function (mps) {
            var _this = this;
            this.clearMPs();
            this.clusterLayerMPs = new L.MarkerClusterGroup();
            mps.forEach(function (c) {
                var markerCont = MapPins.getMpCont(c);
                var marker = L.marker([c.coord.Lat, c.coord.Lng], { icon: markerCont });
                marker.on("click", function (e) {
                    _this.displayPopupMP(e.latlng, c.id);
                });
                _this.clusterLayerMPs.addLayer(marker);
            });
            this.mapObj.addLayer(this.clusterLayerMPs);
        };
        MapCheckins.prototype.displayPopupCity = function (latlng, cid) {
            var _this = this;
            Views.ViewBase.currentView.apiGet("CheckinCity", [["type", "id"], ["id", cid]], function (c) {
                var d = new Date();
                var curYear = d.getFullYear();
                var context = {
                    id: c.userId,
                    name: c.displayName,
                    age: curYear - c.birthYear,
                    languages: Views.StrOpers.langsToFlags(c.languages, c.homeCountry),
                    wmMan: ((c.wantMeet === TravelB.WantMeet.Man) || (c.wantMeet === TravelB.WantMeet.All)),
                    wmWoman: ((c.wantMeet === TravelB.WantMeet.Woman) || (c.wantMeet === TravelB.WantMeet.All)),
                    wmWomanGroup: ((c.wantMeet === TravelB.WantMeet.Woman) && c.multiPeopleAllowed),
                    wmManGroup: ((c.wantMeet === TravelB.WantMeet.Man) && c.multiPeopleAllowed),
                    wmMixGroup: ((c.wantMeet === TravelB.WantMeet.All) && c.multiPeopleAllowed),
                    wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
                    fromStr: Views.StrOpers.formatDate(c.fromDate),
                    toStr: Views.StrOpers.formatDate(c.toDate),
                    interests: Views.StrOpers.getInterestsStr(c.interests),
                    message: c.message
                };
                var ppCont = _this.popupTemplateCity(context);
                var popup = new L.Popup();
                popup.setLatLng(latlng);
                popup.setContent(ppCont);
                _this.mapObj.openPopup(popup);
            });
        };
        MapCheckins.prototype.displayPopupMP = function (latlng, id) {
            var _this = this;
            Views.ViewBase.currentView.apiGet("MeetingPoint", [["id", id]], function (mp) {
                var context = {
                    id: mp.id,
                    photoUrl: mp.photoUrl,
                    link: Common.GlobalUtils.getSocLink(mp.type, mp.sourceId),
                    name: mp.text,
                    categories: mp.categories,
                    peopleMet: mp.peopleMet
                };
                var ppCont = _this.popupMP(context);
                var popup = new L.Popup();
                popup.setLatLng(latlng);
                popup.setContent(ppCont);
                _this.mapObj.openPopup(popup);
            });
        };
        MapCheckins.prototype.displayPopupNow = function (latlng, userId) {
            var _this = this;
            Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "id"], ["id", userId]], function (c) {
                var d = new Date();
                var curYear = d.getFullYear();
                var context = {
                    id: c.userId,
                    name: c.displayName,
                    age: curYear - c.birthYear,
                    languages: Views.StrOpers.langsToFlags(c.languages, c.homeCountry),
                    wmMan: ((c.wantMeet === TravelB.WantMeet.Man) || (c.wantMeet === TravelB.WantMeet.All)),
                    wmWoman: ((c.wantMeet === TravelB.WantMeet.Woman) || (c.wantMeet === TravelB.WantMeet.All)),
                    wmWomanGroup: ((c.wantMeet === TravelB.WantMeet.Woman) && c.multiPeopleAllowed),
                    wmManGroup: ((c.wantMeet === TravelB.WantMeet.Man) && c.multiPeopleAllowed),
                    wmMixGroup: ((c.wantMeet === TravelB.WantMeet.All) && c.multiPeopleAllowed),
                    wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
                    waitingStr: TravelB.TravelBUtils.minsToTimeStr(TravelB.TravelBUtils.waitingMins(c.waitingUntil)),
                    interests: Views.StrOpers.getInterestsStr(c.interests),
                    message: c.message
                };
                var ppCont = _this.popupTemplateNow(context);
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
        MapPins.getCheckinCont = function (checkin) {
            var html = "<div class=\"thumb-cont border\">\n            <img src=\"/PortalUser/ProfilePicture_s/" + checkin.userId + "\">\n        </div>";
            var cont = L.divIcon({
                className: "checkin-icon",
                html: html,
                iconSize: [40, 40],
                iconAnchor: [20, 0]
            });
            return cont;
        };
        MapPins.getMpCont = function (mp) {
            var html = "<div class=\"cont\">\n\t\t\t\t\t\t\t\t<img src=\"" + mp.photoUrl + "\">\n\t\t\t\t\t\t</div>";
            var cont = L.divIcon({
                className: "mp-icon",
                html: html,
                iconSize: [40, 40],
                iconAnchor: [20, 0]
            });
            return cont;
        };
        MapPins.getYourCheckinCont = function (checkin) {
            var html = "<span>C</span>";
            var cont = L.divIcon({
                className: "checkin-you-icon",
                html: html,
                iconSize: [40, 40],
                iconAnchor: [20, 0]
            });
            return cont;
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