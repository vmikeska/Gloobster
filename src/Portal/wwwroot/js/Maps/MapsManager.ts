class MapsManager {

	public currentViewType: Maps.ViewType;
	public currentMaps: Maps.IMapsCreator;

	public mapsDriver: Maps.IMapsDriver;
	public mapsOperations: Maps.IMapsOperations;

	public countries: Maps.CountryHighligt[];
	public places: Maps.PlaceMarker[];

	public owner: Views.ViewBase;

	public visitedCountries: any;
	public visitedPlaces: any;
	public mapLoaded = false;

	get countryConfig(): Maps.PolygonConfig {
		var countryConfig = new Maps.PolygonConfig();
		countryConfig.fillColor = "#009900";

		return countryConfig;
	}
  
	public redrawAll() {
		this.redrawCountries();
		this.redrawPlaces();
	}

	private placesInitialized = false;
	private countriesInitialized = false;

	public redrawPlaces() {
	 if (this.mapLoaded && this.placesInitialized) {
			this.mapsOperations.drawPlaces(this.places);
		}
	}

	public redrawCountries() {
		if (this.mapLoaded && this.countriesInitialized) {
			this.mapsOperations.drawCountries(this.countries);
		}
	}

	constructor(owner: Views.ViewBase) {
	 this.owner = owner;
	 this.getVisitedCountries();
		this.getVisitedPlaces();

		var countryShapes = new CountryShapes();
		this.mapsOperations = new MapsOperations(countryShapes);
	}

	public setVisitedCountries(countries: Maps.CountryHighligt[]) {
		this.countries = countries;
		this.redrawCountries();
		this.countriesInitialized = true;
	}

	public setVisitedPlaces(places: Maps.PlaceMarker[]) {
		this.places = places;
		this.redrawPlaces();
		this.placesInitialized = true;
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
		
		this.redrawAll();
		
		if (savedPosition) {
			var roundedZoom = Math.round(savedZoom);
			console.log("savedZoom: " + roundedZoom);
			this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
		}
	}

	private getVisitedPlaces() {
		this.owner.apiGet("visitedPlace", null, response => {
			this.onVisitedPlacesResponse(response);
		});
	}

	private getVisitedCountries() {
		this.owner.apiGet("visitedCountry", null, response => {
			this.onVisitedCountriesResponse(response.Countries3);
		});
	}

	private onVisitedCountriesResponse(visitedCountries) {
		this.visitedCountries = visitedCountries;

		var countryConf = this.countryConfig;

		var mappedCountries = _.map(this.visitedCountries, countryCode => {
			var country = new Maps.CountryHighligt();
			country.countryCode = countryCode;
			country.countryConfig = countryConf;
			return country;
		});

		this.setVisitedCountries(mappedCountries);
	}

	private onVisitedPlacesResponse(response) {
		this.visitedPlaces = response.Places;

		var mappedPlaces = _.map(this.visitedPlaces, place => {
			var marker = new Maps.PlaceMarker(place.PlaceLatitude, place.PlaceLongitude);
			return marker;
		});

		this.setVisitedPlaces(mappedPlaces);
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

