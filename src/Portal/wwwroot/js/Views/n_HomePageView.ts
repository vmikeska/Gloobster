module Views {
		export class NHomePageView extends ViewBase {
	 
	 constructor() {		
		 super();
		
		 SettingsUtils.registerLocationCombo("currentCity", "CurrentLocation", () => {
				 window.location.href = "/Destination/planning";
		 });
	 }

	

		public get pageType(): PageType { return PageType.HomePage; }
	 
	}
}