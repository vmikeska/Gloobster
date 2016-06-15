var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TravelBView = (function (_super) {
        __extends(TravelBView, _super);
        function TravelBView() {
            _super.call(this);
            this.regEvents();
            this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");
            this.switchTab(0);
            var status = new Status();
            status.refresh();
        }
        TravelBView.prototype.regEvents = function () {
            $("#checkin").click(function (e) {
                e.preventDefault();
                var win = new CheckinWin();
                win.showCheckinWin(false);
            });
        };
        TravelBView.prototype.switchTab = function (tab) {
            var $tabCont = $("#mainCont");
            this.travelMap = new TravelBMap();
            if (tab === 0) {
                var users = null;
                var $html = $(this.hereAndNowTemplate());
                $tabCont.html($html);
                this.travelMap.onMapCreated = function (mapObj) {
                    users = new TravelBUsers(mapObj);
                    users.onCheckinsChanged = function (checkins) {
                        var tabClass = new HereAndNowTab($html);
                        if (tabClass.currentTab === "checkins") {
                            tabClass.genPeopleList(checkins);
                        }
                    };
                };
                this.travelMap.onCenterChanged = function (c) {
                    if (users) {
                        users.getCheckins(c);
                    }
                };
                this.travelMap.create("map");
            }
        };
        TravelBView.getActivityStr = function (val) {
            if (val === 0) {
                return "WalkingTour";
            }
            if (val === 1) {
                return "Bar or Pub";
            }
            if (val === 2) {
                return "Date";
            }
            return "Other";
        };
        TravelBView.getGenderStr = function (val) {
            if (val === 0) {
                return "Man";
            }
            if (val === 1) {
                return "Woman";
            }
            return "All";
        };
        return TravelBView;
    }(Views.ViewBase));
    Views.TravelBView = TravelBView;
    var Status = (function () {
        function Status() {
            this.template = Views.ViewBase.currentView.registerTemplate("status-template");
        }
        Status.prototype.refresh = function () {
            var _this = this;
            var $cont = $("#statusCont");
            Views.ViewBase.currentView.apiGet("TravelBCheckin", [["me", "true"]], function (r) {
                if (!r) {
                    $cont.html("No status");
                }
                var context = {
                    placeName: r.waitingAtText,
                    wantMeetName: TravelBView.getGenderStr(r.wantMeet),
                    wantDoName: TravelBView.getActivityStr(r.wantDo)
                };
                var $html = $(_this.template(context));
                $html.click(function (e) {
                    e.preventDefault();
                    _this.editClick();
                });
                $cont.html($html);
            });
        };
        Status.prototype.editClick = function () {
            var win = new CheckinWin();
            win.showCheckinWin(false);
        };
        return Status;
    }());
    Views.Status = Status;
    var HereAndNowTab = (function () {
        function HereAndNowTab($html) {
            var _this = this;
            this.currentTab = "checkins";
            this.userTemplate = Views.ViewBase.currentView.registerTemplate("checkinUserItem-template");
            var btnPeople = $html.find("#tabPeopleBtn");
            var btnPoints = $html.find("#tabPointsBtn");
            btnPeople.click(function (e) {
                e.preventDefault();
                _this.tabClicked("checkins");
            });
            btnPoints.click(function (e) {
                e.preventDefault();
                _this.tabClicked("points");
            });
            this.$listCont = $html.find(".listCont");
        }
        HereAndNowTab.prototype.tabClicked = function (type) {
            this.currentTab = type;
            if (type === "checkins") {
            }
            if (type === "points") {
            }
        };
        HereAndNowTab.prototype.genPeopleList = function (checkins) {
            var _this = this;
            this.$listCont.html("");
            var d = new Date();
            var curYear = d.getFullYear();
            checkins.forEach(function (p) {
                var context = {
                    name: p.displayName,
                    age: curYear - p.birthYear,
                    waitingFor: TravelBView.getGenderStr(p.wantMeet),
                    wants: TravelBView.getActivityStr(p.wantDo)
                };
                var $u = $(_this.userTemplate(context));
                _this.$listCont.append($u);
            });
        };
        return HereAndNowTab;
    }());
    Views.HereAndNowTab = HereAndNowTab;
    var TravelBUsers = (function () {
        function TravelBUsers(mapObj) {
            this.markers = [];
            this.mapObj = mapObj;
        }
        TravelBUsers.prototype.getCheckins = function (c) {
            var _this = this;
            var bounds = this.mapObj.getBounds();
            var prms = [
                ["latSouth", bounds._southWest.lat],
                ["lngWest", bounds._southWest.lng],
                ["latNorth", bounds._northEast.lat],
                ["lngEast", bounds._northEast.lng]
            ];
            Views.ViewBase.currentView.apiGet("TravelBCheckin", prms, function (r) {
                if (_this.onCheckinsChanged) {
                    _this.onCheckinsChanged(r);
                }
                _this.genCheckins(r);
                _this.checkins = r;
            });
        };
        TravelBUsers.prototype.clearMarkers = function () {
            var _this = this;
            this.markers.forEach(function (m) {
                _this.mapObj.removeLayer(m);
            });
            this.markers = [];
        };
        TravelBUsers.prototype.genCheckins = function (users) {
            var _this = this;
            this.clearMarkers();
            users.forEach(function (u) {
                var coord = u.waitingCoord;
                var marker = L.marker([coord.Lat, coord.Lng], { icon: _this.getVisitedPin() }).addTo(_this.mapObj);
                _this.markers.push(marker);
            });
        };
        TravelBUsers.prototype.getVisitedPin = function () {
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
        return TravelBUsers;
    }());
    Views.TravelBUsers = TravelBUsers;
    var TravelBMap = (function () {
        function TravelBMap() {
        }
        TravelBMap.prototype.create = function (mapId) {
            var _this = this;
            this.mapCreator = new Maps.MapsCreatorMapBox2D();
            this.mapCreator.onCenterChanged = function (c) {
                if (_this.onCenterChanged) {
                    _this.mapMoved(function () {
                        _this.onCenterChanged(c);
                    });
                }
            };
            this.mapCreator.setRootElement(mapId);
            this.mapCreator.show(function (mapObj) { return _this.onMapCreated(mapObj); });
        };
        TravelBMap.prototype.mapMoved = function (callback) {
            var _this = this;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = null;
                callback();
            }, 200);
        };
        return TravelBMap;
    }());
    Views.TravelBMap = TravelBMap;
    var CheckinWin = (function () {
        function CheckinWin() {
            this.nowTab = "nowTab";
            this.futureTab = "futureTab";
            this.activeTab = this.nowTab;
            this.registerTemplates();
            this.ddReg = new Common.DropDown();
        }
        CheckinWin.prototype.showCheckinWin = function (isNew) {
            var _this = this;
            this.$html = $(this.checkinWindowDialog());
            $("body").append(this.$html);
            this.$html.fadeIn();
            var $cont = $("#checkinWinCont");
            this.ddReg.registerDropDown(this.$html.find("#fromAge"));
            this.ddReg.registerDropDown(this.$html.find("#toAge"));
            this.$html.find("#nowTabBtn").click(function (e) {
                e.preventDefault();
                _this.switchCheckinTabs(_this.nowTab);
            });
            this.$html.find("#futureTabBtn").click(function (e) {
                e.preventDefault();
                _this.switchCheckinTabs(_this.futureTab);
            });
            this.wpCombo = this.initPlaceDD("1,0,4", this.$html.find("#waitingPlace"));
            this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));
            this.$html.find("#submitCheckin").click(function (e) {
                e.preventDefault();
                _this.callServer();
            });
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.$html.fadeOut();
            });
            $cont.html(this.$html);
        };
        CheckinWin.prototype.callServer = function () {
            var _this = this;
            var checkinType = (this.activeTab === this.nowTab) ? 0 : 1;
            var combo = (this.activeTab === this.nowTab) ? this.wpCombo : this.wcCombo;
            var data = {
                wantDo: $('input[name=wantDo]:checked').val(),
                wantMeet: $('input[name=wantMeet]:checked').val(),
                multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
                fromAge: $("#fromAge input").val(),
                toAge: $("#toAge input").val(),
                minsWaiting: $("#minsWaiting").val(),
                fromDate: $("#fromDate").val(),
                toDate: $("#toDate").val(),
                checkinType: checkinType,
                waitingAtId: combo.sourceId,
                waitingAtType: combo.sourceType,
                waitingAtText: combo.lastText,
                waitingCoord: combo.coord
            };
            Views.ViewBase.currentView.apiPost("TravelBCheckin", data, function (r) {
                var status = new Status();
                status.refresh();
                _this.$html.fadeOut();
            });
        };
        CheckinWin.prototype.registerTemplates = function () {
            this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");
        };
        CheckinWin.prototype.initPlaceDD = function (providers, selObj) {
            var c = new Common.PlaceSearchConfig();
            c.providers = providers;
            c.selOjb = selObj;
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            var combo = new Common.PlaceSearchBox(c);
            return combo;
        };
        CheckinWin.prototype.switchCheckinTabs = function (tab) {
            $("#" + this.nowTab).hide();
            $("#" + this.futureTab).hide();
            $("#" + tab).show();
            this.activeTab = tab;
        };
        return CheckinWin;
    }());
    Views.CheckinWin = CheckinWin;
})(Views || (Views = {}));
//# sourceMappingURL=TravelBView.js.map