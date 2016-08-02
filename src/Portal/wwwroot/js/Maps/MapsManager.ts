module Maps {
	export class MapsManager {

		public currentViewType: Maps.ViewType;
		public currentMaps: IMapsCreator;

		public mapsDriver: IMapsDriver;
		public mapsOperations: MapsOperations;

		public mapsDataLoader: MapsDataLoader;

		public currentDataType: Maps.DataType;
		public currentDisplayEntity: Maps.DisplayEntity;

		public onDataChanged: Function;

	  public onCenterChanged: Function;

		constructor() {
			this.mapsDataLoader = new MapsDataLoader();
			this.mapsDataLoader.dataLoadedCallback = () => { this.redrawDataCallback() };
			this.mapsOperations = new MapsOperations();
		}


		public getPluginData(dataType: DataType, displayEntity: DisplayEntity, people: PeopleSelection) {

			this.currentDisplayEntity = displayEntity;
			this.currentDataType = dataType;

			this.mapsDataLoader.getPluginData(dataType, displayEntity, people);
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


		public switchToView(viewType: Maps.ViewType, displayEntity: DisplayEntity) {

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
				this.onMapsLoaded(savedPosition, savedZoom, displayEntity);
			});
		}

		private onMapsLoaded(savedPosition, savedZoom, displayEntity: DisplayEntity) {

			this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
			this.mapsDriver.setMapObj(this.currentMaps.mapObj);
		 
			this.displayData(savedPosition, savedZoom, displayEntity);
		}

		private initView(viewType: Maps.ViewType) {
			if (viewType === ViewType.D3) {
				this.init3D();
			}

			if (viewType === ViewType.D2) {
				this.init2D();
			}
		}

		private displayData(savedPosition, savedZoom, displayEntity: DisplayEntity) {
			var people = new PeopleSelection();
			people.me = true;
			people.everybody = false;
			people.friends = false;
			people.singleFriends = [];

			this.getPluginData(DataType.Visited, displayEntity, people);

			if (savedPosition) {
				var roundedZoom = Math.round(savedZoom);
				//console.log("savedZoom: " + roundedZoom);
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