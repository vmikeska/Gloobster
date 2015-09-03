class MapsManager {
	
	public currentViewType: Maps.ViewType;
	public currentMaps: Maps.IMapsCreator;

	public mapsBaseOperations: Maps.IMapsBaseOperation;
	public mapsOperations: Maps.IMapsOperations;

	public countryShapes: CountryShapes;

  public countries: Maps.CountryHighligt[];

	public redraw() {
		this.mapsOperations.drawCountries(this.countries);
	}

	constructor() {
		this.countryShapes = new CountryShapes();
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
	}

	private init3D() {
		this.currentMaps = new MapsCreatorGlobe3D();
		this.currentMaps.setMapType('MQCDN1');
		this.currentMaps.setRootElement('earth_div');

		this.mapsBaseOperations = new MapsBaseOperation3D(this.currentMaps.mapObj);
		this.mapsOperations = new MapsOperations3D(this.mapsBaseOperations, this.countryShapes);
	}
}