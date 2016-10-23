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
            this.checkinWin = new TravelB.CheckinWin(this);
            this.checkinMenu = new TravelB.CheckinMenu(this);
            this.filter = new TravelB.Filter(this);
            this.filter.onFilterSelChanged = function () {
                _this.displayData();
            };
            this.regEvents();
            this.createMainTab();
            this.createMap();
            this.status = new TravelB.Status(this);
            this.status.refresh();
            this.chat = new TravelB.Chat(this);
            this.chat.refreshAll();
            this.reacts = new TravelB.CheckinReacts(this);
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
            this.props = new TravelB.EmptyProps(this);
            this.props.generateProps(this.emptyProps);
            $(".city-chck-cnt .city-link").click(function (e) {
                e.preventDefault();
                $("#cityTab").click();
            });
        };
        TravelBView.prototype.createMainTab = function () {
            var _this = this;
            this.tabs = new TravelB.MenuTabs($(".main-menu"));
            this.tabs.onBeforeSwitch = function () {
                $("#theCont").html("");
            };
            this.tabs.addTab({ id: this.nowTabConst, text: " " + this.t("MajorNowBtn", "jsTravelB"), customClass: "icon-clock" }, function () {
                _this.nowTabClicked();
            });
            this.tabs.addTab({ id: this.cityTabConst, text: " " + this.t("MajorCityBtn", "jsTravelB"), customClass: "icon-location-on-road" }, function () {
                _this.cityTabClicked();
            });
            this.tabs.create("<div class=\"btn-cont\"></div>");
        };
        TravelBView.prototype.nowTabClicked = function () {
            this.checkinMenu.setCheckinByTab(this.nowTabConst);
            this.createNowCheckinsFnc();
            $("#filterDateCont").hide();
            $("#cityCheckins").hide();
            $(".entities-filter").show();
            this.cityCheckinsCnt();
        };
        TravelBView.prototype.cityTabClicked = function () {
            this.checkinMenu.setCheckinByTab(this.cityTabConst);
            this.createCityCheckinsFnc();
            $(".city-chck-cnt").hide();
            $("#filterDateCont").show();
            $("#cityCheckins").show();
            $(".entities-filter").hide();
        };
        TravelBView.prototype.createCityCheckinsFnc = function () {
            $(".meeting-points").hide();
            this.filter.initCity();
            this.cityFncs = new TravelB.CityTab();
            this.displayCityCheckins();
        };
        TravelBView.prototype.createNowCheckinsFnc = function () {
            this.filter.initNow();
            $(".meeting-points").show();
            this.nowFncs = new TravelB.NowTab();
            this.displayNowCheckins();
            this.displayMeetingPoints();
        };
        TravelBView.prototype.regEvents = function () {
            var _this = this;
            $("#fShowPeople").change(function (e) {
                _this.displayNowCheckins();
            });
            $("#fPoints").change(function (e) {
                _this.displayMeetingPoints();
            });
        };
        TravelBView.prototype.displayNowCheckins = function () {
            var _this = this;
            var prms = this.getBaseQuery();
            if (prms === null) {
                return;
            }
            var showPeople = $("#fShowPeople").prop("checked");
            if (showPeople) {
                Views.ViewBase.currentView.apiGet("CheckinNow", prms, function (checkins) {
                    _this.nowFncs.genCheckinsList(checkins);
                    _this.mapCheckins.genCheckins(checkins, CheckinType.Now);
                });
            }
            else {
                this.mapCheckins.clearCheckins();
            }
        };
        TravelBView.prototype.cityCheckinsCnt = function () {
            var prms = this.getBoundsQuery();
            if (prms === null) {
                return;
            }
            var now = TravelB.DateUtils.jsDateToMyDate(new Date());
            prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(now)]);
            prms.push(["toDate", TravelB.DateUtils.myDateToTrans(now)]);
            prms.push(["type", "count"]);
            Views.ViewBase.currentView.apiGet("CheckinCity", prms, function (cnt) {
                if (cnt > 0) {
                    $(".city-chck-cnt").show();
                }
                else {
                    $(".city-chck-cnt").hide();
                }
                $("#cityCount").html(cnt);
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
            Views.ViewBase.currentView.apiGet("CheckinCity", prms, function (cs) {
                var fc = _.reject(cs, function (c) { return c.userId === Views.ViewBase.currentUserId; });
                _this.cityFncs.genCheckinsList(fc);
                _this.mapCheckins.genCheckins(fc, CheckinType.City);
            });
        };
        TravelBView.prototype.getBoundsQuery = function () {
            if (!this.currentBounds) {
                return null;
            }
            var prms = [
                ["latSouth", this.currentBounds._southWest.lat],
                ["lngWest", this.currentBounds._southWest.lng],
                ["latNorth", this.currentBounds._northEast.lat],
                ["lngEast", this.currentBounds._northEast.lng]
            ];
            return prms;
        };
        TravelBView.prototype.getBaseQuery = function () {
            if (!this.currentBounds) {
                return null;
            }
            var prms = this.getBoundsQuery();
            prms.push(["type", "query"]);
            prms.push(["filter", this.filter.selectedFilter]);
            this.filter.langs.forEach(function (l) {
                prms.push(["lang", l]);
            });
            if (this.filter.wds) {
                prms.push(["wds", this.filter.wds.join(",")]);
            }
            return prms;
        };
        TravelBView.prototype.displayMeetingPoints = function () {
            var _this = this;
            var prms = this.getBaseQuery();
            var showMPs = $("#fPoints").prop("checked");
            Views.ViewBase.currentView.apiGet("MeetingPoint", prms, function (points) {
                _this.nowFncs.genMeetingPoints(points);
                if (showMPs) {
                    _this.mapCheckins.genMPs(points);
                }
            });
            if (!showMPs && this.mapCheckins) {
                this.mapCheckins.clearMPs();
            }
        };
        TravelBView.prototype.displayData = function () {
            if (this.tabs.activeTabId === this.nowTabConst) {
                this.displayNowCheckins();
                this.displayMeetingPoints();
                this.cityCheckinsCnt();
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
                _this.mapCenter = c;
                _this.refreshMap();
            };
            this.travelMap.create("map");
        };
        TravelBView.prototype.refreshMap = function () {
            var bounds = this.travelMap.mapObj.getBounds();
            this.onMapCenterChanged(this.mapCenter, bounds);
        };
        TravelBView.prototype.onMapCreated = function (mapObj) {
            var _this = this;
            this.mapObj = mapObj;
            this.mapCheckins = new TravelB.MapCheckins(this, mapObj);
            TravelB.UserLocation.getLocation(function (res) {
                TravelB.UserLocation.setCurrentLocation(res.lat, res.lng);
                _this.setPlaceCenter(res.lat, res.lng);
                if (res.exactLoc) {
                    _this.createUserMarker(res.lat, res.lng);
                    _this.startUserTracking();
                }
                if (res.userDenied) {
                    $(".no-location-perm").show();
                }
            });
            var $sc = $("#searchCity");
            this.initPlaceDD("2", $sc);
            $sc.change(function (e, p, c) {
                _this.setPlaceCenter(c.Coordinates.Lat, c.Coordinates.Lng);
            });
        };
        TravelBView.prototype.createUserMarker = function (lat, lng) {
            this.youMarker = L.marker([lat, lng], { title: "Your position" }).addTo(this.mapObj);
        };
        TravelBView.prototype.clearUserMarker = function () {
            if (this.youMarker) {
                this.mapObj.removeLayer(this.youMarker);
                this.youMarker = null;
            }
        };
        TravelBView.prototype.startUserTracking = function () {
            var _this = this;
            navigator.geolocation.watchPosition(function (pos) {
                TravelB.UserLocation.setCurrentLocation(pos.coords.latitude, pos.coords.longitude);
                _this.clearUserMarker();
                _this.createUserMarker(pos.coords.latitude, pos.coords.longitude);
            }, function (error) {
                _this.clearUserMarker();
            });
        };
        TravelBView.prototype.onMapCenterChanged = function (c, bounds) {
            this.currentBounds = bounds;
            this.displayData();
        };
        TravelBView.prototype.setPlaceCenter = function (lat, lng) {
            this.travelMap.mapObj.setView([lat, lng], 12);
        };
        return TravelBView;
    }(Views.ViewBase));
    Views.TravelBView = TravelBView;
    var StrOpers = (function () {
        function StrOpers() {
        }
        StrOpers.formatDate = function (date) {
            var utc = Date.UTC(date.Year, date.Month - 1, date.Day);
            var d = moment.utc(utc).format("L");
            return d;
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