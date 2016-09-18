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
            _super.apply(this, arguments);
            this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");
            this.nowTabConst = "nowTab";
            this.cityTabConst = "cityTab";
            this.emptyProps = [];
        }
        TravelBView.prototype.init = function () {
            var _this = this;
            this.checkinWin = new TravelB.CheckinWin();
            this.filter = new TravelB.Filter();
            this.filter.onFilterSelChanged = function () {
                _this.displayData();
            };
            this.regEvents();
            this.createMainTab();
            this.createMap();
            var status = new TravelB.Status();
            status.refresh();
            this.chat = new Views.Chat();
            this.chat.refreshAll();
            this.reacts = new Views.CheckinReacts();
            this.reacts.onStartChat = function (callback) {
                _this.chat.refreshAll(function () {
                    callback();
                });
            };
            this.reacts.refreshReacts();
            this.notifs = new Views.NotifRefresh();
            this.notifs.onRefresh = function (callback) {
                _this.reacts.refreshReacts(function () {
                    _this.chat.refreshAll(function () {
                        callback();
                    });
                });
            };
            this.notifs.startRefresh();
            this.props = new TravelB.EmptyProps();
            this.props.generateProps(this.emptyProps);
        };
        TravelBView.prototype.createMainTab = function () {
            var _this = this;
            this.tabs = new TravelB.MenuTabs($(".main-menu .tbl"));
            this.tabs.onBeforeSwitch = function () {
                $("#theCont").html("");
            };
            this.tabs.addTab(this.nowTabConst, "I am here and now", function () {
                _this.createNowCheckinsFnc();
            });
            this.tabs.addTab(this.cityTabConst, "I will be in a city", function () {
                _this.createCityCheckinsFnc();
            });
            this.tabs.create("<div class=\"btn-cont\"></div>");
        };
        TravelBView.prototype.createCityCheckinsFnc = function () {
            this.filter.initCity();
            this.cityFncs = new TravelB.CityTab();
            this.displayCityCheckins();
        };
        TravelBView.prototype.createNowCheckinsFnc = function () {
            this.filter.initNow();
            this.nowFncs = new TravelB.NowTab();
            this.displayNowCheckins();
            this.displayMeetingPoints();
        };
        TravelBView.prototype.regEvents = function () {
            var _this = this;
            $("#checkin").click(function (e) {
                e.preventDefault();
                if (_this.tabs.activeTabId === _this.nowTabConst) {
                    _this.checkinWin.showNowCheckin();
                }
                else {
                    _this.checkinWin.showCityCheckin(null);
                }
            });
        };
        TravelBView.prototype.displayNowCheckins = function () {
            var _this = this;
            var prms = this.getBaseQuery();
            if (prms === null) {
                return;
            }
            Views.ViewBase.currentView.apiGet("CheckinNow", prms, function (checkins) {
                var fc = _.reject(checkins, function (c) { return c.userId === Views.ViewBase.currentUserId; });
                _this.nowFncs.genCheckinsList(fc);
                _this.mapCheckins.genCheckins(fc, CheckinType.Now);
            });
        };
        TravelBView.prototype.displayCityCheckins = function () {
            var _this = this;
            var prms = this.getBaseQuery();
            if (prms === null) {
                return;
            }
            prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateFrom)]);
            prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateTo)]);
            Views.ViewBase.currentView.apiGet("CheckinCity", prms, function (checkins) {
                if (_this.mapCheckins) {
                    _this.mapCheckins.clearMarkers();
                }
                _this.cityFncs.genCheckinsList(checkins);
                _this.mapCheckins.genCheckins(checkins, CheckinType.City);
            });
        };
        TravelBView.prototype.getBaseQuery = function () {
            if (!this.currentBounds) {
                return null;
            }
            var prms = [
                ["latSouth", this.currentBounds._southWest.lat],
                ["lngWest", this.currentBounds._southWest.lng],
                ["latNorth", this.currentBounds._northEast.lat],
                ["lngEast", this.currentBounds._northEast.lng],
                ["type", "query"]
            ];
            this.filter.langs.forEach(function (l) {
                prms.push(["lang", l]);
            });
            if (this.filter.selectedFilter) {
                prms.push(["filter", this.filter.selectedFilter.join(",")]);
            }
            return prms;
        };
        TravelBView.prototype.displayMeetingPoints = function () {
            var _this = this;
            var prms = this.getBaseQuery();
            Views.ViewBase.currentView.apiGet("MeetingPoint", prms, function (points) {
                _this.nowFncs.genMeetingPoints(points);
                _this.mapCheckins.genMPs(points);
            });
        };
        TravelBView.prototype.displayData = function () {
            if (this.tabs.activeTabId === this.nowTabConst) {
                this.displayNowCheckins();
                this.displayMeetingPoints();
            }
            if (this.tabs.activeTabId === this.cityTabConst) {
                this.displayCityCheckins();
            }
        };
        TravelBView.prototype.initPlaceDD = function (providers, selObj) {
            var c = new Common.PlaceSearchConfig();
            c.providers = providers;
            c.selOjb = selObj;
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            var combo = new Common.PlaceSearchBox(c);
            return combo;
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
        TravelBView.prototype.onMapCreated = function (mapObj) {
            var _this = this;
            this.mapCheckins = new TravelB.MapCheckins(mapObj);
            this.getLocation(function (lat, lng) {
                _this.setPlaceCenter(lat, lng);
            });
            var search = this.initPlaceDD("2", $("#searchCity"));
            search.onPlaceSelected = function (p, e) {
                _this.setPlaceCenter(e.Coordinates.Lat, e.Coordinates.Lng);
            };
        };
        TravelBView.prototype.onMapCenterChanged = function (c, bounds) {
            this.currentBounds = bounds;
            this.displayData();
        };
        TravelBView.prototype.setPlaceCenter = function (lat, lng) {
            this.travelMap.mapObj.setView([lat, lng], 12);
        };
        TravelBView.prototype.getLocation = function (callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (p) {
                    callback(p.coords.latitude, p.coords.longitude);
                });
            }
            else {
                var lat = geoip_latitude();
                var lng = geoip_longitude();
                callback(lat, lng);
            }
        };
        return TravelBView;
    }(Views.ViewBase));
    Views.TravelBView = TravelBView;
    var StrOpers = (function () {
        function StrOpers() {
        }
        StrOpers.formatDate = function (date) {
            return date.Day + "." + date.Month + "." + date.Year;
        };
        StrOpers.langsToFlags = function (langs, homeCountry) {
            var out = [];
            langs.forEach(function (l) {
                var lang = l.toLowerCase();
                if (lang === "en") {
                    if (homeCountry.toLowerCase() === "us") {
                        out.push("us");
                    }
                    else {
                        out.push("gb");
                    }
                }
                else {
                    out.push(lang);
                }
            });
            return out;
        };
        StrOpers.getActivityStrArray = function (vals) {
            var outStrs = [];
            var items = TravelB.TravelBUtils.wantDoDB();
            vals.forEach(function (id) {
                var item = _.find(items, function (i) { return i.id === id; });
                outStrs.push(item.text);
            });
            return outStrs;
        };
        StrOpers.getActivityStr = function (vals) {
            var outStrs = [];
            var items = TravelB.TravelBUtils.wantDoDB();
            vals.forEach(function (id) {
                var item = _.find(items, function (i) { return i.id === id; });
                outStrs.push(item.text);
            });
            return outStrs.join(", ");
        };
        StrOpers.getInterestsStr = function (vals) {
            var outStrs = [];
            var items = TravelB.TravelBUtils.interestsDB();
            vals.forEach(function (id) {
                var item = _.find(items, function (i) { return i.id === id; });
                outStrs.push(item.text);
            });
            return outStrs.join(", ");
        };
        StrOpers.getGenderStr = function (val) {
            if (val === 0) {
                return "Man";
            }
            if (val === 1) {
                return "Woman";
            }
            return "Any gender";
        };
        StrOpers.getMultiStr = function (multi) {
            if (multi) {
                return "More people can come";
            }
            return "Prefer one single person";
        };
        return StrOpers;
    }());
    Views.StrOpers = StrOpers;
})(Views || (Views = {}));
//# sourceMappingURL=TravelBView.js.map