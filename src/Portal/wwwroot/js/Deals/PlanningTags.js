var Planning;
(function (Planning) {
    var PlanningTags = (function () {
        function PlanningTags($cont, type) {
            this.$cont = $cont;
            this.type = type;
        }
        Object.defineProperty(PlanningTags.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        PlanningTags.prototype.init = function () {
            var _this = this;
            this.getPlaces(function (places) {
                _this.genPlaces(places);
            });
            var placeSearch = new Common.AllPlacesSearch(this.$cont.find(".place-search"), this.v);
            placeSearch.onPlaceSelected = function (r) {
                if (r.SourceType === SourceType.City) {
                    _this.changeCitySel(r.SourceId, true, function () {
                        _this.getPlaces(function (places) {
                            _this.genPlaces(places);
                        });
                    });
                }
                if (r.SourceType === SourceType.Country) {
                    _this.changeCountrySel(r.SourceId, true, function () {
                        _this.getPlaces(function (places) {
                            _this.genPlaces(places);
                        });
                    });
                }
            };
        };
        PlanningTags.prototype.changeCountrySel = function (cc, state, callback) {
            if (callback === void 0) { callback = null; }
            var data = {
                type: this.type,
                cc: cc,
                selected: state,
                customId: null
            };
            this.v.apiPut("SelCountry", data, function () {
                callback();
            });
        };
        PlanningTags.prototype.changeCitySel = function (gid, state, callback) {
            if (callback === void 0) { callback = null; }
            var data = {
                type: this.type,
                gid: gid,
                selected: state,
                customId: null
            };
            this.v.apiPut("SelCity", data, function () {
                callback();
            });
        };
        PlanningTags.prototype.getPlaces = function (callback) {
            var data = [["type", this.type.toString()]];
            this.v.apiGet("DealsPlaces", data, function (places) {
                callback(places);
            });
        };
        PlanningTags.prototype.genPlaces = function (places) {
            var _this = this;
            var lgc = Common.ListGenerator.init(this.$cont.find(".places-cont"), "map-place-item");
            lgc.clearCont = true;
            lgc.customMapping = function (item) {
                return {
                    id: item.code,
                    name: item.name,
                    type: item.type
                };
            };
            lgc.evnt(".close", function (e, $item, $target, item) {
                if (item.type === FlightCacheRecordType.City) {
                    _this.changeCitySel(item.code, false, function () {
                        $item.remove();
                    });
                }
                if (item.type === FlightCacheRecordType.Country) {
                    _this.changeCountrySel(item.code, false, function () {
                        $item.remove();
                    });
                }
            });
            lgc.generateList(places);
        };
        return PlanningTags;
    }());
    Planning.PlanningTags = PlanningTags;
})(Planning || (Planning = {}));
//# sourceMappingURL=PlanningTags.js.map