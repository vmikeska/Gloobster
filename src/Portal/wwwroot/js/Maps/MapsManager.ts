module Maps {
	export class MapsManager {

		public currentViewType: Maps.ViewType;
		public currentMaps: IMapsCreator;

		public mapsDriver: IMapsDriver;
		public mapsOperations: MapsOperations;

		public mapsDataLoader: MapsDataLoader;

		public currentPluginType: Maps.PluginType;
		public currentDisplayEntity: Maps.DisplayEntity;

		constructor() {
			this.mapsDataLoader = new MapsDataLoader();
			this.mapsDataLoader.dataLoadedCallback = () => { this.redrawDataCallback() };
			this.mapsOperations = new MapsOperations();
		}


		public getPluginData(pluginType: Maps.PluginType, displayEntity: Maps.DisplayEntity, force = false) {

			var isSamePlugin = this.currentPluginType === pluginType;

			this.currentDisplayEntity = displayEntity;
			this.currentPluginType = pluginType;

			var reloadData = !isSamePlugin || force;

			if (reloadData) {
			 this.mapsDataLoader.getPluginData(pluginType, displayEntity);			 
			} else {
			 this.redrawDataCallback();
			}
		}

		public redrawDataCallback() {
			if (this.currentDisplayEntity === DisplayEntity.Pin) {
				this.redrawCities();
			}

			if (this.currentDisplayEntity === DisplayEntity.Countries) {
				this.redrawCountries();
			}

			if (this.currentDisplayEntity === DisplayEntity.Heat) {
				this.redrawPlaces();
			}
		}

		public redrawPlaces() {
			this.mapsDriver.destroyAll();
			this.mapsOperations.drawPlaces(this.mapsDataLoader.viewPlaces.places);
		}

		public redrawCities() {
			this.mapsDriver.destroyAll();
			this.mapsOperations.drawCities(this.mapsDataLoader.viewPlaces.cities);
		}

		public redrawCountries() {
			this.mapsDriver.destroyAll();
			this.mapsOperations.drawCountries(this.mapsDataLoader.viewPlaces.countries);
		}


		public switchToView(viewType: Maps.ViewType) {

			if (this.currentViewType === viewType) {
				return;
			}

			var savedPosition;
			var savedZoom = 1;

			if (this.mapsDriver) {
				savedPosition = this.mapsDriver.getPosition();
				savedZoom = this.mapsDriver.getZoom();
			}

			if (this.currentMaps) {
				this.currentMaps.hide();
				this.mapsDriver.destroyAll();
			}

			this.currentViewType = viewType;

			this.initView(viewType);
			this.currentMaps.show(() => {
				this.onMapsLoaded(savedPosition, savedZoom);
			});
		}

		private onMapsLoaded(savedPosition, savedZoom) {

			this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
			this.mapsDriver.setMapObj(this.currentMaps.mapObj);

			if (!Views.ViewBase.currentView.loginManager.isAlreadyLogged()) {
				return;
			}

			this.displayData(savedPosition, savedZoom);
		}

		private initView(viewType: Maps.ViewType) {
			if (viewType === ViewType.D3) {
				this.init3D();
			}

			if (viewType === ViewType.D2) {
				this.init2D();
			}
		}

		private displayData(savedPosition, savedZoom) {

			this.getPluginData(PluginType.MyPlacesVisited, DisplayEntity.Pin);

			if (savedPosition) {
				var roundedZoom = Math.round(savedZoom);
				console.log("savedZoom: " + roundedZoom);
				this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
			}
		}

		private init3D() {
			this.currentMaps = new MapsCreatorGlobe3D();
			this.currentMaps.setMapType('MQCDN1');
			this.currentMaps.setRootElement('map');

			this.mapsDriver = new BaseMapsOperation3D();
		}

		private init2D() {
			this.currentMaps = new MapsCreatorMapBox2D();
			this.currentMaps.setRootElement('map');

			this.mapsDriver = new BaseMapsOperation2D();
		}

	}
}