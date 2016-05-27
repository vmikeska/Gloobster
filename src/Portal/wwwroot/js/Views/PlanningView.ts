module Views {

	export class PlanningData {

		private resultsEngine: Planning.ResultsManager;

		private tabsWeekendViews;
		private $tabsCont;
		private $cont;

		constructor() {
			this.resultsEngine = new Planning.ResultsManager();
			this.$tabsCont = $("#tabsCont");
			this.$cont = $("#results2");
		}

		public onSelectionChagned(id: string, newState: boolean, type: FlightCacheRecordType) {
			if (newState) {
				this.resultsEngine.selectionChanged(id, newState, type);
			}
		}

		public onMapTypeChanged(type: Planning.PlanningType) {

			this.$tabsCont.html("");
			this.$cont.html("");

			if (type === Planning.PlanningType.Weekend) {
					this.showWeekend();					
			}

			//WeekendByCityAggregator
				//currentTab
		}

		private showWeekend() {

			this.tabsWeekendViews = new TabsWeekendViews(this.$tabsCont);

			var byWeekDisplay = new Planning.WeekendByWeekDisplay(this.$cont);
			var byCityDisplay = new Planning.WeekendByCityDisplay(this.$cont);
			var byCountryDisplay = new Planning.WeekendByCountryDisplay(this.$cont);

			this.resultsEngine.initalCall();
			this.resultsEngine.onConnectionsChanged = (connections) => {

				var t = this.tabsWeekendViews.currentTab;

				if (t === TabsWeekendType.ByWeek) {
					byWeekDisplay.render(connections);
				}

				if (t === TabsWeekendType.ByCity) {
					byCityDisplay.render(connections);
				}

				if (t === TabsWeekendType.ByCountry) {
					byCountryDisplay.render(connections);
				}

			};

			this.tabsWeekendViews.onTabSwitched = (t: TabsWeekendType) => {

				this.$cont.html("");

				if (t === TabsWeekendType.ByWeek) {
					byWeekDisplay.render(this.resultsEngine.connections);
				}

				if (t === TabsWeekendType.ByCity) {
					byCityDisplay.render(this.resultsEngine.connections);
				}

				if (t === TabsWeekendType.ByCountry) {
						byCountryDisplay.render(this.resultsEngine.connections);
				}

			};
				
		}
			
	}


	export class PlanningView extends ViewBase {

		public planningMap: Planning.PlanningMap;

		public planningData: PlanningData;

		private maps: Maps.MapsCreatorMapBox2D;
		private tabsTime: TabsTime;
		private tabsWeekendViews: TabsWeekendViews;
			
		constructor() {
			super();

			this.planningData = new PlanningData();

			this.initialize();

			this.tabsTime = new TabsTime();
			this.tabsTime.onTabSwitched = ((tabType) => {
				this.planningMap.loadCategory(tabType);
			});				
		}

		public initialize() {
			this.maps = new Maps.MapsCreatorMapBox2D();
			this.maps.setRootElement("map");
			this.maps.show((map) => {
				this.planningMap = new Planning.PlanningMap(map);

				this.planningMap.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {
					this.planningData.onSelectionChagned(id, newState, type);					
				}
				this.planningMap.onMapTypeChanged = (type: Planning.PlanningType) => this.planningData.onMapTypeChanged(type);

				this.planningMap.loadCategory(Planning.PlanningType.Anytime);
			});

			var locationDialog = new LocationSettingsDialog();
		}


	}

	export class TabsTime {

		public onTabSwitched: Function;

		constructor() {
			this.registerTabEvents();
		}

		private anytimeTabTemplate: any;
		private weekendTabTemplate: any;
		private customTabTemplate: any;

		private registerTabEvents() {
			this.anytimeTabTemplate = ViewBase.currentView.registerTemplate("anytime-template");
			this.weekendTabTemplate = ViewBase.currentView.registerTemplate("weekend-template");
			this.customTabTemplate = ViewBase.currentView.registerTemplate("custom-template");

			var $tabsRoot = $("#TimeTab");
			var $tabs = $tabsRoot.find(".tab");
			$tabs.click((e) => {
				e.preventDefault();
				this.switchTab($(e.delegateTarget), $tabs);
			});
		}

		private switchTab($target, $tabs) {
			$tabs.removeClass("active");
			$target.addClass("active");

			var tabType = parseInt($target.data("type"));
			var tabHtml = "";
			if (tabType === Planning.PlanningType.Anytime) {
				tabHtml = this.anytimeTabTemplate();
			}
			if (tabType === Planning.PlanningType.Weekend) {
				tabHtml = this.weekendTabTemplate();
			}
			if (tabType === Planning.PlanningType.Custom) {
				tabHtml = this.customTabTemplate();
			}

			var $tabContent = $("#tabContent");
			$tabContent.html(tabHtml);

			if (this.onTabSwitched) {
				this.onTabSwitched(tabType);
			}
		}
	}

	export class TabsWeekendViews {

		public onTabSwitched: Function;
		public currentTab = TabsWeekendType.ByWeek;

		private tabsTemplate;

		constructor($tabsCont) {			
			this.tabsTemplate = ViewBase.currentView.registerTemplate("weekendTabs-template");
			$tabsCont.html(this.tabsTemplate);

			this.registerTabEvents();
		}

		private registerTabEvents() {

			var $tabsRoot = $("#TabsWeekendTime");
			var $tabs = $tabsRoot.find(".tab");
			$tabs.click((e) => {
				e.preventDefault();
				this.switchTab($(e.delegateTarget), $tabs);
			});
		}

		private switchTab($target, $tabs) {
			$tabs.removeClass("active");
			$target.addClass("active");

			var tabType = parseInt($target.data("type"));
			var tabHtml = "";

			var $tabContent = $("#tabContent");
			$tabContent.html(tabHtml);

			this.currentTab = tabType;
			if (this.onTabSwitched) {
				this.onTabSwitched(tabType);
			}
		}
	}


}