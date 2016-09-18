module Views {

	export class TravelBMgmt extends ViewBase {

			constructor() {
				super();

				this.initCityCombo();
				this.initPlaceCombo();
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

			private initCityCombo() {
					var c = new Common.PlaceSearchConfig();
					c.providers = "2";
					c.selOjb = $("#city");
					c.minCharsToSearch = 1;
					c.clearAfterSearch = false;

					var combo = new Common.PlaceSearchBox(c);
					combo.onPlaceSelected = (newPlaceRequest, clickedPlaceObj) => {
						var c = clickedPlaceObj.Coordinates;
						this.placeCombo.setCoordinates(c.Lat, c.Lng);
					}
			}

			private placeCombo: Common.PlaceSearchBox;
			private initPlaceCombo() {
					var c = new Common.PlaceSearchConfig();
					c.providers = "1,4";
					c.selOjb = $("#place");
					c.minCharsToSearch = 1;
					c.clearAfterSearch = true;

					this.placeCombo = new Common.PlaceSearchBox(c);
					this.placeCombo.onPlaceSelected = (newPlaceRequest, clickedPlaceObj) => {							
							this.addMeetingPoint(clickedPlaceObj.SourceId, clickedPlaceObj.SourceType, clickedPlaceObj.Name, clickedPlaceObj.Coordinates);
					}
			}

			private addMeetingPoint(id, type, text, coord) {
					var data = { sourceId: id, type: type, text: text, coord: coord };

					this.apiPost("meetingPoint", data, (r) => {
						
					});
			}
	}
}
