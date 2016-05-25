module Views {

	export class PlanningData {

		private resultsEngine: Planning.ResultsManager;

		private tabsWeekendViews;

		constructor() {
			this.resultsEngine = new Planning.ResultsManager();
		}

		public onSelectionChagned(id: string, newState: boolean, type: FlightCacheRecordType) {
			if (newState) {
				this.resultsEngine.selectionChanged(id, newState, type);
			}
		}

		public onMapTypeChanged(type: Planning.PlanningType) {

			if (type === Planning.PlanningType.Weekend) {
				this.showWeekend();
			}

		}

		private showWeekend() {

			this.tabsWeekendViews = new TabsWeekendViews($("#tabsCont"));
			this.tabsWeekendViews.onTabSwitched = (type: TabsWeekendType) => {
					if (type === TabsWeekendType.ByWeek)
					this.showWeekendByWeek(type);
			};
				
		}

		private showWeekendByWeek(type: TabsWeekendType) {
				var weekendDisplay = new Planning.WeekendByWeekDisplay();

				this.resultsEngine.initalCall();
				this.resultsEngine.onConnectionsChanged = (connections) => {
						weekendDisplay.displayByWeek(connections);
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

			if (this.onTabSwitched) {
				this.onTabSwitched(tabType);
			}
		}
	}


}