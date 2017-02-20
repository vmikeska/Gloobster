var Planning;
(function (Planning) {
    var AnytimeConfig = (function () {
        function AnytimeConfig() {
            this.customId = null;
            this.type = PlanningType.Anytime;
        }
        AnytimeConfig.prototype.getGrouping = function () {
            return [Planning.LocationGrouping.ByCity, Planning.LocationGrouping.ByCountry, Planning.LocationGrouping.ByContinent];
        };
        return AnytimeConfig;
    }());
    Planning.AnytimeConfig = AnytimeConfig;
    var WeekendConfig = (function () {
        function WeekendConfig() {
            this.customId = null;
            this.type = PlanningType.Weekend;
        }
        WeekendConfig.prototype.getGrouping = function () {
            return [Planning.LocationGrouping.ByCity, Planning.LocationGrouping.ByCountry];
        };
        return WeekendConfig;
    }());
    Planning.WeekendConfig = WeekendConfig;
    var CustomConfig = (function () {
        function CustomConfig(customId) {
            this.type = PlanningType.Custom;
            this.customId = customId;
        }
        CustomConfig.prototype.getGrouping = function () {
            return [Planning.LocationGrouping.ByCity, Planning.LocationGrouping.ByCountry, Planning.LocationGrouping.ByContinent];
        };
        return CustomConfig;
    }());
    Planning.CustomConfig = CustomConfig;
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
        SectionBlock.prototype.init = function (type, $parentCont, catId, titleName, customId) {
            if (customId === void 0) { customId = null; }
            this.$parentCont = $parentCont;
            this.type = type;
            this.createLayout(catId, titleName);
            this.initConfig(catId, customId);
            this.initFilter();
            this.initGroupingCombo();
            this.initBtns();
            this.planningTags = new Planning.PlanningTags(this.$cont, this.type);
            this.planningMap = new Planning.PlanningMap(this.sectConfig);
            this.initDisplayer();
            this.initResultMgr();
        };
        SectionBlock.prototype.initGroupingCombo = function () {
            var _this = this;
            this.grouping = new Planning.GroupCombo();
            this.grouping.init(this, this.$cont, this.sectConfig.getGrouping());
            this.grouping.onChange = function () {
                if (_this.displayer) {
                    _this.displayer.refresh(_this.grouping.selected);
                }
            };
        };
        SectionBlock.prototype.initConfig = function (catId, customId) {
            if (this.type === PlanningType.Anytime) {
                this.sectConfig = new AnytimeConfig();
            }
            if (this.type === PlanningType.Weekend) {
                this.sectConfig = new WeekendConfig();
            }
            if (this.type === PlanningType.Custom) {
                this.sectConfig = new CustomConfig(customId);
            }
            this.sectConfig.catId = catId;
        };
        SectionBlock.prototype.initDisplayer = function () {
            if (this.type === PlanningType.Anytime) {
                this.displayer = new Planning.AnytimeDisplayer(this.$cont);
            }
            if (this.type === PlanningType.Weekend) {
                this.displayer = new Planning.WeekendDisplayer(this.$cont.find(".cat-res"), this.filter);
            }
            if (this.type === PlanningType.Custom) {
                this.displayer = new Planning.AnytimeDisplayer(this.$cont);
            }
        };
        SectionBlock.prototype.initFilter = function () {
            var _this = this;
            var $f = this.$cont.find(".cat-filter");
            if (this.type === PlanningType.Weekend) {
                var t = this.v.registerTemplate("filtering-weekend-template");
                var $t = $(t());
                $f.html($t);
                this.filter = new Planning.DaysFilter($f.find("#cbUseDaysFilter"), $f.find(".days-filter"));
                this.filter.onFilterChange = function () {
                    _this.displayer.refresh(_this.grouping.selected);
                };
                this.filter.init(false);
            }
        };
        SectionBlock.prototype.initResultMgr = function () {
            var _this = this;
            this.resultsEngine = new Planning.ResultsManager();
            this.resultsEngine.onDrawQueue = function () {
                var qv = new Planning.QueueVisualize(_this.$cont);
                if (any(_this.resultsEngine.queue)) {
                    qv.draw(_this.resultsEngine.timeType, _this.resultsEngine.queue);
                }
                else {
                    qv.hide();
                }
            };
            this.resultsEngine.onResultsChanged = function (queries) {
                if (_this.displayer) {
                    _this.displayer.showResults(queries, _this.grouping.selected);
                }
            };
            this.planningMap.onMapLoaded = function () {
            };
            this.planningMap.onSelectionChanged = function (id, newState, type) {
                var customId = _this.sectConfig.customId;
                _this.resultsEngine.selectionChanged(id, newState, type, customId);
            };
            this.resultsEngine.initalCall(this.type, this.sectConfig.customId);
        };
        SectionBlock.prototype.showData = function () {
        };
        SectionBlock.prototype.initBtns = function () {
            var _this = this;
            this.$placesTagSel = this.$cont.find(".places-tag-sel");
            this.$placesMapSel = this.$cont.find(".places-map-sel");
            this.$cont.find(".edit-list").click(function (e) { _this.editList(); });
            this.$cont.find(".edit-map").click(function (e) { _this.editMap(); });
            if (this.type === PlanningType.Custom) {
                var t = this.v.registerTemplate("custom-bar-icons-tmp");
                var $t = $(t());
                var $c = this.$cont.find(".icons-wrap");
                $c.prepend($t);
                $c.find(".settings").click(function (e) {
                    var cf = new Planning.CustomForm(_this.$cont, _this.sectConfig.customId);
                    _this.setMenuContVisibility(true);
                });
                $c.find(".delete").click(function (e) {
                    var cd = new Common.ConfirmDialog();
                    cd.create("Search removal", "Would you like to delete this search?", "Cancel", "Delete", function () {
                        var sdl = new Planning.SearchDataLoader();
                        sdl.deleteSearch(_this.sectConfig.customId, function () {
                            _this.$cont.remove();
                        });
                    });
                });
            }
            var $menuCont = this.$cont.find(".cat-drop-cont");
            $menuCont.find(".form-close").click(function (e) {
                _this.setMenuContVisibility(false);
                _this.grouping.reset();
            });
        };
        SectionBlock.prototype.setMenuContVisibility = function (state) {
            var $c = this.$cont.find(".cat-drop-cont");
            var $fc = $c.find(".form-close");
            if (state) {
                $c.slideDown(function () {
                    $fc.show();
                });
            }
            else {
                $fc.hide();
                $c.slideUp(function () {
                });
            }
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
})(Planning || (Planning = {}));
//# sourceMappingURL=SectionBlock.js.map