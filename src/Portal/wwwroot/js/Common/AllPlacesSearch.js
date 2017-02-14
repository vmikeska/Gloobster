var Common;
(function (Common) {
    var AllPlacesSearch = (function () {
        function AllPlacesSearch($root, v) {
            var _this = this;
            this.baseProviders = this.provToStr([SourceType.City, SourceType.Country]);
            this.socProv = [SourceType.FB, SourceType.S4, SourceType.Yelp];
            this.socNetProviders = this.provToStr(this.socProv);
            this.itemTmp = Views.ViewBase.currentView.registerTemplate("place-tag-template");
            this.searchOnSoc = false;
            this.v = v;
            this.$root = $root;
            this.$input = $root.find(".inputed");
            this.$cities = $root.find(".sect-cities");
            this.$countries = $root.find(".sect-countries");
            this.$socials = $root.find(".sect-social");
            this.$results = $root.find(".place-search-results");
            this.regCallback();
            this.regSearchSoc();
            this.$root.find(".close").click(function (e) {
                e.preventDefault();
                _this.show(false);
                _this.clear();
            });
        }
        AllPlacesSearch.prototype.shouldCreateCheckin = function () {
            return this.$root.find("#cbCreateCheckin").prop("checked");
        };
        AllPlacesSearch.prototype.regSearchSoc = function () {
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
        AllPlacesSearch.prototype.searchSoc = function () {
            var _this = this;
            this.search(this.lastQuery, false, function (places) {
                _this.fillContent(places, _this.$socials, false);
            });
        };
        AllPlacesSearch.prototype.getByType = function (places, type) {
            return _.filter(places, function (p) { return p.SourceType === type; });
        };
        AllPlacesSearch.prototype.regCallback = function () {
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
        AllPlacesSearch.prototype.show = function (state) {
            if (state) {
                this.$results.removeClass("hidden");
            }
            else {
                this.$results.addClass("hidden");
            }
        };
        AllPlacesSearch.prototype.fillContent = function (items, $section, showCC) {
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
                _this.show(false);
                _this.clear();
                if (_this.onPlaceSelected) {
                    var req = { SourceType: item.SourceType, SourceId: item.SourceId, CheckToSoc: _this.shouldCreateCheckin() };
                    _this.onPlaceSelected(req);
                }
            });
            lg.generateList(items);
            if (any(items)) {
                $section.removeClass("hidden");
            }
        };
        AllPlacesSearch.prototype.clear = function () {
            this.$input.val("");
        };
        AllPlacesSearch.prototype.search = function (query, isBase, callback) {
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
        AllPlacesSearch.prototype.setCoordinates = function (lat, lng) {
            this.coordinates = { lat: lat, lng: lng };
        };
        AllPlacesSearch.prototype.getIcon = function (sourceType) {
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
        AllPlacesSearch.prototype.loader = function (state) {
            if (state) {
                this.$root.find(".loader").show();
            }
            else {
                this.$root.find(".loader").hide();
            }
        };
        AllPlacesSearch.prototype.provToStr = function (itms) {
            var res = _.map(itms, function (i) { return i.toString(); });
            return res.join();
        };
        return AllPlacesSearch;
    }());
    Common.AllPlacesSearch = AllPlacesSearch;
})(Common || (Common = {}));
//# sourceMappingURL=AllPlacesSearch.js.map