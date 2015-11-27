
class PlanningView extends Views.ViewBase {

 private maps: MapsCreatorMapBox2D;
  
 public mapsOperations: PlanningMap;
 
 private anytimeTabTemplate: any;
 private weekendTabTemplate: any;
 private customTabTemplate: any;

 constructor() {
	 super();
	
	 this.initialize();
	 this.registerTabEvents();
 }

	public initialize() {
		this.maps = new MapsCreatorMapBox2D();
		this.maps.setRootElement("map");
		this.maps.show((map) => {
		 this.mapsOperations = new PlanningMap(map);
		 this.mapsOperations.loadCategory(PlanningType.Anytime);
		});

	}

  private registerTabEvents() {
	 this.anytimeTabTemplate = Views.ViewBase.currentView.registerTemplate("anytime-template");
	 this.weekendTabTemplate = Views.ViewBase.currentView.registerTemplate("weekend-template");
	 this.customTabTemplate = Views.ViewBase.currentView.registerTemplate("custom-template");

	  var $tabsRoot = $(".tabs");
	  var $tabs = $tabsRoot.find(".tab");
		$tabs.click((e) => { this.switchTab($(e.delegateTarget), $tabs); });
  }
 
	private switchTab($target, $tabs) {
		$tabs.removeClass("active");
		$target.addClass("active");


		var tabType = parseInt($target.data("type"));
		var tabHtml = "";
		if (tabType === PlanningType.Anytime) {
			tabHtml = this.anytimeTabTemplate();
		}
		if (tabType === PlanningType.Weekend) {
		 tabHtml = this.weekendTabTemplate();		 
		}
		if (tabType === PlanningType.Custom) {
			tabHtml = this.customTabTemplate();
		}

		var $tabContent = $("#tabContent");
		$tabContent.html(tabHtml);

		this.onTabSwitched(tabType);
	}

	private onTabSwitched(tabType: PlanningType) {
		this.mapsOperations.loadCategory(tabType);
	}

}

class WeekendForm {
 private $plus1: any;
 private $plus2: any;

	constructor(data) {
		this.$plus1 = $("#plus1");
		this.$plus2 = $("#plus2");

		this.setDaysCheckboxes(data.extraDaysLength);

		this.$plus1.click((e) => {
			var checked = this.$plus1.prop("checked");
			if (checked) {
				this.extraDaysClicked(1);
			} else {
				this.extraDaysClicked(0);
			}
		});
		this.$plus2.click((e) => {
			var checked = this.$plus2.prop("checked");
			if (checked) {
				this.extraDaysClicked(2);
			} else {
				this.extraDaysClicked(1);
			}
		});
	}

	private setDaysCheckboxes(length) {
		if (length === 0) {
			this.$plus1.prop("checked", false);
			this.$plus2.prop("checked", false);
		}
		if (length === 1) {
			this.$plus1.prop("checked", true);
			this.$plus2.prop("checked", false);
		}
		if (length === 2) {
			this.$plus1.prop("checked", true);
			this.$plus2.prop("checked", true);
		}
	}

	private extraDaysClicked(length) {
	 var data = PlanningSender.createRequest(PlanningType.Weekend, "ExtraDaysLength", { length: length });
	 PlanningSender.updateProp(data, (response) => {
		 this.setDaysCheckboxes(length);
	 });
	}
	
}

class TaggingField {

 private taggerTemplate: any;
 private $cont: any;
 private itemsRange: any;
 private selectedItems: any;
 private $tagger: any;
 public customId: string;

 constructor(customId, containerId, itemsRange) {
	 this.customId = customId;
	 
	 this.itemsRange = itemsRange;
	 this.taggerTemplate = Views.ViewBase.currentView.registerTemplate("tagger-template");
	 this.$cont = $("#" + containerId);

	 this.$tagger = this.createTagger(itemsRange);
	 this.$cont.prepend(this.$tagger);	
	 
 }

 public setSelectedItems(selectedItems) {
	 this.selectedItems = selectedItems;
	 this.initTags(selectedItems);
 }

