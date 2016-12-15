module Views {

	export class DelasEval {

		private timeType: PlanningType;
		private queries;

		private res = { Excellent: 0, Good: 0, Standard: 0 };

		constructor(timeType: PlanningType, queries) {
			this.timeType = timeType;
			this.queries = queries;
		}
			
		private countDeals() {
				Planning.FlightsExtractor.f(this.queries, (f, r, q) => {
						var stars = Planning.AnytimeAggUtils.getScoreStars(f.score);
						this.incCategory(stars);
				});				
		}

		private incCategory(stars) {
			if (stars >= 4) {
				this.res.Excellent++;
			} else if (stars >= 2) {
				this.res.Good++;
			} else {
				this.res.Standard++;
			}
		}


		public dispayDeals() {
			this.countDeals();

			$("#delasEx").html(this.res.Excellent);
			$("#delasGo").html(this.res.Good);
			$("#delasSt").html(this.res.Standard);
		}
	}

	export class FlyView extends ViewBase {

		public currentSetter: Planning.IPageSetter;
		public planningMap: Planning.PlanningMap;
		public resultsEngine: Planning.ResultsManager;

		private locDlg: LocationSettingsDialog;			
		private tabs;
		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");
	
		constructor() {
			super();

			this.initialize();
		}

		public showAirsFirst() {
				var id = new Common.InfoDialog();
				id.create("No airports", "Location and airports must be selected first");				
		}

		public get hasAirs(): boolean {
				return this.locDlg.hasAirports();
		}

		public initialize() {
				this.resultsEngine = new Planning.ResultsManager();
				this.resultsEngine.onResultsChanged = (queries) => {
						this.currentSetter.setQueries(queries);

						var de = new DelasEval(this.resultsEngine.timeType, queries);
						de.dispayDeals();
				};

				this.planningMap = new Planning.PlanningMap(this);

				this.planningMap.onMapLoaded = () => {
						this.changeSetter(PlanningType.Anytime);
				}

				this.planningMap.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {
						this.resultsEngine.selectionChanged(id, newState, type);
				}

				this.planningMap.init();


				this.mapSwitch((type) => {
						this.planningMap.changeViewType(type);
				});


				this.locDlg = new LocationSettingsDialog(this);

				this.initTabs();
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

		private initTabs() {

			this.tabs = new Common.Tabs($("#naviCont"), "main");
			this.tabs.initCall = false;
			this.tabs.onBeforeSwitch = () => {
				this.$cont.empty();
				this.$filter.empty();
			}

			this.tabs.addTab("tabAnytime", "All deals", () => {
					this.changeSetter(PlanningType.Anytime);
				});
			this.tabs.addTab("tabWeekend", "Weekend deals", () => {
					this.changeSetter(PlanningType.Weekend);
				});

			this.tabs.addTab("tabCustom", "Long term search", () => {
					this.changeSetter(PlanningType.Custom);					
				});

			this.tabs.addTab("tabClassic", "Classic search", () => {

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

					this.resultsEngine.initalCall(type);					
			});
				
		}
			
	}

}