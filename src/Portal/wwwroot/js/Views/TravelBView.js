var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var EmptyProps = (function () {
        function EmptyProps() {
            this.formTemp = Views.ViewBase.currentView.registerTemplate("settings-template");
            this.setTemp = Views.ViewBase.currentView.registerTemplate("settingsStat-template");
        }
        EmptyProps.prototype.generateProps = function (props) {
            var _this = this;
            this.$cont = $("#reqPropCont");
            var $form = $(this.formTemp());
            this.$table = $form.find("table");
            this.appSignals(this.$table);
            this.$cont.html($form);
            if (props.length > 0) {
                this.$cont.show();
            }
            props.forEach(function (prop) {
                _this.visible(prop, $form);
                if (prop === "HasProfileImage") {
                    Views.SettingsUtils.registerAvatarFileUpload("avatarFile", function () {
                        _this.validate(true, "HasProfileImage");
                    });
                }
                if (prop === "FirstName") {
                    Views.SettingsUtils.registerEdit("firstName", "FirstName", function (value) {
                        _this.validate((value.length > 0), "FirstName");
                        return { name: value };
                    });
                }
                if (prop === "LastName") {
                    Views.SettingsUtils.registerEdit("lastName", "LastName", function (value) {
                        _this.validate((value.length > 0), "LastName");
                        return { name: value };
                    });
                }
                if (prop === "BirthYear") {
                    Views.SettingsUtils.registerEdit("birthYear", "BirthYear", function (value) {
                        _this.validate((value.length === 4), "BirthYear");
                        return { year: value };
                    });
                }
                if (prop === "Gender") {
                    Views.SettingsUtils.registerCombo("gender", function (val) {
                        _this.validate((val !== Gender.N), "Gender");
                        return { propertyName: "Gender", values: { gender: val } };
                    });
                    Common.DropDown.registerDropDown($("#gender"));
                }
                if (prop === "FamilyStatus") {
                    Views.SettingsUtils.registerCombo("familyStatus", function (val) {
                        _this.validate((val !== 0), "FamilyStatus");
                        return { propertyName: "FamilyStatus", values: { status: val } };
                    });
                    Common.DropDown.registerDropDown($("#familyStatus"));
                }
                if (prop === "HomeLocation") {
                    Views.SettingsUtils.registerLocationCombo("homeCity", "HomeLocation", function () {
                        _this.validate(true, "HomeLocation");
                    });
                }
                if (prop === "Languages") {
                    var tl = Views.SettingsUtils.initLangsTagger([]);
                    tl.onChange = function (items) {
                        _this.validate(items.length > 0, "Languages");
                    };
                }
                if (prop === "Interests") {
                    var ti = Views.SettingsUtils.initInterestsTagger([]);
                    ti.onChange = function (items) {
                        _this.validate(items.length > 0, "Interests");
                    };
                }
            });
        };
        EmptyProps.prototype.validate = function (res, name) {
            if (res) {
                this.okStat(name);
            }
            else {
                this.koStat(name);
            }
        };
        EmptyProps.prototype.okStat = function (name) {
            var $tr = $("#tr" + name);
            var $stat = $tr.find(".stat");
            $stat.attr("src", "../images/tb/ok.png");
            $tr.find(".close").show();
            if (this.$table.find("tr").length === 0) {
                this.$cont.hide();
            }
        };
        EmptyProps.prototype.koStat = function (name) {
            var $tr = $("#tr" + name);
            var $stat = $tr.find(".stat");
            $stat.attr("src", "../images/tb/ko.png");
            $tr.find(".close").hide();
        };
        EmptyProps.prototype.appSignals = function ($table) {
            var _this = this;
            var trs = $table.find("tr").toArray();
            trs.forEach(function (tr) {
                var $tr = $(tr);
                var $stat = $(_this.setTemp());
                $tr.append($stat);
                $tr.find(".close").click(function (e) {
                    e.preventDefault();
                    $tr.remove();
                });
            });
        };
        EmptyProps.prototype.visible = function (name, $form) {
            var tr = $form.find("#tr" + name);
            tr.show();
        };
        return EmptyProps;
    }());
    Views.EmptyProps = EmptyProps;
    var TravelBView = (function (_super) {
        __extends(TravelBView, _super);
        function TravelBView() {
            _super.apply(this, arguments);
            this.nowTabConst = "nowTab";
            this.cityTabConst = "cityTab";
            this.emptyProps = [];
        }
        TravelBView.prototype.init = function () {
            var _this = this;
            this.filter = new TravelB.Filter();
            this.filter.onFilterSelChanged = function () {
                _this.displayData();
            };
            this.regEvents();
            this.hereAndNowTemplate = this.registerTemplate("hereAndNowTabCont-template");
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
            this.props = new EmptyProps();
            this.props.generateProps(this.emptyProps);
        };
        TravelBView.prototype.createMainTab = function () {
            var _this = this;
            this.tabs = new TravelB.Tabs($("#mainTab"), "main", 55);
            this.tabs.onBeforeSwitch = function () {
                $("#theCont").html("");
            };
            this.tabs.addTab(this.nowTabConst, "Here and now", function () {
                _this.createNowCheckinsFnc();
            });
            this.tabs.addTab(this.cityTabConst, "Check to a city", function () {
                _this.createCityCheckinsFnc();
            });
            this.tabs.create();
        };
        TravelBView.prototype.createCityCheckinsFnc = function () {
            this.filter.initCity();
            this.cityFncs = new TravelB.CityTab();
            this.displayCityCheckins();
        };
        TravelBView.prototype.createNowCheckinsFnc = function () {
            var _this = this;
            this.filter.initNow();
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
            prms.push(["fromDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateFrom)]);
            prms.push(["toDate", TravelB.DateUtils.myDateToTrans(this.filter.filterDateTo)]);
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