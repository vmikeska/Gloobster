module Views {
		export class HomePageView extends ViewBase {

			constructor() {
				super();

				AirLoc.registerLocationCombo($("#currentCity"), (place) => {
						window.location.href = "/deals";
				});


				$("#myTest").click((e) => {
						e.preventDefault();

						var prms = [["firstQuery", "false"], ["timeType", "0"], ["ccs", "BG"]];
						
					  this.apiGet("Flights8", prms, (res) => {
						  var re = res;
					  });
				});

				$("#myTest2").click((e) => {
						e.preventDefault();

						var prms = [];

						this.apiGet("ExeTest", prms, (res) => {
								var re = res;
						});
				});

			}

			public get pageType(): PageType { return PageType.HomePage; }

	}
}