module Views {
	export class PlanningView extends Views.ViewBase {

		private maps: Maps.MapsCreatorMapBox2D;

		constructor() {
			super();

			this.initialize();
		}

		public initialize() {
		 this.maps = new Maps.MapsCreatorMapBox2D();
			this.maps.setRootElement("map");
			this.maps.show((map) => {
				//this.mapsOperations = new PlanningMap(map);
				//this.mapsOperations.loadCategory(PlanningType.Anytime);
			});


		}


	}
}