	private initTags(selectedItems) {
		this.$cont.find(".tag").remove();
		selectedItems.forEach((selectedItem) => {
			var item = _.find(this.itemsRange, (i) => { return i.kind === selectedItem.kind && i.value === selectedItem.value });
			if (item) {
				var $html = this.createTag(item.text, item.value, item.kind);
				this.$cont.prepend($html);
			}
		});
	}

	private createTag(text, value, kind) {
	 var html = `<a class="tag" href="#" data-vl="${value}" data-kd="${kind}">${text}</a>`;
		var $html = $(html);
		return $html;
	}

	private createTagger(items) {
		var html = this.taggerTemplate();
		var $html = $(html);

		var $input = $html.find("input");

		var $ul = $html.find("ul");

		$input.keyup((e) => {
			this.fillTagger($input, items, $ul);
		});

		$input.focus((e) => {
			this.fillTagger($input, items, $ul);
			$ul.show();
		});

		$input.focusout((e) => {
			setTimeout(() => {
				$input.val("");
				$ul.hide();
			}, 250);
		});

		return $html;
	}

	private fillTagger($input, items, $ul) {
		$ul.html("");
		items.forEach((item) => {
			var inputVal = $input.val();
			var strMatch = (inputVal === "") || (item.text.indexOf(inputVal) > -1);
			var alreadySelected = _.find(this.selectedItems, (i) => { return i.kind === item.kind && i.value === item.value });
			
			if (strMatch && !alreadySelected) {
				var $item = this.createTaggerItem(item.text, item.value, item.kind);
				$ul.append($item);
			}
		});	 
	}

	private createTaggerItem(text, value, kind) {
	 var html = `<li data-vl="${value}" data-kd="${kind}">${text}</li>`;	 
	 var $html = $(html);

	 $html.click((e) => {			
			var $target = $(e.target);
			this.onItemClicked($target);
		 });
	
	 return $html;
 }
 
 public onItemClickedCustom: Function;

	private onItemClicked($target) {
		var val = $target.data("vl");
		var kind = $target.data("kd");
		var text = $target.text();

		this.onItemClickedCustom($target, () => {
		 var $tag = this.createTag(text, val, kind);
		 this.$tagger.before($tag);
		 this.selectedItems.push({ value: val, kind: kind });
		});	 	 
	}


}


class CustomForm {

 private namesList: NamesList;
 private timeTagger: TaggingField;

 public data: any;

 constructor(data) {
	 this.data = data;
	 this.namesList = new NamesList(data.searches);
	 this.namesList.onSearchChanged = (search) => this.onSearchChanged(search);
	 
	 this.registerDuration();
	 this.initTimeTagger(this.namesList.currentSearch);

	 this.fillForm(this.namesList.currentSearch);
 }

 private onSearchChanged(search) {
	 this.fillForm(search);
 }

 private fillForm(search) {
	 var timeSelectedItems = this.getTimeTaggerSelectedItems(search);
	 this.timeTagger.setSelectedItems(timeSelectedItems);
	 this.initDuration(search.roughlyDays);	
 }
 
 private initTimeTagger(search) {
	 var itemsRange = [
		{ text: "January", value: 1, kind: "month" },
		{ text: "February", value: 2, kind: "month" },
		{ text: "March", value: 3, kind: "month" },
		{ text: "April", value: 4, kind: "month" },
		{ text: "May", value: 5, kind: "month" },
		{ text: "June", value: 6, kind: "month" },
		{ text: "July", value: 7, kind: "month" },
		{ text: "August", value: 8, kind: "month" },
		{ text: "September", value: 9, kind: "month" },
		{ text: "October", value: 10, kind: "month" },
		{ text: "November", value: 11, kind: "month" },
		{ text: "December", value: 12, kind: "month" },
		{ text: "year 2015", value: 2015, kind: "year" },
		{ text: "year 2016", value: 2016, kind: "year" }
	 ];
	
	 this.timeTagger = new TaggingField(search.id, "timeTagger", itemsRange);
	 this.timeTagger.onItemClickedCustom = ($target, callback) => {
		var val = $target.data("vl");
		var kind = $target.data("kd");
		var text = $target.text();

		var data = PlanningSender.createRequest(PlanningType.Custom, "time", {
		 kind: kind,
		 value: val,
		 id: this.namesList.currentSearch.id
		});

		PlanningSender.pushProp(data, (res) => {
			callback(res);
		});
	 }
	}

