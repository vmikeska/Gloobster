module Views {


		export class StatsView extends ViewBase {

				private mapObj;

				private init(scriptName) {
						this.createMap(scriptName);
				}


				private createMap(scriptName) {

						let options = {
								zoom: 3,
								//maxZoom: 19,
								//minZoom: 3,
								maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
								zoomControl: false,
								//todo: change to user location
								center: [34.5133, -94.1629]
						};

						this.mapObj = L.map("statMap", options);

						let statInstance = Stats.InstanceLoader.getInstance(window["Stats"], scriptName, this.mapObj);
						//var cd = new CountriesDriving(this.mapObj);

				}



		}
		
}


						//var outs = [];

						//	var $t = $("#tfbl");

						//$t.find("tr").each((i, e) => {
						//		var $tr = $(e);
						//		var $tds = $tr.find("td");
						//		var country = $($tds[0]).find("a").html();

						//		var isRight = $($tds[1]).text().split("[")[0] === "RHT";

						//		var obj = { country, isRight };
						//	outs.push(obj);
						//});

						//var oo = JSON.stringify(outs);