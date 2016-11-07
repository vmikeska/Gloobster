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