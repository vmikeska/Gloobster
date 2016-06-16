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
            this.hereAndNowTabConst = "hereAndNowTab";
            this.regEvents();
            this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");
            this.createMainTab();
            this.createMap();
            var status = new TravelB.Status();
            status.refresh();
        }
        TravelBView.prototype.createMainTab = function () {
            var _this = this;
            this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);
            this.tabs.onBeforeSwitch = function () {
                $("#theCont").html("");
            };
            this.tabs.addTab(this.hereAndNowTabConst, "Here and now", function () {
                _this.createCheckinsFnc();
            });
            this.tabs.addTab("toCityCheckTab", "Check to a city", function () {
                _this.createCityCheckinsFnc();
            });
            this.tabs.create();
        };
        TravelBView.prototype.createCityCheckinsFnc = function () {
            $("#theCont").html("city checkins");
        };
        TravelBView.prototype.createCheckinsFnc = function () {
            var _this = this;
            var $html = $(this.hereAndNowTemplate());
            $("#theCont").html($html);
            this.hereAndNowFuncs = new TravelB.HereAndNowTab();
            this.hereAndNowFuncs.onPlacesCheckins = function () {
                _this.displayPlacesCheckins();
            };
            this.hereAndNowFuncs.onMeetingPoints = function () {
                _this.displayMeetingPoints();
            };
            this.hereAndNowFuncs.onBeforeSwitch = function () {
                if (_this.mapCheckins) {
                    _this.mapCheckins.clearMarkers();
                }
            };
            this.hereAndNowFuncs.createTab();
        };
        TravelBView.prototype.regEvents = function () {
            $("#checkin").click(function (e) {
                e.preventDefault();
                var win = new TravelB.CheckinWin();
                win.showNowCheckin();
            });
        };
        TravelBView.prototype.onMapCreated = function (mapObj) {
            this.mapCheckins = new TravelB.MapCheckins(mapObj);
        };
        TravelBView.prototype.onMapCenterChanged = function (c, bounds) {
            this.currentBounds = bounds;
            this.displayData();
        };
        TravelBView.prototype.displayPlacesCheckins = function () {
            var _this = this;
            if (!this.currentBounds) {
                return;
            }
            var prms = [
                ["latSouth", this.currentBounds._southWest.lat],
                ["lngWest", this.currentBounds._southWest.lng],
                ["latNorth", this.currentBounds._northEast.lat],
                ["lngEast", this.currentBounds._northEast.lng]
            ];
            Views.ViewBase.currentView.apiGet("CheckinNow", prms, function (checkins) {
                _this.hereAndNowFuncs.genPeopleList(checkins);
                _this.mapCheckins.genCheckins(checkins);
            });
        };
        TravelBView.prototype.displayMeetingPoints = function () {
            this.hereAndNowFuncs.genMeetingPoints();
        };
        TravelBView.prototype.displayData = function () {
            if (this.tabs.activeTabId === this.hereAndNowTabConst) {
                if (this.hereAndNowFuncs.tabs.activeTabId === this.hereAndNowFuncs.peopleTabConst) {
                    this.displayPlacesCheckins();
                }
                if (this.hereAndNowFuncs.tabs.activeTabId === this.hereAndNowFuncs.mpTabConst) {
                    this.displayMeetingPoints();
                }
            }
        };
        TravelBView.prototype.createMap = function () {
            var _this = this;
            this.travelMap = new TravelB.TravelBMap();
            this.travelMap.onMapCreated = function (mapObj) { return _this.onMapCreated(mapObj); };
            this.travelMap.onCenterChanged = function (c) {
                var bounds = _this.travelMap.mapObj.getBounds();
                _this.onMapCenterChanged(c, bounds);
            };
            this.travelMap.create("map");
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
})(Views || (Views = {}));
//# sourceMappingURL=TravelBView.js.map