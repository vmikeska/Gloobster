module Views {

	export class TravelBMgmt extends ViewBase {

			constructor() {
				super();

				this.initCombo();
				this.genMP();
			}

			private genMP() {
					var $mp = $("#mPoints");

					this.apiGet("meetingPoint", [["all", "true"]], (mps) => {
						mps.forEach((mp) => {
							$mp.append(`<div>${mp.text}</div>`);
						});
					});
			}

			private initCombo() {
					var c = new Common.PlaceSearchConfig();
					c.providers = "1,0,4";
					c.selOjb = $("#place");
					c.minCharsToSearch = 1;
					c.clearAfterSearch = true;

					var combo = new Common.PlaceSearchBox(c);
					combo.onPlaceSelected = (newPlaceRequest, clickedPlaceObj) => {							
							this.addMeetingPoint(clickedPlaceObj.SourceId, clickedPlaceObj.SourceType, clickedPlaceObj.Name, clickedPlaceObj.Coordinates);
					}
			}

			private addMeetingPoint(id, type, text, coords) {
					var data = { sourceId: id, type: type, text: text, coords: coords };

					this.apiPost("meetingPoint", data, (r) => {
						
					});
			}
	}
}
