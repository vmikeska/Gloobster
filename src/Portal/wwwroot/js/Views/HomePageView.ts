module Views {

		
		export class HomePageView extends ViewBase {

			constructor() {
				super();

				AirLoc.registerLocationCombo($("#currentCity"), (place) => {
						window.location.href = "/deals";
				});
					
			}

			public get pageType(): PageType { return PageType.HomePage; }

	}
}