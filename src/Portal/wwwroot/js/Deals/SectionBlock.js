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
        SectionBlock.prototype.init = function (type, $parentCont, catId, titleName, hasAirs, customId) {
            var _this = this;
            if (customId === void 0) { customId = null; }
            this.$parentCont = $parentCont;
            this.type = type;
            this.createLayout(catId, titleName);
            this.initConfig(catId, customId);
            this.initFilter();
            this.initGroupingCombo();
            this.initBtns();
            this.planningTags = new Planning.PlanningTags(this.$cont, this.type, customId);
            this.planningMap = new Planning.PlanningMap(this.sectConfig, this.$cont);
            this.initDisplayer();
            this.initResultMgr();
            this.regInfo();
            this.initNameEdit();
            this.hasAnyPlaces(function (hasPlaces) {
                if (!hasPlaces) {
                    _this.editMap();
                }
            });
        };
        SectionBlock.prototype.refreshResults = function () {
            this.displayer.refresh(this.grouping.selected);
        };
        SectionBlock.prototype.regInfo = function () {
            var _this = this;
            this.$cont.find(".info-btn").click(function (e) {
                var $c = $("<div class=\"info-txt-wrap\"></div>");
                _this.$cont.find(".cat-drop-cont .cont").html($c);
                var txt = _this.getInfoTxt();
                $c.html(txt);
                _this.setMenuContVisibility(true);
            });
        };
        SectionBlock.prototype.initMapDisabler = function () {
            this.$cont.find(".map-disabler").click(function (e) {
                $("html,body").animate({ scrollTop: $("#dealsWizard").offset().top }, "slow");
            });
        };
        SectionBlock.prototype.hasAnyPlaces = function (callback) {
            var data = [["type", this.type.toString()], ["customId", this.sectConfig.customId], ["justCount", "true"]];
            this.v.apiGet("DealsPlaces", data, function (hasPlaces) {
                callback(hasPlaces);
            });
        };
        SectionBlock.prototype.initGroupingCombo = function () {
            var _this = this;
            this.grouping = new Planning.GroupCombo();
            this.grouping.init(this, this.$cont, this.sectConfig.getGrouping());
            this.grouping.onChange = function () {
                if (_this.displayer) {
                    _this.displayer.refresh(_this.grouping.selected);
                }
                _this.setMenuContVisibility(false);
            };
        };
        SectionBlock.prototype.getInfoTxt = function () {
            if (this.type === PlanningType.Anytime) {
                return this.v.t("InfoAnytime", "jsDeals");
            }
            if (this.type === PlanningType.Weekend) {
                return this.v.t("InfoWeekend", "jsDeals");
            }
            if (this.type === PlanningType.Custom) {
                return this.v.t("InfoCustom", "jsDeals");
            }
        };
        SectionBlock.prototype.initNameEdit = function () {
            var _this = this;
            if (this.type === PlanningType.Custom) {
                var $penBtn = this.$cont.find(".name-edit-btn");
                var $editGroup = this.$cont.find(".name-edit");
                var $titleName = this.$cont.find(".title-name");
                $penBtn.removeClass("hidden");
                $penBtn.click(function (e) {
                    $editGroup.removeClass("hidden");
                    $penBtn.addClass("hidden");
                    $titleName.addClass("hidden");
                });
                $editGroup.find(".save").click(function (e) {
                    e.preventDefault();
                    var name = $editGroup.find(".input").val();
                    var data = {
                        id: _this.sectConfig.customId,
                        name: "name",
                        value: name
                    };
                    _this.v.apiPut("CustomSearch", data, function () {
                        $titleName.html(name);
                        $editGroup.addClass("hidden");
                        $penBtn.removeClass("hidden");
                        $titleName.removeClass("hidden");
                    });
                });
            }
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
        SectionBlock.prototype.initEmptyResultsBtns = function () {
            var _this = this;
            this.$cont.find(".no-dests .ico-map").click(function (e) { _this.editMap(); });
            this.$cont.find(".no-dests .ico-search").click(function (e) { _this.editList(); });
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
                _this.displayer.showResults(queries, _this.grouping.selected);
                _this.initEmptyResultsBtns();
                _this.dealsEval = new Planning.DelasEval(_this.resultsEngine.timeType, queries);
                _this.dealsEval.countDeals();
                _this.callOnResultChange();
            };
            this.planningMap.onMapLoaded = function () {
            };
            this.planningMap.onSelectionChanged = function (id, newState, type) {
                var customId = _this.sectConfig.customId;
                _this.resultsEngine.selectionChanged(id, newState, type, customId);
            };
            this.planningTags.onSelectionChanged = function (id, newState, type) {
                var customId = _this.sectConfig.customId;
                _this.resultsEngine.selectionChanged(id, newState, type, customId);
            };
            this.resultsEngine.initalCall(this.type, this.sectConfig.customId);
        };
        SectionBlock.prototype.callOnResultChange = function () {
            if (this.onResultChange) {
                this.onResultChange();
            }
        };
        SectionBlock.prototype.initBtns = function () {
            var _this = this;
            this.$placesTagSel = this.$cont.find(".places-tag-sel");
            this.$placesMapSel = this.$cont.find(".places-map-sel");
            this.$placesTagSel.find(".form-close").click(function () {
                _this.$placesTagSel.addClass("hidden");
            });
            this.$placesMapSel.find(".form-close").click(function () {
                _this.$placesMapSel.addClass("hidden");
            });
            this.$cont.find(".edit-list").click(function (e) { _this.editList(); });
            this.$cont.find(".edit-map").click(function (e) { _this.editMap(); });
            if (this.type === PlanningType.Custom) {
                var t = this.v.registerTemplate("custom-bar-icons-tmp");
                var $t = $(t());
                var $c = this.$cont.find(".custom-icons");
                $c.prepend($t);
                $c.find(".settings").click(function (e) {
                    var cf = new Planning.CustomForm(_this.$cont, _this.sectConfig.customId);
                    _this.setMenuContVisibility(true);
                });
                $c.find(".delete").click(function (e) {
                    var cd = new Common.ConfirmDialog();
                    cd.create(_this.v.t("SearchRemoval", "jsDeals"), _this.v.t("SearchRemovalDlgBody", "jsDeals"), _this.v.t("Cancel", "jsLayout"), _this.v.t("Delete", "jsLayout"), function () {
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
        SectionBlock.prototype.hideAllPlaceEdits = function () {
            this.$placesMapSel.addClass("hidden");
            this.$placesTagSel.removeClass("hidden");
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