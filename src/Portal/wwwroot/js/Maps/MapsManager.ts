class MapsManager {
	
	public currentViewType: Maps.ViewType;
	public currentMaps: Maps.IMapsCreator;
 
	public baseMapsOperations: Maps.IMapsBaseOperation; 
	public mapsOperations: Maps.IMapsOperations;
 
	public countries: Maps.CountryHighligt[];
	public places: Maps.PlaceMarker[];

	public redrawAll() {
		this.redrawCountries();
		this.redrawPlaces();
	}

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
	}

	public setVisitedPlaces(places: Maps.PlaceMarker[]) {
		this.places = places;
		this.redrawPlaces();
	}
		
	public switchToView(viewType: Maps.ViewType) {

		if (this.currentMaps) {
			this.currentMaps.hide();
		}
				
		this.currentViewType = viewType;

		if (viewType === Maps.ViewType.D3) {
			this.init3D();
		}

		this.currentMaps.show();	 

		this.baseMapsOperations.setMapObj(this.currentMaps.mapObj);
		this.mapsOperations.setBaseMapsOperations(this.baseMapsOperations);
	}

	private init3D() {
		this.currentMaps = new MapsCreatorGlobe3D();
		this.currentMaps.setMapType('MQCDN1');
		this.currentMaps.setRootElement('earth_div');
	 
		this.baseMapsOperations = new BaseMapsOperation3D();		
	}
}

