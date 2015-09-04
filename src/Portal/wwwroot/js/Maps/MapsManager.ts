class MapsManager {
	
	public currentViewType: Maps.ViewType;
	public currentMaps: Maps.IMapsCreator;
 
	public mapsDriver: Maps.IMapsDriver; 
	public mapsOperations: Maps.IMapsOperations;
 
	public countries: Maps.CountryHighligt[];
	public places: Maps.PlaceMarker[];

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

