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
            var _this = this;
            _super.call(this);
            this.nowTabConst = "nowTab";
            this.cityTabConst = "cityTab";
            this.selectedFilter = null;
            this.regEvents();
            this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");
            this.createMainTab();
            this.createMap();
            this.initFilter();
            this.initFilterDates();
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
        }
        TravelBView.prototype.createMainTab = function () {
            var _this = this;
            this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);
            var filterDateCont = $("#filterDateCont");
            this.tabs.onBeforeSwitch = function () {
                $("#theCont").html("");
            };
            this.tabs.addTab(this.nowTabConst, "Here and now", function () {
                _this.createCheckinsFnc();
                filterDateCont.hide();
            });
            this.tabs.addTab(this.cityTabConst, "Check to a city", function () {
                _this.createCityCheckinsFnc();
                filterDateCont.show();
            });
            this.tabs.create();
        };
        TravelBView.prototype.initFilterDates = function () {
            var _this = this;
            var fromDate = TravelB.DateUtils.jsDateToMyDate(new Date());
            var toDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 30));
            this.filterDateFrom = fromDate;
            this.filterDateTo = toDate;
            TravelB.DateUtils.initDatePicker($("#fromDateFilter"), fromDate, function (d) {
                _this.filterDateFrom = d;
                _this.displayData();
            });
            TravelB.DateUtils.initDatePicker($("#toDateFilter"), toDate, function (d) {
                _this.filterDateTo = d;
                _this.displayData();
            });
        };
        TravelBView.prototype.initFilter = function () {
            var _this = this;
            var items = TravelB.TravelBUtils.wantDoDB();
            var $c = $("#filterCont");
            var $ac = $("#allCheckins");
            items.forEach(function (i) {
                var $h = $("<input id=\"f_" + i.id + "\" type=\"checkbox\" /><label for=\"f_" + i.id + "\">" + i.text + "</label>");
                $c.append($h);
            });
            $(".filter").find("input").click(function (e) {
                var $t = $(e.target);
                var id = $t.attr("id");
                if (id === "allCheckins") {
                    if ($ac.prop("checked") === true) {
                        $("#filterCont").find("input").prop("checked", false);
                        _this.onFilterChanged(["all"]);
                    }
                    else {
                        _this.onFilterChanged(null);
                    }
                }
                else if (id.startsWith("f_")) {
                    if ($t.prop("checked") === true) {
                        $ac.prop("checked", false);
                    }
                    var selVals = [];
                    $c.find("input").each(function (i, c) {
                        var $c = $(c);
                        if ($c.prop("checked")) {
                            var id = $c.attr("id");
                            var val = id.split("_")[1];
                            selVals.push(val);
                        }
                    });
                    _this.onFilterChanged(selVals);
                }
            });
        };
        TravelBView.prototype.onFilterChanged = function (filter) {
            this.selectedFilter = filter;
            this.displayData();
        };
        TravelBView.prototype.createCityCheckinsFnc = function () {
            this.cityFncs = new TravelB.CityTab();
            this.displayCityCheckins();
        };
        TravelBView.prototype.createCheckinsFnc = function () {
            var _this = this;
            var $html = $(this.hereAndNowTemplate());
            $("#theCont").html($html);
            this.nowFncs = new TravelB.NowTab();
            this.nowFncs.onPlacesCheckins = function () {
                _this.displayNowCheckins();
            };
            this.nowFncs.onMeetingPoints = function () {
                _this.displayMeetingPoints();
            };
            this.nowFncs.onBeforeSwitch = function () {
                if (_this.mapCheckins) {
                    _this.mapCheckins.clearMarkers();
                }
            };
            this.nowFncs.createTab();
        };
        TravelBView.prototype.regEvents = function () {
            var _this = this;
            $("#checkin").click(function (e) {
                e.preventDefault();
                var win = new TravelB.CheckinWin();
                if (_this.tabs.activeTabId === _this.nowTabConst) {
                    win.showNowCheckin();
                }
                else {
                    win.showCityCheckin(null);
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
                _this.mapCheckins.genCheckins(fc);
            });
        };
        TravelBView.prototype.displayCityCheckins = function () {
            var _this = this;
            var prms = this.getBaseQuery();
            if (prms === null) {
                return;
            }
            prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filterDateFrom)]);
            prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filterDateTo)]);
            Views.ViewBase.currentView.apiGet("CheckinCity", prms, function (checkins) {
                _this.cityFncs.genCheckinsList(checkins);
                _this.mapCheckins.genCheckins(checkins);
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
                ["lngEast", this.currentBounds._northEast.lng]
            ];
            if (this.selectedFilter) {
                prms.push(["filter", this.selectedFilter.join(",")]);
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
                if (this.nowFncs.tabs.activeTabId === this.nowFncs.peopleTabConst) {
                    this.displayNowCheckins();
                }
                if (this.nowFncs.tabs.activeTabId === this.nowFncs.mpTabConst) {
                    this.displayMeetingPoints();
                }
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
            return "All";
        };
        return StrOpers;
    }());
    Views.StrOpers = StrOpers;
})(Views || (Views = {}));
//# sourceMappingURL=TravelBView.js.map