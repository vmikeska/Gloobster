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
				
			if (type === Planning.PlanningType.Anytime) {
					this.showAnytime();
			}

			if (type === Planning.PlanningType.Weekend) {
					this.showWeekend();					
			}

			//WeekendByCityAggregator
				//currentTab
		}


		private showAnytime() {
			var display = new Planning.AnytimeDisplay(this.$cont);

			var fromDays = 1;
			var toDays = 20;

			this.resultsEngine.initalCall(0);
			this.resultsEngine.onConnectionsChanged = (connections) => {
				display.render(this.resultsEngine.connections, fromDays, toDays);
			};

			display.genDaysSlider(fromDays, toDays);
		}

		private showWeekend() {

			this.tabsWeekendViews = new TabsWeekendViews(this.$tabsCont);
				
			this.resultsEngine.initalCall(1);
			this.resultsEngine.onConnectionsChanged = (connections) => {
				var t = this.tabsWeekendViews.currentTab;
				this.renderWeekend(t);
			};

			this.tabsWeekendViews.onTabSwitched = (t: TabsWeekendType) => {
				this.$cont.html("");
				this.renderWeekend(t);
			};
				
		}

		private renderWeekend(t: TabsWeekendType) {
				
				if (t === TabsWeekendType.ByWeek) {
						var d1 = new Planning.WeekendByWeekDisplay(this.$cont);
						d1.render(this.resultsEngine.connections);
				}

				if (t === TabsWeekendType.ByCity) {
						var d2 = new Planning.WeekendByCityDisplay(this.$cont);
						d2.render(this.resultsEngine.connections);
				}

				if (t === TabsWeekendType.ByCountry) {
						var d3 = new Planning.WeekendByCountryDisplay(this.$cont);
						d3.render(this.resultsEngine.connections);
				}
		}

			
	}


	export class FlyView extends ViewBase {

		public planningMap: Planning.PlanningMap;

		public planningData: PlanningData;

		private maps: Maps.MapsCreatorMapBox2D;		
		private tabsWeekendViews: TabsWeekendViews;

		private tabs;

		private anytimeTabTemplate: any;
		private weekendTabTemplate: any;
		private customTabTemplate: any;


		constructor() {
			super();

			this.anytimeTabTemplate = ViewBase.currentView.registerTemplate("anytime-template");
			this.weekendTabTemplate = ViewBase.currentView.registerTemplate("weekend-template");
			this.customTabTemplate = ViewBase.currentView.registerTemplate("custom-template");

			this.planningData = new PlanningData();

			this.initialize();
				
		}

		private initTabs() {

				var tabHtml = "";
				var $tabContent = $("#tabContent");				

				this.tabs = new Planning.Tabs($("#naviCont"), "main", 50);
				this.tabs.addTab("tabAnytime", "Anytime", () => {
						tabHtml = this.anytimeTabTemplate();
						$tabContent.html(tabHtml);
						this.planningMap.loadCategory(0);
				});
				this.tabs.addTab("tabWeekend", "Weekend", () => {
						tabHtml = this.weekendTabTemplate();
						$tabContent.html(tabHtml);
						this.planningMap.loadCategory(1);
				});

				this.tabs.addTab("tabCustom", "Custom", () => {
						tabHtml = this.customTabTemplate();
						$tabContent.html(tabHtml);
						this.planningMap.loadCategory(2);
				});
				this.tabs.create();
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

			this.initTabs();
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