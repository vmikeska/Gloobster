var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
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
            this.search = new Common.AllPlacesSearch($(".place-search"), this);
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