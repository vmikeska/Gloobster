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
            this.loginButtonsManager.onAfterCustom = function (net) {
                if (net === SocialNetworkType.Facebook) {
                    _this.initFb();
                }
            };
        }
        Object.defineProperty(PinBoardView.prototype, "pageType", {
            get: function () { return Views.PageType.PinBoard; },
            enumerable: true,
            configurable: true
        });
        PinBoardView.prototype.initFb = function () {
            var _this = this;
            this.fbPermissions = new Common.FacebookPermissions();
            this.fbPermissions.initFb(function () {
                _this.initFbPermRequest();
            });
        };
        PinBoardView.prototype.initialize = function () {
            var _this = this;
            this.mapsManager = new Maps.MapsManager();
            this.mapsManager.onDataChanged = function () {
                _this.pinBoardBadges.refresh();
                $("#TopCitiesCount").text(_this.pinBoardBadges.visitedTotal);
            };
            this.mapsManager.switchToView(Maps.ViewType.D2, Maps.DisplayEntity.Pin);
            this.pinBoardBadges = new Views.PinBoardBadges();
            this.shareDialogView = new Views.ShareDialogPinsView();
            this.initPlaceSearch();
            this.initCombos();
            this.setInfo();
            this.onLogin = function () {
                _this.setInfo();
            };
            this.mapsManager.onCenterChanged = function (center) {
                _this.placeSearch.setCoordinates(center.lat, center.lng);
            };
        };
        PinBoardView.prototype.initCombos = function () {
            var _this = this;
            $("#mapType input").change(function (e) {
                var value = $(e.target).val();
                //var parsedVal = parseInt(value);
                _this.getFormState(function (dataType, entity, mapType) {
                    _this.mapsManager.switchToView(mapType, entity);
                });
                _this.setMenuControls();
                _this.setInfo();
            });
            $("#dataType input").change(function () {
                _this.refreshData();
                _this.setMenuControls();
                _this.setInfo();
            });
            $("#projectionType input").change(function () {
                _this.refreshData();
                _this.setMenuControls();
                _this.setInfo();
            });
            this.peopleFilter = new Views.PeopleFilter();
            this.peopleFilter.onSelectionChanged = function (selection) {
                _this.refreshData();
            };
        };
        PinBoardView.prototype.setInfo = function () {
            this.getFormState(function (dataType, entity, mapType) {
                //var userLogged = this.loginManager.isAlreadyLogged();
                //var $messageNotLogged = $("#messageNotLogged");
                var $messageCitiesVisited = $("#messageCitiesVisited");
                var $messageCountriesVisited = $("#messageCountriesVisited");
                var $messagePlaces = $("#messagePlaces");
                var $messageCitiesInterested = $("#messageCitiesInterested");
                var $messageCountriesInterested = $("#messageCountriesInterested");
                $(".infoMessage").hide();
                //if (!userLogged) {
                //$messageNotLogged.show();
                // return;
                //}
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
            c.providers = "0,1,2,3,4";
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
                $("#importingCheckins").show();
                _this.apiPost("FbTaggedPlacesPermission", null, function (r2) {
                    _this.refreshData();
                    $("#importingCheckins").hide();
                });
            });
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
                _this.pinBoardBadges.cities = req.topCities;
                _this.pinBoardBadges.countries = req.countryCodes;
                _this.pinBoardBadges.states = req.stateCodes;
                _this.pinBoardBadges.refresh();
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