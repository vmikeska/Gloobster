var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var PinBoardBadges = (function () {
        function PinBoardBadges() {
        }
        Object.defineProperty(PinBoardBadges.prototype, "mapsDataLoader", {
            get: function () {
                var mdl = Views.ViewBase.currentView["mapsManager"].mapsDataLoader;
                return mdl;
            },
            enumerable: true,
            configurable: true
        });
        PinBoardBadges.prototype.refresh = function () {
            this.aggregateCountries();
            this.generateOverview();
        };
        PinBoardBadges.prototype.aggregateCountries = function () {
            var countries = _.map(this.mapsDataLoader.places.countries, function (c) { return c.CountryCode2; });
            this.aggegatedCountries = new AggregatedCountries();
            this.aggegatedCountries.aggregate(countries);
        };
        PinBoardBadges.prototype.generateOverview = function () {
            var afrHtml = this.genOverviewItem("africa.png", this.aggegatedCountries.africaVisited, this.aggegatedCountries.africaTotal, "Africa");
            var eurHtml = this.genOverviewItem("europe.png", this.aggegatedCountries.europeVisited, this.aggegatedCountries.europeTotal, "Europe");
            var asiHtml = this.genOverviewItem("asia.png", this.aggegatedCountries.asiaVisited, this.aggegatedCountries.asiaTotal, "Asia");
            var ausHtml = this.genOverviewItem("australia.png", this.aggegatedCountries.australiaVisited, this.aggegatedCountries.australiaTotal, "Australia");
            var naHtml = this.genOverviewItem("north-amecica.png", this.aggegatedCountries.northAmericaVisited, this.aggegatedCountries.northAmericaTotal, "North America");
            var saHtml = this.genOverviewItem("south-america.png", this.aggegatedCountries.southAmericaVisited, this.aggegatedCountries.southAmericaTotal, "South America");
            var html = afrHtml + eurHtml + asiHtml + ausHtml + naHtml + saHtml;
            $("#badgesOverview").html(html);
        };
        PinBoardBadges.prototype.genOverviewItem = function (img, visitedCnt, totalCnt, name) {
            var imgLink = "../images/badges/" + img;
            return "<div class=\"cell\"><span class=\"badge active\"><span class=\"thumbnail\"><img src=\"" + imgLink + "\"></span>" + visitedCnt + "/" + totalCnt + " <b>" + name + "</b></span></div>";
        };
        return PinBoardBadges;
    })();
    Views.PinBoardBadges = PinBoardBadges;
    var AggregatedCountries = (function () {
        function AggregatedCountries() {
            this.africa = ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GW", "GN", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TZ", "TG", "TN", "UG", "ZM", "TZ", "ZW", "SS", "CD"];
            this.europe = ["AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "ME"];
            this.asia = ["AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TR", "TM", "AE", "UZ", "VN", "YE"];
            this.austraila = ["AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "SB", "TO", "TV", "VU", "WS", "TL"];
            this.northAmerica = ["AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GT", "HT", "HN", "JM", "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"];
            this.southAmerica = ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"];
            //todo: one extra country ? Find out which
            this.africaTotal = 55;
            this.europeTotal = 45;
            this.asiaTotal = 45;
            this.australiaTotal = 15;
            this.northAmericaTotal = 22;
            this.southAmericaTotal = 12;
            this.africaVisited = 0;
            this.europeVisited = 0;
            this.asiaVisited = 0;
            this.australiaVisited = 0;
            this.northAmericaVisited = 0;
            this.southAmericaVisited = 0;
        }
        AggregatedCountries.prototype.aggregate = function (countries) {
            var _this = this;
            this.africaVisited = 0;
            countries.forEach(function (c) {
                var af = _.contains(_this.africa, c);
                if (af) {
                    _this.africaVisited++;
                }
                var eur = _.contains(_this.europe, c);
                if (eur) {
                    _this.europeVisited++;
                }
                var asi = _.contains(_this.asia, c);
                if (asi) {
                    _this.asiaVisited++;
                }
                var aus = _.contains(_this.austraila, c);
                if (aus) {
                    _this.australiaVisited++;
                }
                var na = _.contains(_this.northAmerica, c);
                if (na) {
                    _this.northAmericaVisited++;
                }
                var sa = _.contains(_this.southAmerica, c);
                if (sa) {
                    _this.southAmericaVisited++;
                }
            });
        };
        return AggregatedCountries;
    })();
    Views.AggregatedCountries = AggregatedCountries;
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
                _this.pinBoardBadges.refresh();
            };
            this.mapsManager.switchToView(Maps.ViewType.D2);
            this.fbPermissions = new Common.FacebookPermissions();
            this.pinBoardBadges = new PinBoardBadges();
            this.shareDialogView = new Views.ShareDialogPinsView();
            this.initPlaceSearch();
            $("#mapType li").click(function (e) {
                var value = $(e.target).data("value");
                var parsedVal = parseInt(value);
                _this.mapsManager.switchToView(parsedVal);
                _this.setSupportedProjections(parsedVal);
            });
            $("#pluginType li").click(function () {
                _this.refreshData(false);
            });
            $("#projectionType li").click(function () {
                _this.refreshData(false);
            });
            this.setTagPlacesVisibility();
        };
        PinBoardView.prototype.deletePin = function (gid) {
            var _this = this;
            var prms = [["gid", gid]];
            this.apiDelete("VisitedCity", prms, function (r) {
                _this.mapsManager.removeCity(r.gid, r.countryCode);
            });
        };
        PinBoardView.prototype.setSupportedProjections = function (mapType) {
            var $heatMapOpt = $("#pt2");
            if (mapType === 1) {
                $heatMapOpt.show();
            }
            if (mapType === 0) {
                $heatMapOpt.hide();
            }
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
        PinBoardView.prototype.refreshData = function (force) {
            var _this = this;
            setTimeout(function () {
                var pluginType = parseInt($("#pluginType input").val());
                var projectionType = parseInt($("#projectionType input").val());
                _this.mapsManager.getPluginData(pluginType, projectionType, force);
                _this.displayLegend(projectionType);
            }, 10);
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
                    _this.refreshData(true);
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
        PinBoardView.prototype.setStatsRibbon = function (citiesCount, countriesCount, worldTraveledPercent) {
            $("#CitiesCount").text(citiesCount);
            $("#CountriesCount").text(countriesCount);
            $("#TraveledPercent").text(worldTraveledPercent);
            //DistanceLength
            //FriendsCount
            //BadgesCount		 
        };
        PinBoardView.prototype.saveNewPlace = function (request) {
            var _this = this;
            var self = this;
            this.apiPost("checkin", request, function (req) {
                var moveToLocation = null;
                if (req.visitedCities) {
                    req.visitedCities.forEach(function (city) {
                        self.mapsManager.mapsDataLoader.places.cities.push(city);
                        moveToLocation = city.Location;
                    });
                }
                if (req.visitedPlaces) {
                    req.visitedPlaces.forEach(function (place) {
                        self.mapsManager.mapsDataLoader.places.places.push(place);
                        moveToLocation = place.Location;
                    });
                }
                if (req.visitedCountries) {
                    req.visitedCountries.forEach(function (country) {
                        self.mapsManager.mapsDataLoader.places.countries.push(country);
                    });
                }
                if (moveToLocation) {
                    self.mapsManager.mapsDriver.moveToAnimated(moveToLocation.Lat, moveToLocation.Lng, 5);
                }
                _this.setStatsRibbon(req.citiesCount, req.countriesCount, req.worldTraveledPercent);
                self.mapsManager.mapsDataLoader.mapToViewData();
                self.mapsManager.redrawDataCallback();
            });
        };
        return PinBoardView;
    })(Views.ViewBase);
    Views.PinBoardView = PinBoardView;
})(Views || (Views = {}));
//# sourceMappingURL=PinBoardView.js.map