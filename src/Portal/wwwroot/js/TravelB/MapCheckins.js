var TravelB;
(function (TravelB) {
    var MapCheckins = (function () {
        function MapCheckins(view, mapObj) {
            this.popupTemplateNow = Views.ViewBase.currentView.registerTemplate("userPopupNow-template");
            this.popupTemplateCity = Views.ViewBase.currentView.registerTemplate("userPopupCity-template");
            this.popupMP = Views.ViewBase.currentView.registerTemplate("mpPopup-template");
            this.view = view;
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
        MapCheckins.prototype.groupByPlace = function (cs) {
            var csgs = _.groupBy(cs, function (c) { return c.waitingAtId; });
            var o = [];
            for (var key in csgs) {
                if (csgs.hasOwnProperty(key)) {
                    o.push(csgs[key]);
                }
            }
            return o;
        };
        MapCheckins.prototype.addPixelsToCoord = function (lat, lng, xPixelsOffset, yPixelsOffset, map) {
            var latLng = L.latLng([lat, lng]);
            var point = map.latLngToContainerPoint(latLng);
            var newPoint = L.point([point.x + xPixelsOffset, point.y + yPixelsOffset]);
            var newLatLng = map.containerPointToLatLng(newPoint);
            return newLatLng;
        };
        MapCheckins.prototype.genCheckins = function (cs, type) {
            var _this = this;
            this.clearCheckins();
            this.checkinsLayer = new L.LayerGroup();
            var csgs = this.groupByPlace(cs);
            csgs.forEach(function (csg) {
                csg.forEach(function (c, i) {
                    var coord = c.waitingCoord;
                    var markerCont = MapPins.getCheckinCont(c);
                    var newCoord = _this.addPixelsToCoord(coord.Lat, coord.Lng, i * 30, 0, _this.mapObj);
                    var marker = L.marker(newCoord, { icon: markerCont });
                    _this.checkinsLayer.addLayer(marker);
                    marker.on("click", function (e) {
                        if (type === CheckinType.Now) {
                            _this.displayPopupNow(e.latlng, c.userId);
                        }
                        if (type === CheckinType.City) {
                            _this.displayPopupCity(e.latlng, c.id);
                        }
                    });
                });
            });
            this.mapObj.addLayer(this.checkinsLayer);
        };
        MapCheckins.prototype.genMPs = function (mps) {
            var _this = this;
            this.clearMPs();
            this.clusterLayerMPs = L.markerClusterGroup();
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
            this.view.apiGet("CheckinCity", [["type", "id"], ["id", cid]], function (c) {
                var context = TravelB.CheckinMapping.map(c, CheckinType.City);
                var ppCont = _this.popupTemplateCity(context);
                var popup = new L.Popup();
                popup.setLatLng(latlng);
                popup.setContent(ppCont);
                _this.mapObj.openPopup(popup);
                $(".chat-btn").click(function (e) {
                    e.preventDefault();
                    _this.view.hasFullReg(function () {
                        var $t = $(e.delegateTarget);
                        var uid = $t.data("uid");
                        var link = window["messagesLink"] + "/" + uid;
                        window.open(link, "_blank");
                    });
                });
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
                var context = TravelB.CheckinMapping.map(c, CheckinType.Now);
                var ppCont = _this.popupTemplateNow(context);
                var popup = new L.Popup();
                popup.setLatLng(latlng);
                popup.setContent(ppCont);
                _this.mapObj.openPopup(popup);
                $(".chat-btn-popup").click(function (e) {
                    e.preventDefault();
                    _this.view.hasFullReg(function () {
                        var cr = new TravelB.CheckinReact();
                        var $t = $(e.delegateTarget);
                        var $c = $t.closest(".user-popup");
                        cr.askForChat($c.data("uid"), $c.data("cid"));
                    });
                });
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
        MapPins.manPinVal = null;
        MapPins.womanPinVal = null;
        MapPins.youPinVal = null;
        MapPins.mpPinVal = null;
        return MapPins;
    }());
    TravelB.MapPins = MapPins;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=MapCheckins.js.map