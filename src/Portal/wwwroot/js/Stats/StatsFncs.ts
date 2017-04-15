module Stats {
		
		export class InstanceLoader {
				static getInstance(context: Object, name: string, ...args: any[]) {
						var instance = Object.create(context[name].prototype);
						instance.constructor.apply(instance, args);
						return instance;
				}
		}

		export class CountriesPlugin {

				private ccsLayerGroup;
				protected  mapObj;

				constructor(mapObj) {
						this.mapObj = mapObj;
						this.createCountries();
						
						this.drawLegend();

						this.createMapboxLayer();

						this.customExe();
				}

				private drawLegend() {

						var lg = Common.ListGenerator.init($(".legend-cont"), "legend-item-template");

						lg.onItemAppended = ($item, item) => {
								$item.find(".color").css("background-color", item.color);
						}

						lg.generateList(this.legendItems);


				}

				private createCountries() {
						this.ccsLayerGroup = L.layerGroup();
						this.mapObj.addLayer(this.ccsLayerGroup);

						$(Planning.CountriesData.data.features)
								.each((key, feature) => {
										this.createMapFeature(feature);
								});
				}

				protected customExe() {

				}

				protected get legendItems() { return []; }

				protected createMapFeature(feature) {
						var cc = feature.properties.cc;

						var l = new L.GeoJSON(feature,
								{
										style: this.getCountryStyle(cc)
								});
						l.addTo(this.ccsLayerGroup);

						//this.featureArray.push([cc, l]);
						//this.regEvnts(l, cc);
				}

				protected getCountryStyle(color) {
						return null;
				}

				private mapLayer;
				private mapboxPane;

				private createMapboxLayer() {
						var tempUrl =
								"https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
						this.mapLayer = L.tileLayer(tempUrl, { noWrap: true });
						this.mapObj.addLayer(this.mapLayer);

						var paneName = "leaflet-top-pane";

						this.mapboxPane = this.mapObj.createPane(paneName);

						this.mapboxPane.appendChild(this.mapLayer.getContainer());
						this.mapLayer.setZIndex(5);
				}

		}


}