	private getTimeTaggerSelectedItems(search) {
		var selectedItems = [];
		search.months.forEach((month) => {
			selectedItems.push({ value: month, kind: "month" });
		});
		search.years.forEach((year) => {
			selectedItems.push({ value: year, kind: "year" });
		});
		return selectedItems;
	}

	private initDuration(days) {

		if (days === 0) {
			this.setRadio(1, true);
		} else if (days === 3) {
			this.setRadio(2, true);
		} else if (days === 7) {
			this.setRadio(3, true);
		} else if (days === 14) {
			this.setRadio(4, true);
		} else {
			this.setRadio(5, true);
			$("#customLength").show();
			$("#customLength").val(days);
		}

	}

	private setRadio(no, val) {
	 $("#radio" + no).prop("checked", val);	
 }

	private registerDuration() {

		var dc = new DelayedCallback("customLength");
		dc.callback = (val) => {
			var intVal = parseInt(val);
			if (intVal) {
				this.callUpdateMinLength(intVal);
			}
		}

		var $lengthRadio = $("input[type=radio][name=radio]");
		var $customLength = $("#customLength");
		$lengthRadio.change((e) => {

			var $target = $(e.target);
			var val = $target.data("vl");
			if (val === "custom") {
				$customLength.show();
			} else {
				$customLength.hide();
				this.callUpdateMinLength(parseInt(val));
			}

		});
	}

	private callUpdateMinLength(roughlyDays) {
		var data = PlanningSender.createRequest(PlanningType.Custom, "roughlyDays", {
			id: this.namesList.currentSearch.id,
			days: roughlyDays
		});

		PlanningSender.updateProp(data, (res) => {

		});
	}


}

class NamesList {
	$nameInput: any;
	$nameSaveBtn: any;
	$nameEditBtn: any;
	$selectedSpan: any;
	$searchesList: any;
	$addNewItem: any;

	private searches = [];
	public currentSearch;

	private isEditMode = false;

  public onSearchChanged: Function;

	constructor(searches) {
		this.searches = searches;

		this.$nameInput = $("#nameInput");
		this.$nameSaveBtn = $("#nameSaveBtn");
		this.$nameEditBtn = $("#nameEditBtn");	 
		this.$selectedSpan = $("#selectedSpan");
		this.$searchesList = $("#searchesList");
		this.$addNewItem = $("#addNewItem");

		this.$nameEditBtn.click(() => this.editClick());
		this.$nameSaveBtn.click(() => this.saveClick());

		this.$addNewItem.click(() => {
		 var data = PlanningSender.createRequest(PlanningType.Custom, "createNewSearch", {			
			searchName: 'new search'
		 });

		 PlanningSender.pushProp(data, (newSearch) => {
			 searches.push(newSearch);
			 this.currentSearch = newSearch;
			 this.onSearchChanged(newSearch);
		 });
		});

		this.fillList();
	}

	private fillList() {
		this.$searchesList.html("");

	 this.searches.forEach((search) => {
			var itemHtml = `<li data-si="${search.id}">${search.searchName}<button>del</button></li>`;
			var $item = $(itemHtml);
			this.$searchesList.append($item);

			$item.click((e) => {
				this.itemClick($item);
			});
		});

		this.currentSearch = this.searches[0];
		this.$selectedSpan.text(this.currentSearch.searchName);
	}

	private itemClick($item) {
	 var searchId = $item.data("si");
	 var search = _.find(this.searches, (search) => { return search.id === searchId; });
		this.currentSearch = search;
	 this.onSearchChanged(search);
	}

  private setForm(search) {
	  
  }

	public saveClick() {
		var newName = this.$nameInput.val();
		var data = PlanningSender.createRequest(PlanningType.Custom, "renameSearch", {
			id: this.currentSearch.id,
			searchName: newName
		});

		PlanningSender.updateProp(data, (res) => {
			this.currentSearch.searchName = newName;
		  this.$nameInput.hide();
			this.$selectedSpan.show();
			//this.$searchesList.show();
			this.$nameEditBtn.show();
			this.$nameSaveBtn.hide();
			this.isEditMode = false;

			this.$selectedSpan.text(newName);
			this.$searchesList.find(`li[data-si='${this.currentSearch.id}']`).text(newName);
			//this.fillList();
		});
	}

