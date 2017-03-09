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
            var _this = this;
            _super.call(this);
            this.$dealsCont = $(".deals-search-cont");
            this.$classicCont = $(".classic-search-cont");
            this.$catsCont = $("#catsCont");
            this.allSections = [];
            this.tabDealsId = "tabDeals";
            this.tabClassicsId = "tabClassics";
            this.loginButtonsManager.onAfterCustom = function () {
                _this.allSections.forEach(function (s) {
                    window.location.reload(true);
                });
            };
        }
        Object.defineProperty(DealsView.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        DealsView.prototype.init = function () {
            Planning.ResultConfigs.init();
            this.decideSize();
            this.initTopBar();
            this.initDeals();
            this.classicSearch = new Planning.ClassicSearch();
            this.classicSearch.init();
            this.initMainTabs();
            this.initResize();
        };
        DealsView.prototype.initTopBar = function () {
            var _this = this;
            this.settings = new Planning.LocationSettingsDialog(this);
            this.settings.initTopBar(this.hasCity, this.hasAirs);
            $(".top-all .dlg-btn-wrap")
                .click(function (e) {
                e.preventDefault();
                _this.settings.initDlg();
            });
        };
        DealsView.prototype.countDelasCnt = function () {
            var res = { Excellent: 0, Good: 0, Standard: 0 };
            this.allSections.forEach(function (s) {
                res.Excellent += s.dealsEval.res.Excellent;
                res.Good += s.dealsEval.res.Good;
                res.Standard += s.dealsEval.res.Standard;
            });
            $("#delasEx").html(res.Excellent);
            $("#delasGo").html(res.Good);
            $("#delasSt").html(res.Standard);
        };
        DealsView.prototype.initDeals = function () {
            var _this = this;
            var ds = new Planning.DealsInitSettings(this.settings);
            ds.init(this.hasCity, this.hasAirs);
            ds.onThirdStep = function () {
                _this.allSections.forEach(function (s) {
                    Views.ViewBase.scrollTo($("#catsCont"));
                });
            };
            var df = new Planning.DealsLevelFilter();
            df.stateChanged = function () {
                _this.allSections.forEach(function (s) {
                    s.refreshResults();
                });
            };
            this.anytimeCat = new Planning.SectionBlock();
            this.anytimeCat.init(PlanningType.Anytime, this.$catsCont, "catAnytime", this.v.t("SectionTitleAnytime", "jsDeals"), this.hasAirs);
            this.anytimeCat.onResultChange = function () {
                _this.countDelasCnt();
            };
            this.allSections.push(this.anytimeCat);
            this.weekendCat = new Planning.SectionBlock();
            this.weekendCat.init(PlanningType.Weekend, this.$catsCont, "catWeekend", this.v.t("SectionTitleWeekend", "jsDeals"), this.hasAirs);
            this.weekendCat.onResultChange = function () {
                _this.countDelasCnt();
            };
            this.allSections.push(this.weekendCat);
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
            var _this = this;
            var cs = new Planning.SectionBlock();
            cs.init(PlanningType.Custom, this.$catsCont, "catCustom_" + s.id, s.name, this.hasAirs, s.id);
            cs.onResultChange = function () {
                _this.countDelasCnt();
            };
            this.allSections.push(cs);
            if (!s.started) {
                cs.setMenuContVisibility(true);
                var cf = new Planning.CustomForm(cs.$cont, s.id);
            }
        };
        DealsView.prototype.initAddCustomBtn = function () {
            var _this = this;
            $("#addCustom")
                .click(function (e) {
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
            this.tabs.initCall = false;
            this.tabs.addTab(this.tabDealsId, this.v.t("DealsSearchTab", "jsDeals"), function () {
                _this.setTab(true);
            });
            this.tabs.addTab(this.tabClassicsId, this.v.t("ClasssicSearchTab", "jsDeals"), function () {
                _this.setTab(false);
                _this.classicSearch.stateChanged();
            });
            this.tabs.create();
            var type = this.getUrlParam("type");
            if (type) {
                if (type === "0") {
                    this.setTab(true);
                }
                if (type === "1") {
                    this.setTab(false);
                    this.tabs.activateTab($("#" + this.tabClassicsId));
                    this.classicSearch.initComps();
                }
            }
            else {
                this.setTab(true);
            }
        };
        DealsView.prototype.setTab = function (deals) {
            if (deals) {
                this.$dealsCont.removeClass("hidden");
                this.$classicCont.addClass("hidden");
                window.history.replaceState("", "gloobster.com", "/deals?type=0");
            }
            else {
                this.$classicCont.removeClass("hidden");
                this.$dealsCont.addClass("hidden");
            }
            this.settings.showRatingFilter(deals);
        };
        DealsView.prototype.initResize = function () {
            var _this = this;
            $(window).resize(function () {
                _this.decideSize();
            });
        };
        DealsView.prototype.onListSizeChange = function () {
            this.allSections.forEach(function (s) {
                s.refreshResults();
            });
        };
        DealsView.prototype.getNewListSize = function (currentWidth) {
            var s = currentWidth > 650 ? ListSize.Big : ListSize.Small;
            return s;
        };
        DealsView.prototype.decideSize = function () {
            var currentWidth = $(window).width();
            var newListSize = this.getNewListSize(currentWidth);
            if (DealsView.listSize === ListSize.None) {
                DealsView.listSize = newListSize;
                return;
            }
            if (DealsView.listSize !== newListSize) {
                DealsView.listSize = newListSize;
                this.onListSizeChange();
            }
        };
        DealsView.listSize = ListSize.None;
        return DealsView;
    }(Views.ViewBase));
    Views.DealsView = DealsView;
})(Views || (Views = {}));
//# sourceMappingURL=DealsView.js.map