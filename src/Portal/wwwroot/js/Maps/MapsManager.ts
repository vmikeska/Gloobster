
enum PluginType { MyPlacesVisited, MyFriendsVisited, MyFriendsDesired }

enum DisplayEntity { Pin, Countries, Heat  }

class Places {
	public places: any;
	public cities: any;
	public countries: any;
}

class PlacesDisplay {
	//public countries: Maps.PlaceMarker[];
	public countries: Maps.CountryHighligt[];
	public cities: Maps.PlaceMarker[];
}

class MapsDataLoader {	
	public owner: Views.ViewBase;

	public places: Places;
	public viewPlaces: PlacesDisplay;

	public dataLoadedCallback: Function;

	constructor(owner: Views.ViewBase) {
	 this.owner = owner;		
	}

	public getPluginData(pluginType: PluginType, displayEntity: DisplayEntity) {

		var request = [["pluginType", pluginType.toString()], ["displayEntity", displayEntity.toString()]];

		this.owner.apiGet("PinBoardStats", request, response => {

			this.places = new Places();
			this.viewPlaces = new PlacesDisplay();

			this.places.places = response.VisitedPlaces;
			this.places.cities = response.VisitedCities;
			this.places.countries = response.VisitedCountries;

			this.executePlugin(pluginType);

			this.dataLoadedCallback();
		});
	}

	private executePlugin(pluginType: PluginType) {
		
	 if (pluginType === PluginType.MyPlacesVisited) {

		var singleColorConfig = new Maps.PolygonConfig();
		singleColorConfig.fillColor = "#009900";

		var countries = _.map(this.places.countries, country => {

		 var countryOut = new Maps.CountryHighligt();
		 countryOut.countryCode = country.CountryCode3;
		 countryOut.countryConfig = singleColorConfig;
		 return countryOut;

		});
		this.viewPlaces.countries = countries;

		var cities = _.map(this.places.cities, city => {
		 var marker = new Maps.PlaceMarker(city.Location.Lat, city.Location.Lng);
		 return marker;
		});
		this.viewPlaces.cities = cities;

	 }

	}
}



class MapsManager {

	public currentViewType: Maps.ViewType;
	public currentMaps: Maps.IMapsCreator;

	public mapsDriver: Maps.IMapsDriver;
	public mapsOperations: MapsOperations;
 
	public owner: Views.ViewBase;

	public mapsDataLoader: MapsDataLoader;

	public currentPluginType: PluginType;
	public currentDisplayEntity: DisplayEntity;

	public mapLoaded = false;
	//private placesInitialized = false;
	//private countriesInitialized = false;
 
	constructor(owner: Views.ViewBase) {
		//var self = this;
	 this.owner = owner;
	 this.mapsDataLoader = new MapsDataLoader(owner);
		this.mapsDataLoader.dataLoadedCallback = () => {this.dataLoadedCallback()};  
	 this.mapsOperations = new MapsOperations();
	}

	public getPluginData(pluginType: PluginType, displayEntity: DisplayEntity) {
		this.currentDisplayEntity = displayEntity;
		this.currentPluginType = pluginType;
		this.mapsDataLoader.getPluginData(pluginType, displayEntity);
	}

	private dataLoadedCallback() {

	 if (this.currentDisplayEntity === DisplayEntity.Pin) {
		 this.redrawCities();		
	 }

	 if (this.currentDisplayEntity === DisplayEntity.Countries) {
		this.redrawCountries();
	 }

	}
 
	public redrawCities() {
	 //if (this.mapLoaded) {
			this.mapsDriver.destroyAll();
			this.mapsOperations.drawCities(this.mapsDataLoader.viewPlaces.cities);
		//}
	}

	public redrawCountries() {
		//if (this.mapLoaded) {
			this.mapsDriver.destroyAll();
			this.mapsOperations.drawCountries(this.mapsDataLoader.viewPlaces.countries);
		//}
	}

	

	public switchToView(viewType: Maps.ViewType) {		
	 
	 if (this.currentViewType === viewType) {
		 return;
	 }
	 
		var savedPosition;
		var savedZoom = 1;
		this.mapLoaded = false;
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

		this.mapLoaded = true;

		this.mapsOperations.setBaseMapsOperations(this.mapsDriver);
		this.mapsDriver.setMapObj(this.currentMaps.mapObj);

		this.displayData(savedPosition, savedZoom);
	}

	private initView(viewType: Maps.ViewType) {
		if (viewType === Maps.ViewType.D3) {
			this.init3D();
		}

		if (viewType === Maps.ViewType.D2) {
			this.init2D();
		}
	}

	private displayData(savedPosition, savedZoom) {	 
		
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



 //public setVisitedCountries(countries: Maps.CountryHighligt[]) {
	// this.countries = countries;
	// this.redrawCountries();
	// this.countriesInitialized = true;
	//}

	//public setVisitedPlaces(places: Maps.PlaceMarker[]) {
	// this.places = places;
	// this.redrawPlaces();
	// this.placesInitialized = true;
	//}


	//private onVisitedCountriesResponse(visitedCountries) {
	// this.visitedCountries = visitedCountries;

	// var countryConf = this.countryConfig;

	// var mappedCountries = _.map(this.visitedCountries, countryCode => {
	// var country = new Maps.CountryHighligt();
	// country.countryCode = countryCode;
	// country.countryConfig = countryConf;
	// return country;
	// });

	// this.setVisitedCountries(mappedCountries);
	//}

	//private onVisitedPlacesResponse(response) {
	// this.visitedPlaces = response.Places;

	// var mappedPlaces = _.map(this.visitedPlaces, place => {
	// var marker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
	// return marker;
	// });

	// this.setVisitedPlaces(mappedPlaces);
	//}