	public editClick() {
		this.$nameInput.show();
		this.$nameInput.val(this.currentSearch.searchName);
		this.$selectedSpan.hide();
		//this.$searchesList.hide();
		this.$nameEditBtn.hide();
		this.$nameSaveBtn.show();
		this.isEditMode = true;
	}

}

class DelayedCallbackMap {

	public callback: Function;

	public delay = 600;

	private timeoutId = null;
	
	public receiveEvent() {

		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		this.timeoutId = setTimeout(() => {
			this.timeoutId = null;			
			this.callback();

		}, this.delay);
	}
}

class GraphicConfig {
	public borderColor = "#000000";
	public fillColorUnselected = "#CFCAC8";
	public fillColorSelected = "#57CF5F";
	public fillColorHover = "#57CF9D";

  constructor() {
	  this.cityIcon = this.getCityIcon();
	 this.focusIcon = this.getCityIconFocus();
	 this.selectedIcon = this.getSelectedIcon();
	 this.initConfigs();
  }

	public selectedConfig: PolygonConfig;
	public unselectedConfig: PolygonConfig;

	public cityIcon: any;
	public focusIcon: any;
	public selectedIcon: any;

	private getCityIcon() {
	 var icon = L.icon({
		iconUrl: '../../images/MapIcons/CityNormal.png',
		//shadowUrl: 'leaf-shadow.png',

		iconSize: [16, 16], // size of the icon
		//shadowSize: [50, 64], // size of the shadow
		iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
		//shadowAnchor: [4, 62],  // the same for the shadow
		//popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
	 });
	 return icon;
	}

	private getSelectedIcon() {
	 var icon = L.icon({
		iconUrl: '../../images/MapIcons/CitySelected.png',
		iconSize: [16, 16],
		iconAnchor: [8, 8]
	 });
	 return icon;
	}

	private getCityIconFocus() {
	 var icon = L.icon({
		iconUrl: '../../images/MapIcons/CityFocus.png',
		iconSize: [20, 20],
		iconAnchor: [10, 10]
	 });
	 return icon;
	}

	private initConfigs() {
	 var sc = new PolygonConfig();
	 sc.fillColor = this.fillColorSelected;
	 sc.borderColor = this.borderColor;
	 this.selectedConfig = sc;

	 var uc = new PolygonConfig();
	 uc.fillColor = this.fillColorUnselected;
	 uc.borderColor = this.borderColor;
	 this.unselectedConfig = uc;
	}
}

class PolygonConfig {

 constructor() {
	var defaultColor = '#2F81DE';

	this.borderColor = defaultColor;
	this.borderOpacity = 1;
	this.borderWeight = 1;

	this.fillColor = defaultColor;
	this.fillOpacity = 0.5;	
 }

 borderColor: string;
 borderOpacity: number;
 borderWeight: number;

 fillColor: string;
 fillOpacity: number;

 public convert() {
	 return {
		 color: this.borderColor,
		 opacity: this.borderOpacity,
		 weight: this.borderWeight,

		 fillColor: this.fillColor,
		 fillOpacity: this.fillOpacity
		}
 }
}

class PlanningMap {
 
	private delayedZoomCallback: DelayedCallbackMap;
  private graph: GraphicConfig;
 
	public map: any;

	private viewData: any;
  private currentPlanningType: PlanningType;
 
  private citiesManager: CitiesManager;
  private countriesManager: CountriesManager;

	private weekendForm: WeekendForm;
  private customForm: CustomForm;

	constructor(map) {
		this.map = map;
		this.graph = new GraphicConfig();

		this.citiesManager = new CitiesManager(map, this.graph);
		this.countriesManager = new CountriesManager(map, this.graph);
		this.citiesManager.countriesManager = this.countriesManager;
		this.countriesManager.citiesManager = this.citiesManager;
	}

	public loadCategory(planningType: PlanningType) {
		this.currentPlanningType = planningType;
		this.initCategory();
		this.loadCitiesInRange();
		this.delayedZoomCallback.receiveEvent();
	}

