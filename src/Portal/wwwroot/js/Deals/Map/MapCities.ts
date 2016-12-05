module Planning {

	export class MapPosition {

			private mapObj;

			constructor(mapObj) {
				this.mapObj = mapObj;
			}
			
			public setPos(obj) {
					this.mapObj.setZoom(obj.z);
					this.mapObj.panTo(obj.c, { animate: false });
			}

			public getPos() {
					var c = this.mapObj.getCenter();
					var z = this.mapObj.getZoom();
					return { c: c, z: z };
			}
	}

	export class MapCities {

		public onSelectionChanged: Function;

		public position: MapPosition;

		private map: Map;

		private mapObj;

		private citiesLayerGroup: any;
		private citiesToMarkers = [];
			
		private cities = [];

		private tileLayer;

		private delayedCallback: DelayedCallbackMap;

		private $map = $("#mapCities");
		private inited = false;


		constructor(map: Map) {
			this.map = map;
		}

		public show() {
			this.$map.show();

			if (!this.inited) {
					this.init();
					this.inited = true;
				  this.initCities();
			}
		}

		public hide() {
				this.$map.hide();					
		}
	
		private init() {
			this.mapObj = L.map("mapCities", MapConstants.mapOptions);
			this.position = new MapPosition(this.mapObj);
			this.createMapboxLayer();
			this.citiesLayerGroup = L.layerGroup();
			this.mapObj.addLayer(this.citiesLayerGroup);
		}
			
		public initCities() {
			this.loadCitiesInRange();
			this.callToLoadCities();
		}

		//wait a bit
		//private destroyCities() {			
		//		this.citiesLayerGroup.clearLayers();
		//		this.mapObj.removeLayer(this.citiesLayerGroup);
		//		this.citiesLayerGroup = null;			
		//}
			
		private createMapboxLayer() {
				var tempUrl =
						"https://api.mapbox.com/styles/v1/gloobster/civo64vmw004i2kqkwpcocjyp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
				this.tileLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
				this.mapObj.addLayer(this.tileLayer);
		}

		private getPopulationFromZoom(zoom) {
			if (zoom < 3) {
				return 2000000;
			}
			if (zoom === 3) {
				return 800000;
			}
			if (zoom === 4) {
				return 600000;
			}
			if (zoom === 5) {
				return 400000;
			}
			if (zoom === 6) {
				return 200000;
			}

			if (zoom === 7) {
				return 50000;
			}

			return 1;
		}

		public callToLoadCities() {
			var bounds = this.mapObj.getBounds();
			var zoom = this.mapObj.getZoom();
			var population = this.getPopulationFromZoom(zoom);

			var customId = this.map.planningMap.v.currentSetter.getCustomId();

			var prms = [
				["latSouth", bounds._southWest.lat],
				["lngWest", bounds._southWest.lng],
				["latNorth", bounds._northEast.lat],
				["lngEast", bounds._northEast.lng],
				["minPopulation", population.toString()],
				["planningType", this.map.planningMap.planningType.toString()],
				["customId", customId]
			];
				
			Views.ViewBase.currentView.apiGet("airportGroup", prms, (cities) => {
					this.createCities(cities);
				});
		}


		private createCities(cities) {

			this.cities = cities;
				
			this.citiesToMarkers = [];

			if (this.citiesLayerGroup) {
				this.citiesLayerGroup.clearLayers();
			}

			cities.forEach((city) => {
				var cityMarker = this.createCity(city);
				//this.addCityToMarker(city, cityMarker);
			});

		}

		private createCity(city) {

				var icon = city.selected ? MapIcons.selected : MapIcons.default;

			var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
			marker.selected = city.selected;
			marker.gid = city.gid;

			marker.on("mouseover", (e) => {
					e.target.setIcon(MapIcons.focus);
				});
			marker.on("mouseout", (e) => {
					if (!e.target.selected) {
							e.target.setIcon(MapIcons.default);
					} else {
							e.target.setIcon(MapIcons.selected);
					}
				});

			marker.on("click", (e) => {
				this.cityClicked(e);
			});

			marker.addTo(this.citiesLayerGroup);

			return marker;
		}

		private cityClicked(e) {
				e.target.setIcon(MapIcons.selected);
				e.target.selected = !e.target.selected;

				this.map.onCityChange(e.target.gid, e.target.selected);					
		}

		private loadCitiesInRange() {
			this.delayedCallback = new DelayedCallbackMap();
			this.delayedCallback.callback = () => {
				this.callToLoadCities();
			};

			this.mapObj.on("zoomend", e => {
					this.delayedCallback.receiveEvent();
				});
			this.mapObj.on("moveend", e => {
					this.delayedCallback.receiveEvent();
				});

		}

	}

	export class MapIcons {
		private static basePath = "../../images/n/map-icons/";

		public static default = L.icon({
			iconUrl: MapIcons.basePath + "default.svg",
			iconSize: [16, 16],
			iconAnchor: [8, 8]
		});

		public static selected = L.icon({
			iconUrl: MapIcons.basePath + "selected.svg",
			iconSize: [16, 16],
			iconAnchor: [8, 8]
		});

		public static focus = L.icon({
			iconUrl: MapIcons.basePath + "focus.svg",
			iconSize: [20, 20],
			iconAnchor: [10, 10]
		});
	}

	export class DelayedCallbackMap {

				public callback: Function;

				public delay = 600;

				private timeoutId = null;

				public receiveEvent() {

						if (this.timeoutId) {
								clearTimeout(this.timeoutId);
								this.timeoutId = null;
						}
						this.timeoutId = setTimeout(() => {
								this.timeoutId = null;
								this.callback();

						}, this.delay);
				}
		}
		
}