class CitiesManager {

	public citiesLayerGroup: any;
	public countriesManager: CountriesManager;

	private map: any;
	private graph: GraphicConfig;

	private cities = [];
	private citiesToMarkers = [];

	private currentPlanningType: PlanningType;

	constructor(map, graph: GraphicConfig) {
		this.graph = graph;
		this.map = map;

		this.citiesLayerGroup = L.layerGroup();
		this.map.addLayer(this.citiesLayerGroup);
	}

	public createCities(cities, planningType: PlanningType) {
		this.currentPlanningType = planningType;

		this.cities = cities;

		var filteredCities = _.filter(cities, (city) => {
			return !_.contains(this.countriesManager.selectedCountries, city.countryCode);
		});

		this.citiesToMarkers = [];

		this.citiesLayerGroup.clearLayers();

		filteredCities.forEach((city) => {
			var cityMarker = this.createCity(city);
			this.addCityToMarker(city, cityMarker);
		});

	}

	public hideCityMarkersByCountry(countryCode: string) {
		var cityMarkerPairs = this.getCitiesMarkersByCountry(countryCode);
		cityMarkerPairs.forEach((pair) => {
			this.citiesLayerGroup.removeLayer(pair.marker);		  
			pair = null;
		});
		this.citiesToMarkers = _.reject(this.citiesToMarkers, (i) => { return i === null });
	}

	public showCityMarkersByCountry(countryCode: string) {
		var cities = this.getCitiesByCountry(countryCode);

		cities.forEach((city) => {
			var cityMarker = this.createCity(city);
			this.addCityToMarker(city, cityMarker);
		});
	}

	private addCityToMarker(city, marker) {
		this.citiesToMarkers.push({ city: city, marker: marker});
	}

	private getCitiesMarkersByCountry(countryCode: string) {
		var pairs = _.filter(this.citiesToMarkers, (pair) => { return pair.city.countryCode === countryCode });
		return pairs;
	}

	private getCitiesByCountry(countryCode: string) {
		var cities = _.filter(this.cities, (city) => { return city.countryCode === countryCode });
		return cities;
	}

	private createCity(city) {

		var icon = city.selected ? this.graph.selectedIcon : this.graph.cityIcon;

		var marker = L.marker([city.coord.Lat, city.coord.Lng], { icon: icon });
		marker.selected = city.selected;
		marker.gid = city.gid;

		marker.on("mouseover", (e) => {
			e.target.setIcon(this.graph.focusIcon);
		});
		marker.on("mouseout", (e) => {
			if (!e.target.selected) {
				e.target.setIcon(this.graph.cityIcon);
			} else {
				e.target.setIcon(this.graph.selectedIcon);
			}
		});

		marker.on("click", (e) => {
			this.callChangeCitySelection(this.currentPlanningType, e.target.gid, !e.target.selected, (res) => {
				e.target.setIcon(this.graph.selectedIcon);
				e.target.selected = !e.target.selected;
			});
		});

		marker.addTo(this.citiesLayerGroup);

		return marker;
	}

	private callChangeCitySelection(planningType: PlanningType, gid: string, selected: boolean, callback: Function) {
		
	 var data = PlanningSender.createRequest(planningType, "cities", {
			gid: gid,
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