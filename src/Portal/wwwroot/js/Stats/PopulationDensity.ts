module Stats {

		export class PopulationDensity extends CountriesPlugin {

				//get legendItems() {
				//		return [
				//				{ color: "#3DA243", txt: "Left" },
				//				{ color: "#FFC400", txt: "Right" }
				//		];
				//}

				customExe() {

						this.getData(10000, (items) => {

								console.log(items.length);

								var data = _.map(items, (i) => {
										var pi = this.getPopIndex(i.pop);										
										return [i.lat, i.lng, i.pop];
								});

								var heat = L.heatLayer(data, { max: 300}).addTo(this.mapObj);
								$(".leaflet-heatmap-layer").css("z-index", 1000);
								
								//items.forEach((i) => {

								//		var latlng = L.latLng(i.lat, i.lng);

								//		var pi = this.getPopIndex(i.pop);
								//		var color = this.heatMapColorForValue(pi);

								//	var rad = this.getCircleWidth(i.pop);

								//		var marker = L.circle(latlng,
								//				{
								//						color: color,
								//						fillColor: color,
								//						fillOpacity: 1,
								//						radius: rad
								//				}).addTo(this.mapObj);
								//});

						});

				}

				private heatMapColorForValue(value) {
						var h = (1.0 - value) * 240;
						return "hsl(" + h + ", 100%, 50%)";
				}

				private getPopIndex(pop) {

						if (pop >= 500000) {
								return 1;
						}

						var i = (1.0 / 500000.0) * pop;

						return i;
				}

				private getCircleWidth(pop) {

						if (pop > 2000000) {
								return 2500;
						}

						if (pop > 1500000) {
								return 2000;
						}

						if (pop > 1000000) {
								return 1500;
						}

						if (pop > 800000) {
								return 1000;
						}

						if (pop > 600000) {
								return 800;
						}

						if (pop > 300000) {
								return 500;
						}

						return 300;
				}

				private getData(minPopulation, callback) {
						var url = `http://citiesservice1.azurewebsites.net/api/city/mpc/${minPopulation}`;

						var request = new XMLHttpRequest();
						request.open('GET', url, true);

						request.onload = () => {
								if (request.status >= 200 && request.status < 400) {
										// Success!
										var data = JSON.parse(request.responseText);
										callback(data);
								} else {
										// We reached our target server, but it returned an error
										alert("error2");
								}
						};

						request.onerror = () => {
								alert("error");
						};

						request.send();
				}

				getCountryStyle(cc) {


						return {
								color: "#E02327",
								weight: 1,
								opacity: 1,
								fillColor: "#BCB3B8",
								fillOpacity: 1
						};
				}

		}

}