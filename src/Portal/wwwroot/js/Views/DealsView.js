var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
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
        SectionBlock.prototype.init = function (type, $cont) {
            var _this = this;
            this.$cont = $cont;
            this.type = type;
            this.$placesTagSel = this.$cont.find(".places-tag-sel");
            this.$placesMapSel = this.$cont.find(".places-map-sel");
            this.$cont.find(".edit-list").click(function (e) {
                _this.$placesTagSel.toggleClass("hidden");
                if (!_this.$placesTagSel.hasClass("hidden")) {
                    _this.getPlaces(function (places) {
                        _this.genPlaces(places);
                    });
                }
            });
            this.initPlaceTagSearch();
        };
        SectionBlock.prototype.initPlaceTagSearch = function () {
            var _this = this;
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
        SectionBlock.prototype.changeCountrySel = function (cc, state, callback) {
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
        SectionBlock.prototype.changeCitySel = function (gid, state, callback) {
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
        SectionBlock.prototype.getPlaces = function (callback) {
            var data = [["type", this.type.toString()]];
            this.v.apiGet("DealsPlaces", data, function (places) {
                callback(places);
            });
        };
        SectionBlock.prototype.genPlaces = function (places) {
            var lgc = Common.ListGenerator.init(this.$cont.find(".places-cont"), "map-place-item");
            lgc.clearCont = true;
            lgc.customMapping = function (item) {
                return {
                    id: item.conde,
                    name: item.name,
                    type: item.type
                };
            };
            lgc.generateList(places);
        };
        return SectionBlock;
    }());
    Views.SectionBlock = SectionBlock;
    var DealsView = (function (_super) {
        __extends(DealsView, _super);
        function DealsView() {
            _super.call(this);
            this.$dealsCont = $(".deals-search-all");
            this.$classicCont = $(".classic-search-all");
        }
        DealsView.prototype.init = function () {
            var cs = new Planning.ClassicSearch();
            cs.init();
            this.initMainTabs();
            this.settings = new Planning.LocationSettingsDialog();
            var ds = new Planning.DealsInitSettings(this.settings);
            ds.init(this.hasCity, this.hasAirs);
            var sb = new SectionBlock();
            sb.init(PlanningType.Anytime, $("#placesWinAnytime"));
        };
        DealsView.prototype.initMainTabs = function () {
            var _this = this;
            this.tabs = new Common.Tabs($("#categoryNavi"), "category");
            this.tabs.addTab("tabDeals", "Deals search", function () {
                _this.setTab(true);
            });
            this.tabs.addTab("tabClassics", "Classic search", function () {
                _this.setTab(false);
            });
            this.tabs.create();
        };
        DealsView.prototype.setTab = function (deals) {
            if (deals) {
                this.$dealsCont.removeClass("hidden");
                this.$classicCont.addClass("hidden");
            }
            else {
                this.$classicCont.removeClass("hidden");
                this.$dealsCont.addClass("hidden");
            }
        };
        return DealsView;
    }(Views.ViewBase));
    Views.DealsView = DealsView;
})(Views || (Views = {}));
//# sourceMappingURL=DealsView.js.map