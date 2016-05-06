var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var PinBoardSearch = (function () {
        function PinBoardSearch($root) {
            this.baseProviders = this.provToStr([SourceType.City, SourceType.Country]);
            this.socProv = [SourceType.FB, SourceType.S4, SourceType.Yelp];
            this.socNetProviders = this.provToStr(this.socProv);
            this.template = Views.ViewBase.currentView.registerTemplate("placeItem-template");
            this.socNetsActive = false;
            this.$root = $root;
            this.$input = $root.find("input");
            this.$ulCity = $root.find(".ul-city");
            this.$ulCountry = $root.find(".ul-country");
            this.$results = $root.find(".results");
            this.regCallback();
            this.regSearchSoc();
        }
        PinBoardSearch.prototype.show = function (show) {
            if (show) {
                this.$results.show();
            }
            else {
                this.$results.hide();
            }
        };
        PinBoardSearch.prototype.regSearchSoc = function () {
            var _this = this;
            this.$root.find(".search-soc").click(function (e) {
                e.preventDefault();
                _this.socNetsActive = !_this.socNetsActive;
                var $nets = $(".soc-nets");
                $nets.empty();
                if (_this.socNetsActive) {
                    _this.searchSoc();
                }
            });
        };
        PinBoardSearch.prototype.searchSoc = function () {
            var _this = this;
            var $nets = $(".soc-nets");
            this.search(this.lastQuery, false, function (places) {
                $nets.empty();
                for (var act = 1; act <= _this.socProv.length; act++) {
                    var type = _this.socProv[act - 1];
                    var plcs = _this.getByType(places, type);
                    var $box = _this.getBox(act);
                    $nets.append($box);
                    _this.fill(plcs, $box);
                }
            });
        };
        PinBoardSearch.prototype.cityTemp = function (item) {
            return "<li data-value=\"" + item.sourceId + "\" data-type=\"" + item.sourceType + "\"> <span class=\"" + item.icoClass + " left mright10\"> </span><a href=\"#\">" + item.name + "</a><span class=\"color2\">, " + item.countryCode + "</span> </li>";
        };
        PinBoardSearch.prototype.countryTemp = function (item) {
            return "<li data-value=\"" + item.sourceId + "\" data-type=\"" + item.sourceType + "\"> <span class=\"" + item.icoClass + " left mright10\"> </span><a href=\"#\">" + item.name + "</a></li>";
        };
        PinBoardSearch.prototype.socTemp = function (item) {
            return "<li data-value=\"" + item.sourceId + "\" data-type=\"" + item.sourceType + "\"> <span class=\"" + item.icoClass + " left mright10\"> </span><a href=\"#\">" + item.name + "</a></li>";
        };
        PinBoardSearch.prototype.getBox = function (num) {
            return $("<div class=\"soc-item\"><ul class=\"" + num + "\"></ul></div>");
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
                    _this.fill(cities, _this.$ulCity);
                    var countries = _this.getByType(places, SourceType.Country);
                    _this.fill(countries, _this.$ulCountry);
                    if (_this.socNetsActive) {
                        _this.searchSoc();
                    }
                });
            };
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
        PinBoardSearch.prototype.fill = function (places, $ul) {
            var _this = this;
            var htmlContent = "";
            places.forEach(function (item) {
                htmlContent += _this.getItemHtml(item);
            });
            $ul.html(htmlContent);
            $ul.find("a").click(function (e) { return _this.itemClick(e); });
        };
        PinBoardSearch.prototype.itemClick = function (e) {
            e.preventDefault();
            var $a = $(e.target);
            var $li = $a.closest("li");
            var sourceId = $li.data("value");
            var sourceType = $li.data("type");
            var req = { SourceType: sourceType, SourceId: sourceId };
            var view = Views.ViewBase.currentView;
            this.$results.hide();
            this.$input.val("");
            view.saveNewPlace(req);
        };
        PinBoardSearch.prototype.setCoordinates = function (lat, lng) {
            this.coordinates = { lat: lat, lng: lng };
        };
        PinBoardSearch.prototype.getItemHtml = function (item) {
            var context = {
                sourceId: item.SourceId,
                sourceType: item.SourceType,
                icoClass: this.getIconForSearch(item.SourceType),
                name: item.Name,
                countryCode: item.CountryCode
            };
            var html = "";
            if (item.SourceType === SourceType.City) {
                html = this.cityTemp(context);
            }
            else if (item.SourceType === SourceType.Country) {
                html = this.countryTemp(context);
            }
            else {
                html = this.socTemp(context);
            }
            this.template(context);
            return html;
        };
        PinBoardSearch.prototype.getIconForSearch = function (sourceType) {
            switch (sourceType) {
                case SourceType.FB:
                    return "icon-facebook";
                case SourceType.City:
                    return "icon-city";
                case SourceType.Country:
                    return "icon-country";
                case SourceType.S4:
                    return "icon-foursquare";
                case SourceType.Yelp:
                    return "icon-yelp";
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
    })();
    Views.PinBoardSearch = PinBoardSearch;
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
            this.initShareDialog();
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
                _this.fbPermissions.hasPermission("user_tagged_places", function (hasPermissions) {
                    if (hasPermissions) {
                        _this.refreshData();
                    }
                    else {
                        _this.initFbPermRequest();
                    }
                });
            });
        };
        PinBoardView.prototype.initShareDialog = function () {
            var _this = this;
            var $btn = $("#share-btn");
            var $dialog = $("#popup-share");
            $btn.click(function (e) {
                e.preventDefault();
                var hasSocNets = _this.hasSocNetwork(SocialNetworkType.Facebook) || _this.hasSocNetwork(SocialNetworkType.Twitter);
                if (hasSocNets) {
                    $dialog.toggleClass("popup-open");
                    $dialog.slideToggle();
                }
                else {
                    var id = new Common.InfoDialog();
                    $("#popup-joinSoc").slideToggle();
                    id.create(_this.t("NoSocNetTitle", "jsPins"), _this.t("NoSocNetShare", "jsPins"));
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
                id.create(_this.t("ImportingCheckins", "jsPins"));
                _this.apiPost("FbTaggedPlacesPermission", null, function (r2) {
                    _this.refreshData();
                    id.remove();
                });
            });
        };
        PinBoardView.prototype.initialize = function () {
            var _this = this;
            this.mapsManager = new Maps.MapsManager();
            this.mapsManager.onDataChanged = function () {
                _this.pinBoardBadges.refresh();
            };
            this.mapsManager.switchToView(Maps.ViewType.D2, Maps.DisplayEntity.Pin);
            this.pinBoardBadges = new Views.PinBoardBadges();
            this.shareDialogView = new Views.ShareDialogPinsView();
            this.initPlaceSearch2();
            this.initCombos();
            this.setInfo();
            this.onLogin = function () {
                _this.setInfo();
            };
            this.mapsManager.onCenterChanged = function (center) {
                _this.search.setCoordinates(center.lat, center.lng);
            };
        };
        PinBoardView.prototype.initCombos = function () {
            var _this = this;
            $("#mapType input").change(function (e) {
                var value = $(e.target).val();
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
                var $messageCitiesVisited = $("#messageCitiesVisited");
                var $messageCountriesVisited = $("#messageCountriesVisited");
                var $messagePlaces = $("#messagePlaces");
                var $messageCitiesInterested = $("#messageCitiesInterested");
                var $messageCountriesInterested = $("#messageCountriesInterested");
                $(".infoMessage").hide();
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
            var d = new Common.ConfirmDialog();
            d.create(this.t("DelDialogTitle", "jsPins"), this.t("DelDialogBody", "jsPins"), this.t("Cancel", "jsLayout"), this.t("Ok", "jsLayout"), function () {
                var prms = [["gid", gid]];
                _this.apiDelete("VisitedCity", prms, function (r) {
                    _this.mapsManager.removeCity(r.gid, r.countryCode);
                    _this.refreshBadges(r.stats);
                });
            });
        };
        PinBoardView.prototype.initPlaceSearch2 = function () {
            var _this = this;
            this.search = new PinBoardSearch($(".place-search"));
            this.search.onPlaceSelected = function (request) { return _this.saveNewPlace(request); };
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
                    if (req.visitedStates) {
                        req.visitedStates.forEach(function (state) {
                            self.mapsManager.mapsDataLoader.places.states.push(state);
                        });
                    }
                    if (req.visitedCities != null && req.visitedCities.length > 0) {
                        moveToLocation = req.visitedCities[0].Location;
                    }
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
                self.mapsManager.mapsDataLoader.mapToViewData();
                self.mapsManager.redrawDataCallback();
            });
        };
        return PinBoardView;
    })(Views.ViewBase);
    Views.PinBoardView = PinBoardView;
})(Views || (Views = {}));
//# sourceMappingURL=PinBoardView.js.map