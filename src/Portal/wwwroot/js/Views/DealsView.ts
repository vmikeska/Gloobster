module Views {
		
		export class DealsView extends ViewBase {	
				private tabs;

			constructor() {
				super();
					
				var cs = new Planning.ClassicSearch();
				cs.init();

			}


		//	private initMainTabs() {
		//		this.tabs = new Common.Tabs($("#categoryNavi"), "category");
				
		//		this.tabs.addTab("tabClassics", "Classic", () => {
		//				var cs = new Planning.ClassicSearch();
		//				cs.init();
		//		});

		//		this.tabs.addTab("tabDeals", "Deals", () => {
		//				var deals = new Planning.DealsSearch();
		//				deals.init();
		//		});

				

		//		this.tabs.create();
		//}
		
	}

}