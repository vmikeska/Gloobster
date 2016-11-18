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
						//color: "#F56E12",
						//weight: 1,
						//opacity: 1,
						
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
		public onMapLoaded: Function;

		private mapCountries: MapCountries;

		public mapObj;

		public init(contId: string) {

			this.mapCountries = new MapCountries(this);

			this.mapObj = L.map(contId, MapConstants.mapOptions);

				this.mapCountries.init(() => {
						if (this.onMapLoaded) {
								this.onMapLoaded();
						}
				});				
		}

		public setCountries(ccs) {
				this.mapCountries.set(ccs);
		}

		
		public countrySelChanged(cc, isSelected: boolean) {
			if (this.onCountryChange) {
				this.onCountryChange(cc, isSelected);
			}
		}
	
	}

	export class MapCountries {

		private countriesData;

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

			if (this.countriesData) {
				this.createMapboxLayer();
				callback();
			} else {

				this.getGeoJson((countries) => {

					this.createMapboxLayer();
					this.createCountries(countries);

					callback();
				});

			}
		}

		private createCountries(countries) {
			$(countries.features)
				.each((key, feature) => {
					this.createMapFeature(feature);
				});
		}

		private createMapFeature(feature) {
			var cc = feature.properties.iso_a2;

			var l = new L.GeoJSON(feature,
			{
				style: this.getCountryStyle(cc)
			});

			this.featureArray.push([cc, l]);


			l.addTo(this.map.mapObj);
			l.on("mouseover",
				(e) => {
					var layer = this.getLayer(e);
					layer.setStyle(MapConstants.hoverStyle);
				});
			l.on("mouseout",
				(e) => {
					var layer = this.getLayer(e);
					var s = this.getCountryStyle(cc);
					layer.setStyle(s);
				});
			l.on("click",
				(e) => {
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

		private createMapboxLayer() {
			var tempUrl =
				"https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
			var mapLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
			this.map.mapObj.addLayer(mapLayer);

			var topPane = this.map.mapObj.createPane('leaflet-top-pane', this.map.mapObj.getPanes().mapPane);
			topPane.appendChild(mapLayer.getContainer());
			mapLayer.setZIndex(5);
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
			$.ajax({
					dataType: "json",
					url: "/geo/custom.geo.json",
					success: (data) => {
						this.countriesData = data;
						callback(data);
					}
				})
				.error(() => { alert("error voe") });
		}

		private getLayer(e) {
			var id = e.layer._leaflet_id;
			var layer = this.map.mapObj._layers[id];
			return layer;
		}
	}
}