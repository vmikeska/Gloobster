class MapsManager {
	
	public currentViewType: Maps.ViewType;
	public currentMaps: Maps.IMapsCreator;
 
	public mapsDriver: Maps.IMapsDriver; 
	public mapsOperations: Maps.IMapsOperations;
 
	public countries: Maps.CountryHighligt[];
	public places: Maps.PlaceMarker[];

	//public savedPosition: any;

	public redrawAll() {
		this.redrawCountries();
		this.redrawPlaces();
	}

	private placesInitialized = false;
	private countriesInitialized = false;

	public redrawPlaces() {
	 this.mapsOperations.drawPlaces(this.places);
	}

	public redrawCountries() {
		this.mapsOperations.drawCountries(this.countries); 
	}

	constructor() {	 
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

		if (viewType === Maps.ViewType.D3) {
			this.init3D();
		}

		if (viewType === Maps.ViewType.D2) {
			this.init2D();
		}

		this.currentMaps.show();

		this.mapsDriver.setMapObj(this.currentMaps.mapObj);
		this.mapsOperations.setBaseMapsOperations(this.mapsDriver);

		if (this.placesInitialized) {
			this.redrawPlaces();
		}

		if (this.countriesInitialized) {
			this.redrawCountries();
		}

		if (savedPosition) {
			var roundedZoom = Math.round(savedZoom);
			console.log("savedZoom: " + roundedZoom);
			this.mapsDriver.setView(savedPosition.lat, savedPosition.lng, roundedZoom);
		}
		//var self = this;
		//setTimeout(function () {
		//	alert(self.mapsDriver.mapObj.getZoom());
		//}, 3000);
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

