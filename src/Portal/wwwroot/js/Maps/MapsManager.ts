module Maps {
		
	export class MapsManager {

			public currentViewType: Maps.MapType;
		public currentMaps: IMapsCreator;

		public mapsDriver: IMapsDriver;
		public mapsOperations: MapsOperations;

		public mapsDataLoader: MapsDataLoader;

		public currentDataType: Maps.DataType;
		
		public onDataChanged: Function;

	  public onCenterChanged: Function;

		constructor() {
			this.mapsDataLoader = new MapsDataLoader();
			this.mapsDataLoader.dataLoadedCallback = () => { this.redrawDataCallback() };
			this.mapsOperations = new MapsOperations();
		}


		public getPluginData(dataType: DataType, people: PeopleSelection) {
			
			this.currentDataType = dataType;

			this.mapsDataLoader.getPluginData(dataType, people);
		}

		public redrawDataCallback() {
				if (this.currentDataType === DataType.Cities) {
				this.redrawCities();
			}

			if (this.currentDataType === DataType.Countries) {
				this.redrawCountries();
			}

			if (this.currentDataType === DataType.Places) {
				this.redrawPlaces();
			}

			this.onDataChanged();
		}

		public removeCity(gid, countryCode = null) {
			this.mapsOperations.removeCity(gid);

			this.mapsDataLoader.viewPlaces.cities = _.reject(this.mapsDataLoader.viewPlaces.cities, (c) => {
				return c.geoNamesId === gid;
			});

			if (countryCode) {
				this.mapsDataLoader.viewPlaces.countries = _.reject(this.mapsDataLoader.viewPlaces.countries, (pol) => {
					return pol.countryCode === countryCode;
				});
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
		 
			var countries = this.mapsDataLoader.viewPlaces.countries;			
			
			var doUsThing = true;
			if (doUsThing) {
				var us = _.find(countries, (c) => {
					return c.countryCode === "US";
				});
				var hasUs = us != null;
				if (hasUs) {
				 countries = _.reject(countries, (c) => { return c === us; });
				 this.mapsOperations.drawUsStates(this.mapsDataLoader.viewPlaces.states);
				}
			 			 
			}

			this.mapsOperations.drawCountries(countries);
		 
		}


		public switchToView(viewType: Maps.MapType, dataType: DataType, callback: Function = null) {

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
				this.onMapsLoaded(savedPosition, savedZoom, dataType);
				if (callback) {
					callback();
				}					
			});
		}

		private onMapsLoaded(savedPosition, savedZoom, dataType: DataType) {

			this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
			this.mapsDriver.setMapObj(this.currentMaps.mapObj);
		 
			this.displayData(savedPosition, savedZoom, dataType);
		}

		private initView(viewType: Maps.MapType) {
				if (viewType === MapType.D3) {
				this.init3D();
			}

				if (viewType === MapType.D2) {
				this.init2D();
			}
		}

		private displayData(savedPosition, savedZoom, dataType: DataType) {
			var people = new PeopleSelection();
			people.me = true;
			people.everybody = false;
			people.friends = false;
			people.singleFriends = [];

			this.getPluginData(dataType, people);

			if (savedPosition) {
				var roundedZoom = Math.round(savedZoom);				
				this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
			}
		}

		private init3D() {
			this.currentMaps = new MapsCreatorGlobe3D();			
			this.currentMaps.setRootElement('map');

			this.mapsDriver = new BaseMapsOperation3D();
		}

		private init2D() {
			this.currentMaps = new MapsCreatorMapBox2D();
			this.currentMaps.setRootElement("map");

			this.currentMaps.onCenterChanged = (center) => {
			 if (this.onCenterChanged) {
				 this.onCenterChanged(center);
			 }			 
			};
			
			this.mapsDriver = new BaseMapsOperation2D();
		}

	}
}