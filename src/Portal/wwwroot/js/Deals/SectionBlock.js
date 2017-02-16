var Planning;
(function (Planning) {
    var AnytimeConfig = (function () {
        function AnytimeConfig() {
            this.type = PlanningType.Anytime;
        }
        AnytimeConfig.prototype.getCustomId = function () {
            return null;
        };
        AnytimeConfig.prototype.getGrouping = function () {
            return [Planning.LocationGrouping.ByCity, Planning.LocationGrouping.ByCountry, Planning.LocationGrouping.ByContinent];
        };
        return AnytimeConfig;
    }());
    Planning.AnytimeConfig = AnytimeConfig;
    var OrderCombo = (function () {
        function OrderCombo() {
            this.ocls = "opened";
            this.selected = Planning.LocationGrouping.ByCity;
        }
        OrderCombo.prototype.init = function ($sect, groupings) {
            var _this = this;
            this.$sect = $sect;
            this.$cmb = this.$sect.find(".order-combo");
            this.$win = this.$sect.find(".order-sel");
            this.$cmb.click(function (e) {
                var opened = _this.isOpened();
                _this.setState(!opened);
            });
            var items = [];
            groupings.forEach(function (i) {
                var item = {
                    id: i,
                    icon: "",
                    txt: ""
                };
                if (i === Planning.LocationGrouping.ByCity) {
                    item.icon = "city";
                    item.txt = "By city";
                }
                if (i === Planning.LocationGrouping.ByCountry) {
                    item.icon = "country";
                    item.txt = "By country";
                }
                if (i === Planning.LocationGrouping.ByContinent) {
                    item.icon = "continent";
                    item.txt = "By continent";
                }
                items.push(item);
            });
            var lg = Common.ListGenerator.init(this.$win.find(".items"), "grouping-itm-tmp");
            lg.evnt(null, function (e, $item, $target, item) {
                _this.selected = item.id;
                _this.setState(false);
                _this.setCmb(item.icon, item.txt);
            });
            lg.generateList(items);
        };
        OrderCombo.prototype.isOpened = function () {
            return this.$cmb.hasClass(this.ocls);
        };
        OrderCombo.prototype.setCmb = function (ico, txt) {
            this.$cmb.find(".sel-ico").attr("class", "icon-" + ico + " sel-ico");
            this.$cmb.find(".txt").html(txt);
        };
        OrderCombo.prototype.setState = function (opened) {
            if (opened) {
                this.$win.removeClass("hidden");
                this.$cmb.addClass(this.ocls);
            }
            else {
                this.$win.addClass("hidden");
                this.$cmb.removeClass(this.ocls);
            }
        };
        return OrderCombo;
    }());
    Planning.OrderCombo = OrderCombo;
    var SectionBlock = (function () {
        function SectionBlock() {
        }
        Object.defineProperty(SectionBlock.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        SectionBlock.prototype.init = function (type, $parentCont, catId, titleName) {
            this.$parentCont = $parentCont;
            this.type = type;
            this.createLayout(catId, titleName);
            this.initConfig(catId);
            var oc = new OrderCombo();
            oc.init(this.$parentCont, this.sectConfig.getGrouping());
            this.initEditBtns();
            this.planningTags = new PlanningTags(this.$parentCont, this.type);
            this.planningMap = new Planning.PlanningMap(this.sectConfig);
            this.editMap();
        };
        SectionBlock.prototype.initConfig = function (catId) {
            if (this.type === PlanningType.Anytime) {
                this.sectConfig = new AnytimeConfig();
            }
            this.sectConfig.catId = catId;
        };
        SectionBlock.prototype.initEditBtns = function () {
            var _this = this;
            this.$placesTagSel = this.$cont.find(".places-tag-sel");
            this.$placesMapSel = this.$cont.find(".places-map-sel");
            this.$cont.find(".edit-list").click(function (e) { _this.editList(); });
            this.$cont.find(".edit-map").click(function (e) { _this.editMap(); });
        };
        SectionBlock.prototype.editList = function () {
            if (this.$placesTagSel.hasClass("hidden")) {
                this.$placesMapSel.addClass("hidden");
                this.$placesTagSel.removeClass("hidden");
                this.planningTags.init();
            }
            else {
                this.$placesTagSel.addClass("hidden");
            }
        };
        SectionBlock.prototype.editMap = function () {
            if (this.$placesMapSel.hasClass("hidden")) {
                this.$placesTagSel.addClass("hidden");
                this.$placesMapSel.removeClass("hidden");
                this.planningMap.init();
            }
            else {
                this.$placesMapSel.addClass("hidden");
            }
        };
        SectionBlock.prototype.createLayout = function (catId, titleName) {
            var t = this.v.registerTemplate("category-block-template");
            var context = {
                catId: catId,
                titleName: titleName
            };
            this.$cont = $(t(context));
            this.$parentCont.append(this.$cont);
        };
        return SectionBlock;
    }());
    Planning.SectionBlock = SectionBlock;
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
//# sourceMappingURL=SectionBlock.js.map