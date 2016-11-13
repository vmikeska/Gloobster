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
				
			this.resultsEngine = new Planning.ResultsManager();

			this.initialize();

			//remove this when not needed
			//var lst = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
			//var lg = Common.ListGenerator.init($("#myTestx"), "list-tst-template");
			//lg.isAsync = true;
			//lg.customMapping = (i) => {

			//		return {v: i}
			//};
		 // lg.generateList(lst);


		}
			
		private initTabs() {
				
				this.tabs = new Planning.Tabs($("#naviCont"), "main", 50);

				this.tabs.onBeforeSwitch = () => {
						this.$cont.empty();
						this.$filter.empty();
				}

				this.tabs.addTab("tabAnytime", "Anytime", () => {
					this.setAnytime();						
				});
				this.tabs.addTab("tabWeekend", "Weekend", () => {
					this.setWeekend();						
				});

				this.tabs.addTab("tabCustom", "Custom", () => {
						//tabHtml = this.customTabTemplate();
						//$tabContent.html(tabHtml);
						//this.planningMap.loadCategory(2);
				});
				this.tabs.create();
		}

		private setAnytime() {				
				var s = new Planning.AnytimePageSetter(this);
				s.init();
				
				this.planningMap.loadCategory(0);
				
				this.resultsEngine.initalCall(0);
				this.resultsEngine.onConnectionsChanged = (connections) => {
						s.setConnections(connections);					
				};				
		}

		private setWeekend() {
				var s = new Planning.WeekendPageSetter(this);				
				s.init();

				this.planningMap.loadCategory(1);

				this.resultsEngine.initalCall(1);
				this.resultsEngine.onConnectionsChanged = (connections) => {
						s.setConnections(connections);						
				};
		}

		public initialize() {
			this.maps = new Maps.MapsCreatorMapBox2D();
			this.maps.setRootElement("map");
			this.maps.show((map) => {
				this.planningMap = new Planning.PlanningMap(map);

				this.planningMap.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {
						if (newState) {
								this.resultsEngine.selectionChanged(id, newState, type);
						}						
				}
				
				this.planningMap.loadCategory(Planning.PlanningType.Anytime);
					
			});

			var locationDialog = new LocationSettingsDialog();

			this.initTabs();
		}			
	} 

}