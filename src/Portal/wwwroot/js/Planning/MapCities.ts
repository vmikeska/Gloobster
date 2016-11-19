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

		private graph: GraphicConfig;

		private cities = [];

		private tileLayer;

		private delayedZoomCallback: DelayedCallbackMap;

		private $map = $("#mapCities");
		private inited = false;


		constructor(map: Map) {
			this.map = map;			
				
			this.graph = new GraphicConfig();
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

		public set(cities) {
			this.cities = cities;

			if (this.inited) {
				this.initCities();
			}
		}
			
		private init() {
			this.mapObj = L.map("mapCities", MapConstants.mapOptions);
			this.position = new MapPosition(this.mapObj);
			this.createMapboxLayer();
			this.citiesLayerGroup = L.layerGroup();
			this.mapObj.addLayer(this.citiesLayerGroup);
		}
			
		private initCities() {
			this.loadCitiesInRange();
			this.delayedZoomCallback.receiveEvent();
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

		private callToLoadCities() {
			var bounds = this.mapObj.getBounds();
			var zoom = this.mapObj.getZoom();
			var population = this.getPopulationFromZoom(zoom);

			var prms = [
				["latSouth", bounds._southWest.lat],
				["lngWest", bounds._southWest.lng],
				["latNorth", bounds._northEast.lat],
				["lngEast", bounds._northEast.lng],
				["minPopulation", population.toString()],
				["planningType", this.map.planningMap.planningType.toString()]
			];

			//dont delete
			//if (this.planningType === PlanningType.Custom) {
			//	prms.push(["customId", NamesList.selectedSearch.id]);
			//}

			Views.ViewBase.currentView.apiGet("airportGroup",
				prms,
				(cities) => {
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

			var icon = city.selected ? this.graph.selectedIcon : this.graph.cityIcon;

			var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
			marker.selected = city.selected;
			marker.gid = city.gid;

			marker.on("mouseover",
				(e) => {
					e.target.setIcon(this.graph.focusIcon);
				});
			marker.on("mouseout",
				(e) => {
					if (!e.target.selected) {
						e.target.setIcon(this.graph.cityIcon);
					} else {
						e.target.setIcon(this.graph.selectedIcon);
					}
				});

			marker.on("click", (e) => {
				this.cityClicked(e);
			});

			marker.addTo(this.citiesLayerGroup);

			return marker;
		}

			private cityClicked(e) {
					e.target.setIcon(this.graph.selectedIcon);
					e.target.selected = !e.target.selected;

					this.map.onCityChange(e.target.gid, e.target.selected);					
			}

		private loadCitiesInRange() {
			this.delayedZoomCallback = new DelayedCallbackMap();
			this.delayedZoomCallback.callback = () => {
				this.callToLoadCities();
			};

			this.mapObj.on("zoomend", e => {
					this.delayedZoomCallback.receiveEvent();
				});
			this.mapObj.on("moveend", e => {
					this.delayedZoomCallback.receiveEvent();
				});

		}

	}
		
}