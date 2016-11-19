module Planning {
		
	export class MapCountries {

		public position: MapPosition;

		private countriesData;

		private ccsLayerGroup;
		private mapboxPane;
		private mapLayer;
		
		private map: Map;

		private mapObj;
		private $map = $("#mapCountries");

		public selectedCountries = [];
		private featureArray = [];

		constructor(map: Map) {
				this.map = map;
				this.mapObj = L.map("mapCountries", MapConstants.mapOptions);
				this.position = new MapPosition(this.mapObj);
		}
			
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

		public show() {
			this.$map.show();
		}

		public hide() {
			this.$map.hide();
		}
			
		public init(callback) {								
				this.getGeoJson(() => {

					this.createMapboxLayer();
					this.createCountries();

					callback();
				});				
		}
			
		private createCountries() {
			this.ccsLayerGroup = L.layerGroup();
			this.mapObj.addLayer(this.ccsLayerGroup);

			$(this.countriesData.features)
				.each((key, feature) => {
					this.createMapFeature(feature);
				});
		}
			
		private createMapFeature(feature) {
			var cc = feature.properties.cc;

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
			
		private createMapboxLayer() {
			var tempUrl =
				"https://api.mapbox.com/styles/v1/gloobster/civi2b1wn00a82kpattor5wui/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ";
			this.mapLayer = L.tileLayer(tempUrl, MapConstants.tileOptions);
			this.mapObj.addLayer(this.mapLayer);
				
			var paneName = "leaflet-top-pane";
				
			this.mapboxPane = this.mapObj.createPane(paneName);						
				
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
			var layer = this.mapObj._layers[id];
			return layer;
		}
	}
}