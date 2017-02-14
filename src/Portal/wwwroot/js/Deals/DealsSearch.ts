module Planning {

		export class DealsSearch {
			private locDlg: LocationSettingsDialog;			

			public currentSetter: Planning.IPageSetter;
			public planningMap: Planning.PlanningMap;
			public resultsEngine: Planning.ResultsManager;
				
			private tabs;
			private $resultsCont;
			private $filter;
			private $mainCont;
				
			public get v(): Views.ViewBase {
				return Views.ViewBase.currentView;
			}

			constructor() {
				this.$mainCont = $("#categoryCont");
				this.createLayout();

				this.$resultsCont = $("#resultsCont");
				this.$filter = $("#filterCont");
			}

			private createLayout() {
				var tmp = this.v.registerTemplate("deals-template");
				var $deals = $(tmp());
				this.$mainCont.html($deals);				
			}

			public showAirsFirst() {
					var id = new Common.InfoDialog();
					id.create(this.v.t("NoAirsTitle", "jsDeals"), this.v.t("NoAirsBody", "jsDeals"));
			}

			public get hasAirs(): boolean {
					return this.locDlg.hasAirports();
			}

			public init() {
					this.resultsEngine = new Planning.ResultsManager();

					this.resultsEngine.onDrawQueue = () => {
							var qv = new Planning.QueueVisualize();

							if (any(this.resultsEngine.queue)) {
									qv.draw(this.resultsEngine.timeType, this.resultsEngine.queue);
							} else {
									qv.hide();
							}
					}

					this.resultsEngine.onResultsChanged = (queries) => {
							this.currentSetter.setQueries(queries);

							var de = new Planning.DelasEval(this.resultsEngine.timeType, queries);
							de.dispayDeals();
					};

					this.planningMap = new Planning.PlanningMap(this);

					this.planningMap.onMapLoaded = () => {
							this.changeSetter(PlanningType.Anytime);
					}

					this.planningMap.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {

							var customId = this.currentSetter.getCustomId();
							this.resultsEngine.selectionChanged(id, newState, type, customId);
					}

					this.planningMap.init();


					this.mapSwitch((type) => {
							this.planningMap.changeViewType(type);
					});


					this.locDlg = new Planning.LocationSettingsDialog();

					this.initDealsTabs();
			}

			public enableMap(state) {
					var disabler = $("#mapDisabler");
					if (state) {
							disabler.removeClass("map-disabled");
					} else {
							disabler.addClass("map-disabled");
					}
			}

			private mapSwitch(callback) {
					var $cont = $(".map-type-switch");
					var $btns = $cont.find(".btn");
					$btns.click((e) => {
							var $t = $(e.target);
							var type = $t.hasClass("country") ? FlightCacheRecordType.Country : FlightCacheRecordType.City;

							if (type === this.planningMap.viewType) {
									return;
							}

							$btns.removeClass("active");
							$t.addClass("active");


							callback(type);
					});
			}

			private initDealsTabs() {

					this.tabs = new Common.Tabs($("#naviCont"), "main");
					this.tabs.initCall = false;
					this.tabs.onBeforeSwitch = () => {
							this.enableMap(true);
							this.$resultsCont.empty();
							this.$filter.empty();
					}

					this.tabs.addTab("tabAnytime", this.v.t("TabAnytime", "jsDeals"), () => {
							this.changeSetter(PlanningType.Anytime);
					});
					this.tabs.addTab("tabWeekend", this.v.t("TabWeekend", "jsDeals"), () => {
							this.changeSetter(PlanningType.Weekend);
					});

					this.tabs.addTab("tabCustom", this.v.t("TabCustom", "jsDeals"), () => {
							this.changeSetter(PlanningType.Custom);
					});
					
					this.tabs.create();
			}

			private changeSetter(type: PlanningType) {

					$("#tabContent").empty();

					if (type === PlanningType.Anytime) {
							this.currentSetter = new Planning.AnytimePageSetter(this);
					}
					if (type === PlanningType.Weekend) {
							this.currentSetter = new Planning.WeekendPageSetter(this);
					}

					if (type === PlanningType.Custom) {
							this.currentSetter = new Planning.CustomPageSetter(this);
					}

					this.currentSetter.init(() => {
							this.planningMap.loadCategory(type);

							var customId = this.currentSetter.getCustomId();

							this.resultsEngine.initalCall(type, customId);
					});

			}

		}

		

}