	private loadCitiesInRange() {
		this.delayedZoomCallback = new DelayedCallbackMap();
		this.delayedZoomCallback.callback = () => {
			this.callToLoadCities();
		};

		this.map.on("zoomend", e => {
			this.delayedZoomCallback.receiveEvent();
		});
		this.map.on("moveend", e => {
			this.delayedZoomCallback.receiveEvent();
		});

	}

  private callToLoadCities() {
	  var bounds = this.map.getBounds();
			var zoom = this.map.getZoom();
			var population = this.getPopulationFromZoom(zoom);

			var prms = [
				["latSouth", bounds._southWest.lat],
				["lngWest", bounds._southWest.lng],
				["latNorth", bounds._northEast.lat],
				["lngEast", bounds._northEast.lng],
				["minPopulation", population],
				["planningType", this.currentPlanningType.toString()]
			];

			Views.ViewBase.currentView.apiGet("airportGroup", prms, (response) => {
				this.onCitiesResponse(response);
			});
  }

	private initCategory() {
	 this.getTabData(this.currentPlanningType, (data) => {

		 this.viewData = data;

		 if (this.currentPlanningType === PlanningType.Anytime) {				
				this.countriesManager.createCountries(this.viewData.countryCodes, this.currentPlanningType);
		 }

		 if (this.currentPlanningType === PlanningType.Weekend) {			 
			this.countriesManager.createCountries(this.viewData.countryCodes, this.currentPlanningType);
			 this.weekendForm = new WeekendForm(data);
		 }

		 if (this.currentPlanningType === PlanningType.Custom) {
			 this.customForm = new CustomForm(data);
		 }

		});
	}

	private getTabData(planningType: PlanningType, callback) {
	 var prms = [["planningType", planningType.toString()]];
	 Views.ViewBase.currentView.apiGet("PlanningProperty", prms, (response) => {
		callback(response);
	 });
	}

	private onCitiesResponse(cities) {
	 this.citiesManager.createCities(cities, this.currentPlanningType);
	}
 
	private getPopulationFromZoom(zoom) {
		if (zoom < 3) {
			return 2000000;
		}
		if (zoom === 3) {
			return 800000;
		}
		if (zoom === 4) {
			return 600000;
		}
		if (zoom === 5) {
			return 400000;
		}
		if (zoom === 6) {
			return 200000;
		}

		if (zoom === 7) {
			return 50000;
		}

		return 1;
	}
 
}

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

	 PlanningSender.updateProp(data, (response) => {
		callback(response);
	 });
	}
 
}

class PlanningSender {

	public static updateProp(data, callback) {
		Views.ViewBase.currentView.apiPut("PlanningProperty", data, (response) => {
			callback(response);
		});
	}

	public static pushProp(data, callback) {
	 Views.ViewBase.currentView.apiPost("PlanningProperty", data, (response) => {
		callback(response);
	 });
	}

	public static createRequest(planningType: PlanningType, propertyName: string, values) {
		var request = { planningType: planningType, propertyName: propertyName, values: values };
		return request;
	}
}

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
		var cityMarkerPairs = this.getCitesMarkersByCountry(countryCode);
		cityMarkerPairs.forEach((pair) => {
			this.citiesLayerGroup.removeLayer(pair.marker);		  
			pair = null;
		});
		this.citiesToMarkers = _.reject(this.citiesToMarkers, (i) => { return i === null });
	}

	public showCityMarkersByCountry(countryCode: string) {
		var cities = this.getCitesByCountry(countryCode);

		cities.forEach((city) => {
			var cityMarker = this.createCity(city);
			this.addCityToMarker(city, cityMarker);
		});
	}

	private addCityToMarker(city, marker) {
	 this.citiesToMarkers.push({ city: city, marker: marker});
	}

	private getCitesMarkersByCountry(countryCode: string) {
	 var pairs = _.filter(this.citiesToMarkers, (pair) => { return pair.city.countryCode === countryCode });
	 return pairs;
	}

	private getCitesByCountry(countryCode: string) {
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

	 PlanningSender.updateProp(data, (response) => {
		callback(response);
	 });
	} 
}



enum PlanningType { Anytime, Weekend, Custom}
