class CountriesManager {
	public selectedCountries = [];
	public citiesManager: CitiesManager;

	private countryShapes: CountryShapes2;

	private map: any;
	private graph: GraphicConfig;
	private countriesLayerGroup: any;

	private currentPlanningType: PlanningType;

	constructor(map, graph: GraphicConfig) {
		this.graph = graph;
		this.map = map;

		this.countriesLayerGroup = L.layerGroup();
		this.map.addLayer(this.countriesLayerGroup);

		this.countryShapes = new CountryShapes2();
	}


	public createCountries(selectedCountries, planningType: PlanningType) {
		this.currentPlanningType = planningType;

		this.countriesLayerGroup.clearLayers();

		this.selectedCountries = selectedCountries;

		this.countryShapes.countriesList.forEach((country) => {
			var selected = _.contains(selectedCountries, country.name);
			var config = selected ? this.graph.selectedConfig : this.graph.unselectedConfig;

			this.createCountry(country, config);
		});

	}

	public createCountry(country: any, polygonConfig: PolygonConfig) {

		var polygon = L.polygon(country.coordinates, polygonConfig.convert());
		polygon.addTo(this.countriesLayerGroup);

		polygon.countryCode = country.name;

		polygon.on("click", (e) => {
			var countryCode = e.target.countryCode;
			var wasSelected = _.contains(this.selectedCountries, countryCode);
			var newFillColor = wasSelected ? this.graph.fillColorUnselected : this.graph.fillColorSelected;

			this.callChangeCountrySelection(this.currentPlanningType, countryCode, !wasSelected, (response) => {
				e.target.setStyle({ fillColor: newFillColor });
				if (wasSelected) {
					this.selectedCountries = _.reject(this.selectedCountries, (cntry) => { return cntry === countryCode; });
					this.citiesManager.showCityMarkersByCountry(countryCode);
				} else {
					this.selectedCountries.push(countryCode);
					this.citiesManager.hideCityMarkersByCountry(countryCode);
				}

			});
		});

		polygon.on("mouseover", (e) => {
			e.target.setStyle({ fillColor: this.graph.fillColorHover });
		});

		polygon.on("mouseout", (e) => {
			var countryCode = e.target.countryCode;
			var selected = _.contains(this.selectedCountries, countryCode);
			var fillColor = selected ? this.graph.fillColorSelected : this.graph.fillColorUnselected;

			e.target.setStyle({ fillColor: fillColor });
		});

	}

	private callChangeCountrySelection(planningType: PlanningType, countryCode: string, selected: boolean, callback: Function) {
		var data = PlanningSender.createRequest(planningType, "countries", {
			countryCode: countryCode,
			selected: selected
		});

	  if (planningType === PlanningType.Custom) {
		  data.values.customId = NamesList.selectedSearch.id;
	  }

		PlanningSender.updateProp(data, (response) => {
			callback(response);
		});
	}
 
}