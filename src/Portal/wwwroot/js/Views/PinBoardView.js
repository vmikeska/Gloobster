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
            _super.apply(this, arguments);
        }
        Object.defineProperty(PinBoardView.prototype, "pageType", {
            get: function () { return Views.PageType.PinBoard; },
            enumerable: true,
            configurable: true
        });
        PinBoardView.prototype.initialize = function () {
            var _this = this;
            this.mapsManager = new Maps.MapsManager();
            this.mapsManager.onDataChanged = function () {
                _this.pinBoardBadges.refresh(_this.mapsManager.currentDisplayEntity);
                $("#TopCitiesCount").text(_this.pinBoardBadges.visitedTotal);
            };
            this.mapsManager.switchToView(Maps.ViewType.D2);
            this.fbPermissions = new Common.FacebookPermissions();
            this.pinBoardBadges = new Views.PinBoardBadges();
            this.shareDialogView = new Views.ShareDialogPinsView();
            this.initPlaceSearch();
            $("#mapType li").click(function (e) {
                var value = $(e.target).data("value");
                var parsedVal = parseInt(value);
                _this.mapsManager.switchToView(parsedVal);
                _this.setMenuControls();
                _this.setInfo();
            });
            $("#dataType li").click(function () {
                _this.refreshData();
                _this.setMenuControls();
                _this.setInfo();
            });
            $("#projectionType li").click(function () {
                _this.refreshData();
                _this.setMenuControls();
                _this.setInfo();
            });
            this.setTagPlacesVisibility();
            this.peopleFilter = new Views.PeopleFilter();
            this.peopleFilter.onSelectionChanged = function (selection) {
                _this.refreshData();
            };
            this.setInfo();
            this.onLogin = function () {
                _this.setInfo();
            };
        };
        PinBoardView.prototype.setInfo = function () {
            var _this = this;
            this.getFormState(function (dataType, entity, mapType) {
                var userLogged = _this.loginManager.isAlreadyLogged();
                var $messageNotLogged = $("#messageNotLogged");
                var $messageCitiesVisited = $("#messageCitiesVisited");
                var $messageCountriesVisited = $("#messageCountriesVisited");
                var $messagePlaces = $("#messagePlaces");
                var $messageCitiesInterested = $("#messageCitiesInterested");
                var $messageCountriesInterested = $("#messageCountriesInterested");
                $(".infoMessage").hide();
                if (!userLogged) {
                    $messageNotLogged.show();
                    return;
                }
                if (dataType === Maps.DataType.Visited) {
                    if (entity === Maps.DisplayEntity.Pin) {
                        $messageCitiesVisited.show();
                    }
                    if (entity === Maps.DisplayEntity.Countries) {
                        $messageCountriesVisited.show();
                    }
                    if (entity === Maps.DisplayEntity.Heat) {
                        $messagePlaces.show();
                    }
                }
                if (dataType === Maps.DataType.Interested) {
                    if (entity === Maps.DisplayEntity.Pin) {
                        $messageCitiesInterested.show();
                    }
                    if (entity === Maps.DisplayEntity.Countries) {
                        $messageCountriesInterested.show();
                    }
                }
            });
        };
        PinBoardView.prototype.getFormState = function (callback) {
            setTimeout(function () {
                var dataType = parseInt($("#dataType input").val());
                var entity = parseInt($("#projectionType input").val());
                var mapType = parseInt($("#mapType input").val());
                callback(dataType, entity, mapType);
            }, 10);
        };
        PinBoardView.prototype.setMenuControls = function () {
            var _this = this;
            this.getFormState(function (dataType, entity, mapType) {
                var $city = $("#pt0");
                var $country = $("#pt1");
                var $place = $("#pt2");
                var $visited = $("#dt0");
                var $interested = $("#dt1");
                $city.show();
                $country.show();
                $place.show();
                $visited.show();
                $interested.show();
                if (mapType === Maps.ViewType.D3) {
                    $place.hide();
                    if (entity === Maps.DisplayEntity.Heat) {
                        $("#projectionType input").val(1);
                        $("#projectionType span").text($country.text());
                        _this.refreshData();
                    }
                }
                if (dataType === Maps.DataType.Interested) {
                    $place.hide();
                    if (entity === Maps.DisplayEntity.Heat) {
                        $("#projectionType input").val(1);
                        $("#projectionType span").text($country.text());
                        _this.refreshData();
                    }
                }
            });
        };
        PinBoardView.prototype.deletePin = function (gid) {
            var _this = this;
            var prms = [["gid", gid]];
            this.apiDelete("VisitedCity", prms, function (r) {
                _this.mapsManager.removeCity(r.gid, r.countryCode);
            });
        };
        PinBoardView.prototype.initPlaceSearch = function () {
            var _this = this;
            var c = new Common.PlaceSearchConfig();
            c.providers = "0,1,2,3";
            c.elementId = "cities";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = true;
            this.placeSearch = new Common.PlaceSearchBox(c);
            this.placeSearch.onPlaceSelected = function (request) { return _this.saveNewPlace(request); };
        };
        PinBoardView.prototype.refreshData = function () {
            var _this = this;
            this.getFormState(function (dataType, entity, mapType) {
                var people = _this.peopleFilter.getSelection();
                _this.mapsManager.getPluginData(dataType, entity, people);
                _this.displayLegend(entity);
            });
        };
        PinBoardView.prototype.displayLegend = function (pluginType) {
            if (this.currentLegend) {
                this.currentLegend.hide();
                this.currentLegend = null;
            }
            if (pluginType === Maps.DisplayEntity.Countries) {
                this.currentLegend = $("#countriesLegend");
            }
            if (this.currentLegend) {
                this.currentLegend.show();
            }
        };
        PinBoardView.prototype.getTaggedPlacesPermissions = function () {
            var _this = this;
            this.fbPermissions.requestPermissions("user_tagged_places", function (resp) {
                $("#taggedPlacesPerm").hide();
                _this.apiPost("FbTaggedPlacesPermission", null, function (resp) {
                    _this.refreshData();
                });
            });
        };
        PinBoardView.prototype.setTagPlacesVisibility = function () {
            var _this = this;
            var hasFb = this.hasSocNetwork(Reg.NetworkType.Facebook);
            if (hasFb) {
                this.fbPermissions.initFb(function () {
                    _this.fbPermissions.hasPermission("user_tagged_places", function (hasPerm) {
                        if (!hasPerm) {
                            $("#taggedPlacesPerm").show();
                        }
                        else {
                            $("#taggedPlacesPerm").hide();
                        }
                    });
                });
            }
        };
        PinBoardView.prototype.setStatsRibbon = function (citiesCount, countriesCount, worldTraveledPercent, statesCount) {
            $("#CitiesCount").text(citiesCount);
            $("#CountriesCount").text(countriesCount);
            $("#TraveledPercent").text(worldTraveledPercent);
            $("#StatesCount").text(statesCount);
        };
        PinBoardView.prototype.saveNewPlace = function (request) {
            var _this = this;
            var self = this;
            this.apiPost("checkin", request, function (req) {
                var moveToLocation = null;
                if (_this.mapsManager.currentDisplayEntity === Maps.DisplayEntity.Pin) {
                    req.visitedCities.forEach(function (city) {
                        self.mapsManager.mapsDataLoader.places.cities.push(city);
                        moveToLocation = city.Location;
                    });
                }
                if (_this.mapsManager.currentDisplayEntity === Maps.DisplayEntity.Countries) {
                    req.visitedCountries.forEach(function (country) {
                        self.mapsManager.mapsDataLoader.places.countries.push(country);
                    });
                    req.visitedStates.forEach(function (state) {
                        self.mapsManager.mapsDataLoader.places.states.push(state);
                    });
                }
                if (_this.mapsManager.currentDisplayEntity === Maps.DisplayEntity.Heat) {
                    req.visitedPlaces.forEach(function (place) {
                        self.mapsManager.mapsDataLoader.places.places.push(place);
                        moveToLocation = place.Location;
                    });
                }
                if (moveToLocation) {
                    self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
                }
                _this.setStatsRibbon(req.citiesCount, req.countriesCount, req.worldTraveledPercent, req.statesCount);
                self.mapsManager.mapsDataLoader.mapToViewData();
                self.mapsManager.redrawDataCallback();
            });
        };
        return PinBoardView;
    })(Views.ViewBase);
    Views.PinBoardView = PinBoardView;
})(Views || (Views = {}));
//# sourceMappingURL=PinBoardView.js.map