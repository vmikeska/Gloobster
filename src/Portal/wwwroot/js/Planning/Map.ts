module Planning {

	export class MapConstants {
				public static mapOptions = {
						zoom: 3,
						maxZoom: 19,
						minZoom: 3,
						maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
						zoomControl: false,
						//todo: change to user location
						center: [34.5133, -94.1629]
				};

				public static tileOptions = {
						noWrap: true,
						//continuousWorld: false
				};

				public static unselCountryStyle = {
						color: "#9096a0",
						weight: 1,
						opacity: 1,

						fillColor: "#005476",
						fillOpacity: 1
				};

				public static selCountryStyle = {
						color: "#9096a0",
						weight: 1,
						opacity: 1,
						
						fillColor: "#3DA243",
						fillOpacity: 1		
				};

				public static hoverStyle = {
						fillColor: "#F56E12",
						fillOpacity: 1
				};
		}

	export class Map {

		public onCountryChange: Function;
		public onCityChange: Function;
		public onMapLoaded: Function;

		private mapCountries: MapCountries;
		private mapCities: MapCities;

		public planningMap: PlanningMap;


		public mapObj;

		constructor(planningMap: PlanningMap) {
			this.planningMap = planningMap;
		}

		public init(contId: string) {

			this.mapCountries = new MapCountries(this);
			this.mapCities = new MapCities(this);

			this.mapObj = L.map(contId, MapConstants.mapOptions);

			//this.mapCountries.init(() => {
			
				this.onMapLoaded();
			
			//});
		}

		public switch(type: FlightCacheRecordType, data) {
				if (type === FlightCacheRecordType.Country) {
						this.mapCities.destroy();
						this.mapCountries.init(() => {
								this.mapCountries.set(data);
					});
				}

				if (type === FlightCacheRecordType.City) {
						this.mapCountries.destroy();
						this.mapCities.init();
						this.mapCities.set(data);
				}
		}
			

		
		public countrySelChanged(cc, isSelected: boolean) {
			if (this.onCountryChange) {
				this.onCountryChange(cc, isSelected);
			}
		}
	
	}

	export class MapCities {

		public onSelectionChanged: Function;

		private map: Map;

		public citiesLayerGroup: any;
		private citiesToMarkers = [];

		private graph: GraphicConfig;

		private cities = [];

		public delayedZoomCallback: DelayedCallbackMap;

		constructor(map: Map) {
			this.map = map;
			this.graph = new GraphicConfig();
		}

		public init() {
			this.createMapboxLayer();
			this.citiesLayerGroup = L.layerGroup();
			this.map.mapObj.addLayer(this.citiesLayerGroup);
		}

		public set(cities) {

			this.loadCitiesInRange();
			this.delayedZoomCallback.receiveEvent();
		}


		public destroy() {
			if (this.citiesLayerGroup) {
				this.citiesLayerGroup.clearLayers();
				this.map.mapObj.removeLayer(this.citiesLayerGroup);
				this.citiesLayerGroup = null;
				}
			this.destroyMapboxLayer();
		}

		private destroyMapboxLayer() {
			if (this.tileLayer) {
				this.map.mapObj.removeLayer(this.tileLayer);
				this.tileLayer = null;
			}
		}

		private tileLayer;

		private createMapboxLayer() {
				var tempUrl =
						"https://api.mapbox.com/styles/v1/gloobster/civo64vmw004i2kqkwpcocjyp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
				this.tileLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
				this.map.mapObj.addLayer(this.tileLayer);
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
			var bounds = this.map.mapObj.getBounds();
			var zoom = this.map.mapObj.getZoom();
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

			//var filteredCities = _.filter(cities, (city) => {
			//	return !_.contains(this.countriesManager.selectedCountries, city.countryCode);
			//});

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

			this.map.mapObj.on("zoomend", e => {
					this.delayedZoomCallback.receiveEvent();
				});
			this.map.mapObj.on("moveend", e => {
					this.delayedZoomCallback.receiveEvent();
				});

		}

	}

	export class MapCountries {

		private countriesData;

		public ccsLayerGroup;
		
		private map: Map;

		constructor(map: Map) {
				this.map = map;				
		}

		public selectedCountries = [];
		private featureArray = [];

		public set(ccs) {
			this.selectedCountries = ccs;

			this.featureArray.forEach((i) => {
				var cc = i[0];
				var f = i[1];

				var isSelected = _.contains(ccs, cc);
				if (isSelected) {
					f.setStyle(MapConstants.selCountryStyle);
				} else {
					f.setStyle(MapConstants.unselCountryStyle);
				}
			});
		}

		public init(callback) {								
				this.getGeoJson(() => {

					this.createMapboxLayer();
					this.createCountries();

					callback();
				});				
		}

		public destroy() {
			this.destroyMapboxLayer();
			this.destroyCountries();
		}

		private createCountries() {
			this.ccsLayerGroup = L.layerGroup();
			this.map.mapObj.addLayer(this.ccsLayerGroup);

			$(this.countriesData.features)
				.each((key, feature) => {
					this.createMapFeature(feature);
				});
		}

		private destroyCountries() {
				this.ccsLayerGroup.clearLayers();
				this.map.mapObj.removeLayer(this.ccsLayerGroup);
			this.ccsLayerGroup = null;
			this.featureArray = [];
		}

		private createMapFeature(feature) {
			var cc = feature.properties.iso_a2;

			var l = new L.GeoJSON(feature,
			{
				style: this.getCountryStyle(cc)
			});

			this.featureArray.push([cc, l]);
				
			l.addTo(this.ccsLayerGroup);

			l.on("mouseover", (e) => {
					var layer = this.getLayer(e);
					layer.setStyle(MapConstants.hoverStyle);
				});
			l.on("mouseout", (e) => {
					var layer = this.getLayer(e);
					var s = this.getCountryStyle(cc);
					layer.setStyle(s);
				});
			l.on("click", (e) => {
					var layer = this.getLayer(e);
					this.countryClicked(cc, layer);
				});
		}

		private countryClicked(cc, layer) {
			var selected = this.isCountrySelected(cc);

			if (selected) {
				this.selectedCountries = _.reject(this.selectedCountries, (c) => { return c === cc; });
			} else {
				this.selectedCountries.push(cc);
			}

			var s = this.getCountryStyle(cc);
			layer.setStyle(s);

			this.map.countrySelChanged(cc, !selected);
		}

		private destroyMapboxLayer() {
			//L.DomUtil.remove(this.mapboxPane);
			this.map.mapObj.removeLayer(this.mapLayer);
			//this.mapboxPane = null;
			this.mapLayer = null;
		}

		private mapboxPane;
			private mapLayer;

		private createMapboxLayer() {
			var tempUrl =
				"https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
			this.mapLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
			this.map.mapObj.addLayer(this.mapLayer);
				
			var paneName = "leaflet-top-pane";

			var pane = this.map.mapObj.getPane(paneName);
			if (!pane) {
					this.mapboxPane = this.map.mapObj.createPane(paneName);	
					//this.map.mapObj.getPanes().mapPane
			} 
				
			this.mapboxPane.appendChild(this.mapLayer.getContainer());
			this.mapLayer.setZIndex(5);
		}

		private getCountryStyle(cc) {
			if (this.isCountrySelected(cc)) {
				return MapConstants.selCountryStyle;
			} else {
				return MapConstants.unselCountryStyle;
			}
		}

		private isCountrySelected(cc) {
			var selected = _.contains(this.selectedCountries, cc);
			return selected;
		}

		private getGeoJson(callback) {

			if (this.countriesData) {
				callback();
			} else {

				$.ajax({
						dataType: "json",
						url: "/geo/custom.geo.json",
						success: (data) => {
							this.countriesData = data;
							callback();
						}
					})
					.error(() => { alert("error voe") });
			}
		}

		private getLayer(e) {
			var id = e.layer._leaflet_id;
			var layer = this.map.mapObj._layers[id];
			return layer;
		}
	}
}