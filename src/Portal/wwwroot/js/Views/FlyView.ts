module Views {

		

	export class FlyView extends ViewBase {

		public planningMap: Planning.PlanningMap;

		private resultsEngine: Planning.ResultsManager;

		private maps: Maps.MapsCreatorMapBox2D;

		private tabs;

		private $cont = $("#resultsCont");
		private $filter = $("#filterCont");

		constructor() {
			super();

			this.initialize();


			var cf = new Planning.CustomFrom(this);			
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

		private currentSetter: Planning.IPageSetter;

		private changeSetter(type: PlanningType) {
			if (type === PlanningType.Anytime) {
				this.currentSetter = new Planning.AnytimePageSetter(this);
			}
			if (type === PlanningType.Weekend) {
				this.currentSetter = new Planning.WeekendPageSetter(this);
			}

			if (type === PlanningType.Custom) {
					this.currentSetter = new Planning.CustomPageSetter(this);
			}

			this.currentSetter.init();

			this.planningMap.loadCategory(type);

			this.resultsEngine.initalCall(type);

		}

		public initialize() {
			this.resultsEngine = new Planning.ResultsManager();
			this.resultsEngine.onConnectionsChanged = (connections) => {
				this.currentSetter.setConnections(connections);
			};


			this.planningMap = new Planning.PlanningMap();

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


			var locationDialog = new LocationSettingsDialog();

			this.initTabs();
		}
	}

}