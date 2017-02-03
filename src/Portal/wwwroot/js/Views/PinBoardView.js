var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var PinBoardSearch = (function () {
        function PinBoardSearch($root, v) {
            this.baseProviders = this.provToStr([SourceType.City, SourceType.Country]);
            this.socProv = [SourceType.FB, SourceType.S4, SourceType.Yelp];
            this.socNetProviders = this.provToStr(this.socProv);
            this.itemTmp = Views.ViewBase.currentView.registerTemplate("place-tag-template");
            this.searchOnSoc = false;
            this.v = v;
            this.$root = $root;
            this.$input = $root.find("#citiesInput");
            this.$cities = $root.find("#sectCities");
            this.$countries = $root.find("#sectCountries");
            this.$socials = $root.find("#sectSocial");
            this.$results = $root.find(".place-search-results");
            this.regCallback();
            this.regSearchSoc();
        }
        PinBoardSearch.prototype.shouldCreateCheckin = function () {
            return this.$root.find("#cbCreateCheckin").prop("checked");
        };
        PinBoardSearch.prototype.regSearchSoc = function () {
            var _this = this;
            var $btn = this.$root.find("#socSearchBtn");
            $btn.click(function (e) {
                e.preventDefault();
                _this.$socials.toggleClass("hidden");
                _this.searchSoc();
                _this.searchOnSoc = true;
                $btn.hide();
            });
        };
        PinBoardSearch.prototype.searchSoc = function () {
            var _this = this;
            this.search(this.lastQuery, false, function (places) {
                _this.fillContent(places, _this.$socials, false);
            });
        };
        PinBoardSearch.prototype.getByType = function (places, type) {
            return _.filter(places, function (p) { return p.SourceType === type; });
        };
        PinBoardSearch.prototype.regCallback = function () {
            var _this = this;
            this.delayedCallback = new Common.DelayedCallback(this.$input);
            this.delayedCallback.callback = function (query) {
                _this.lastQuery = query;
                _this.search(query, true, function (places) {
                    var cities = _this.getByType(places, SourceType.City);
                    _this.fillContent(cities, _this.$cities, true);
                    var countries = _this.getByType(places, SourceType.Country);
                    _this.fillContent(countries, _this.$countries, false);
                    _this.show(true);
                    if (_this.searchOnSoc) {
                        _this.searchSoc();
                    }
                });
            };
        };
        PinBoardSearch.prototype.show = function (state) {
            if (state) {
                this.$results.removeClass("hidden");
            }
            else {
                this.$results.addClass("hidden");
            }
        };
        PinBoardSearch.prototype.fillContent = function (items, $section, showCC) {
            var _this = this;
            if (!any(items)) {
                $section.addClass("hidden");
            }
            var $cont = $section.find(".content");
            var lg = Common.ListGenerator.init($cont, "place-tag-template");
            lg.clearCont = true;
            lg.customMapping = function (item) {
                var r = {
                    id: item.SourceId,
                    type: item.SourceType,
                    icon: _this.getIcon(item.SourceType),
                    name: item.Name,
                    showCC: showCC,
                    cc: item.CountryCode
                };
                return r;
            };
            lg.evnt(null, function (e, $item, $target, item) {
                var req = { SourceType: item.SourceType, SourceId: item.SourceId, CheckToSoc: _this.shouldCreateCheckin() };
                _this.show(false);
                _this.$input.val("");
                _this.v.saveNewPlace(req);
            });
            lg.generateList(items);
            if (any(items)) {
                $section.removeClass("hidden");
            }
        };
        PinBoardSearch.prototype.search = function (query, isBase, callback) {
            var _this = this;
            this.loader(true);
            if (query) {
                this.show(true);
            }
            else {
                this.show(false);
                this.loader(false);
                return;
            }
            var provs = isBase ? this.baseProviders : this.socNetProviders;
            var params = [["placeName", query], ["types", provs]];
            if (this.coordinates) {
                params.push(["lat", this.coordinates.lat]);
                params.push(["lng", this.coordinates.lng]);
            }
            if (Views.ViewBase.fbt) {
                params.push(["fbt", Views.ViewBase.fbt]);
            }
            Views.ViewBase.currentView.apiGet("place", params, function (places) {
                callback(places);
                _this.loader(false);
            });
        };
        PinBoardSearch.prototype.setCoordinates = function (lat, lng) {
            this.coordinates = { lat: lat, lng: lng };
        };
        PinBoardSearch.prototype.getIcon = function (sourceType) {
            switch (sourceType) {
                case SourceType.FB:
                    return "facebook2";
                case SourceType.City:
                    return "city";
                case SourceType.Country:
                    return "country";
                case SourceType.S4:
                    return "foursquare";
                case SourceType.Yelp:
                    return "yelp";
            }
            return "";
        };
        PinBoardSearch.prototype.loader = function (state) {
            if (state) {
                this.$root.find(".loader").show();
            }
            else {
                this.$root.find(".loader").hide();
            }
        };
        PinBoardSearch.prototype.provToStr = function (itms) {
            var res = _.map(itms, function (i) { return i.toString(); });
            return res.join();
        };
        return PinBoardSearch;
    }());
    Views.PinBoardSearch = PinBoardSearch;
    var PinBoardView = (function (_super) {
        __extends(PinBoardView, _super);
        function PinBoardView() {
            var _this = this;
            _super.call(this);
            this.currentMapType = 0;
            this.countryLegendTmp = this.registerTemplate("legend-template");
            this.loginButtonsManager.onAfterCustom = function (net) {
                if (net === SocialNetworkType.Facebook) {
                    _this.initFb();
                }
            };
        }
        Object.defineProperty(PinBoardView.prototype, "pageType", {
            get: function () { return PageType.PinBoard; },
            enumerable: true,
            configurable: true
        });
        PinBoardView.prototype.initFb = function () {
            var _this = this;
            this.fbPermissions = new Common.FacebookPermissions();
            this.fbPermissions.initFb(function () {
                _this.fbPermissions.hasPermission("user_tagged_places", function (hasPermissions) {
                    if (hasPermissions) {
                        _this.refreshData();
                        _this.checkNewPlaces();
                    }
                    else {
                        _this.initFbPermRequest();
                    }
                });
            });
        };
        PinBoardView.prototype.checkNewPlaces = function () {
            var _this = this;
            var prms = [];
            this.apiGet("NewPlaces", prms, function (any) {
                if (any) {
                    _this.refreshData();
                    _this.apiGet("PinStats", [], function (stats) {
                        _this.refreshBadges(stats);
                    });
                }
            });
        };
        PinBoardView.prototype.setShareText = function (cities, countries) {
        };
        PinBoardView.prototype.initFbPermRequest = function () {
            var _this = this;
            $("#taggedPlacesPerm").show();
            $("#fbBtnImport").click(function (e) {
                e.preventDefault();
                _this.getTaggedPlacesPermissions();
            });
        };
        PinBoardView.prototype.getTaggedPlacesPermissions = function () {
            var _this = this;
            this.fbPermissions.requestPermissions("user_tagged_places", function (r1) {
                $("#taggedPlacesPerm").remove();
                var id = new Common.InprogressDialog();
                id.create(_this.t("ImportingCheckins", "jsPins"), $("#map"));
                _this.apiPost("FbTaggedPlacesPermission", null, function (r2) {
                    _this.refreshData();
                    id.remove();
                });
            });
        };
        PinBoardView.prototype.initialize = function () {
            var _this = this;
            var os = Views.ViewBase.getMobileOS();
            var isComputer = os !== OS.Other;
            if (isComputer) {
                $("#mapType").addClass("hidden");
            }
            this.switcher = new Views.Switcher();
            this.switcher.onChange = function (group, val) { _this.viewChanged(group, val); };
            this.switcher.init();
            this.peopleFilter = new Views.PeopleFilter();
            this.peopleFilter.onChange = function () {
                _this.refreshData();
            };
            this.peopleFilter.init();
            this.mapsManager = new Maps.MapsManager();
            this.mapsManager.onDataChanged = function () {
                _this.pinBoardBadges.refresh();
            };
            this.initMapType();
            this.initPlaceSearch();
            this.initShareDialog();
            this.switchMapType(Maps.DataType.Cities, Maps.MapType.D2);
            this.pinBoardBadges = new Views.PinBoardBadges();
            this.shareDialogView = new Views.ShareDialogPinsView();
            this.mapsManager.onCenterChanged = function (center) {
                _this.search.setCoordinates(center.lat, center.lng);
            };
        };
        PinBoardView.prototype.switchMapType = function (dataType, mapType) {
            var _this = this;
            this.mapsManager.switchToView(mapType, dataType, function () {
                _this.refreshData();
            });
        };
        PinBoardView.prototype.viewChanged = function (group, val) {
            this.refreshData();
        };
        PinBoardView.prototype.initMapType = function () {
            var _this = this;
            var $combo = $("#mapType");
            var $input = $combo.find("input");
            $input.val(this.currentMapType);
            $input.change(function (e) {
                _this.currentMapType = parseInt($input.val());
                _this.getFormState(function (dataType, mapType) {
                    _this.switchMapType(dataType, mapType);
                });
                _this.setMenuControls();
            });
        };
        PinBoardView.prototype.initPlaceSearch = function () {
            var _this = this;
            this.search = new PinBoardSearch($(".place-search"), this);
            this.search.onPlaceSelected = function (request) { return _this.saveNewPlace(request); };
        };
        PinBoardView.prototype.initShareDialog = function () {
            var _this = this;
            var $btn = $("#share-btn");
            var $dialog = $(".popup-share");
            $btn.click(function (e) {
                e.preventDefault();
                var hasSocNets = _this.hasSocNetwork(SocialNetworkType.Facebook) || _this.hasSocNetwork(SocialNetworkType.Twitter);
                if (hasSocNets) {
                    $dialog.slideToggle();
                }
                else {
                    var id = new Common.InfoDialog();
                    $("#popup-joinSoc").slideToggle();
                    id.create(_this.t("NoSocNetTitle", "jsPins"), _this.t("NoSocNetShare", "jsPins"));
                }
            });
        };
        PinBoardView.prototype.getFormState = function (callback) {
            var dataType = this.switcher.getGroupVal("data-type");
            callback(dataType, this.currentMapType);
        };
        PinBoardView.prototype.setMenuControls = function () {
            var _this = this;
            this.getFormState(function (dataType, mapType) {
                var $placesIco = $(".icon-places").closest(".ico_all");
                $placesIco.show();
                if (mapType === Maps.MapType.D3) {
                    $placesIco.hide();
                    if (dataType === Maps.DataType.Places) {
                        _this.switcher.setGroupVal("data-type", 1);
                    }
                }
            });
        };
        PinBoardView.prototype.deletePin = function (gid) {
            var _this = this;
            var d = new Common.ConfirmDialog();
            d.create(this.t("DelDialogTitle", "jsPins"), this.t("DelDialogBody", "jsPins"), this.t("Cancel", "jsLayout"), this.t("Ok", "jsLayout"), function () {
                var prms = [["gid", gid]];
                _this.apiDelete("VisitedCity", prms, function (r) {
                    _this.mapsManager.removeCity(r.gid, r.countryCode);
                    _this.refreshBadges(r.stats);
                });
            });
        };
        PinBoardView.prototype.refreshData = function () {
            var _this = this;
            this.getFormState(function (dataType, mapType) {
                var people = _this.peopleFilter.getSelection();
                _this.mapsManager.getPluginData(dataType, people);
                _this.displayLegend(dataType);
            });
        };
        PinBoardView.prototype.displayLegend = function (pluginType) {
            if (this.$currentLegend) {
                this.$currentLegend.remove();
            }
            if (pluginType === Maps.DataType.Countries) {
                var $l = $(this.countryLegendTmp());
                $(".map-wrap").append($l);
                this.$currentLegend = $l;
            }
        };
        PinBoardView.prototype.setStatsRibbon = function (citiesCount, countriesCount, worldTraveledPercent, statesCount) {
            $("#CitiesCount").text(citiesCount);
            $("#CountriesCount").text(countriesCount);
            $("#TraveledPercent").text(worldTraveledPercent);
            $("#StatesCount").text(statesCount);
            this.setShareText(citiesCount, countriesCount);
        };
        PinBoardView.prototype.refreshBadges = function (stats) {
            this.setStatsRibbon(stats.citiesCount, stats.countriesCount, stats.worldTraveledPercent, stats.statesCount);
            this.pinBoardBadges.cities = stats.topCities;
            this.pinBoardBadges.countries = stats.countryCodes;
            this.pinBoardBadges.states = stats.stateCodes;
            this.pinBoardBadges.refresh();
        };
        PinBoardView.prototype.saveNewPlace = function (request) {
            var _this = this;
            var self = this;
            this.apiPost("checkin", request, function (req) {
                _this.refreshBadges(req);
                var moveToLocation = null;
                if (_this.mapsManager.currentDataType === Maps.DataType.Cities) {
                    req.visitedCities.forEach(function (city) {
                        self.mapsManager.mapsDataLoader.places.cities.push(city);
                        moveToLocation = city.Location;
                    });
                }
                if (_this.mapsManager.currentDataType === Maps.DataType.Countries) {
                    req.visitedCountries.forEach(function (country) {
                        self.mapsManager.mapsDataLoader.places.countries.push(country);
                    });
                    if (req.visitedStates) {
                        req.visitedStates.forEach(function (state) {
                            self.mapsManager.mapsDataLoader.places.states.push(state);
                        });
                    }
                    if (req.visitedCities != null && req.visitedCities.length > 0) {
                        moveToLocation = req.visitedCities[0].Location;
                    }
                }
                if (_this.mapsManager.currentDataType === Maps.DataType.Places) {
                    req.visitedPlaces.forEach(function (place) {
                        self.mapsManager.mapsDataLoader.places.places.push(place);
                        moveToLocation = place.Location;
                    });
                }
                if (moveToLocation) {
                    self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
                }
                self.mapsManager.mapsDataLoader.mapToViewData();
                self.mapsManager.redrawDataCallback();
            });
        };
        return PinBoardView;
    }(Views.ViewBase));
    Views.PinBoardView = PinBoardView;
})(Views || (Views = {}));
//# sourceMappingURL=PinBoardView.js.map