var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var DealsView = (function (_super) {
        __extends(DealsView, _super);
        function DealsView() {
            _super.call(this);
            this.$dealsCont = $(".deals-search-all");
            this.$classicCont = $(".classic-search-all");
            this.$catsCont = $("#catsCont");
        }
        Object.defineProperty(DealsView.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        DealsView.prototype.init = function () {
            var cs = new Planning.ClassicSearch();
            cs.init();
            this.initMainTabs();
            this.settings = new Planning.LocationSettingsDialog();
            this.initDeals();
        };
        DealsView.prototype.initDeals = function () {
            var ds = new Planning.DealsInitSettings(this.settings);
            ds.init(this.hasCity, this.hasAirs);
            var df = new Planning.DealsLevelFilter();
            this.anytimeCat = new Planning.SectionBlock();
            this.anytimeCat.init(PlanningType.Anytime, this.$catsCont, "catAnytime", "Anytime deals");
            this.weekendCat = new Planning.SectionBlock();
            this.weekendCat.init(PlanningType.Weekend, this.$catsCont, "catWeekend", "Weekend deals");
            this.initDealsCustom();
            this.initAddCustomBtn();
        };
        DealsView.prototype.initDealsCustom = function () {
            var _this = this;
            var sdl = new Planning.SearchDataLoader();
            sdl.getInitData(function (searches) {
                searches.forEach(function (s) {
                    _this.initDealCustom(s);
                });
            });
        };
        DealsView.prototype.initDealCustom = function (s) {
            var cs = new Planning.SectionBlock();
            cs.init(PlanningType.Custom, this.$catsCont, "catCustom_" + s.id, s.name, s.id);
            if (!s.started) {
                cs.setMenuContVisibility(true);
                var cf = new Planning.CustomForm(cs.$cont, s.id);
            }
        };
        DealsView.prototype.initAddCustomBtn = function () {
            var _this = this;
            $("#addCustom").click(function (e) {
                e.preventDefault();
                var sdl = new Planning.SearchDataLoader();
                sdl.createNewSearch(function (s) {
                    _this.initDealCustom(s);
                });
            });
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