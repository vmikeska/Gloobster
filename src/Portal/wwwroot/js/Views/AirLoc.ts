module Views {
		export class AirLoc {

				public static registerLocationCombo($c, callback: Function = null) {

						var c = new Common.PlaceSearchConfig();
						c.providers = "2";
						c.minCharsToSearch = 1;
						c.clearAfterSearch = false;
						c.selOjb = $c;

						var box = new Common.PlaceSearchBox(c);
						$c.change((e, request, place) => {
								var data = { gid: place.SourceId };
								ViewBase.currentView.apiPut("DealsCurrentLocation",
										data,
										(res) => {
												callback(place);
										});
						});

						return box;
				}
		}
}