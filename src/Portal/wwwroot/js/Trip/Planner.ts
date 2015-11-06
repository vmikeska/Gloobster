class Planner {
	
 owner: Views.ViewBase;

 private addPlaceTemplate: any;
 private travelTemplate: any;
 private placeTemplate: any;
 private placeDetailTemplate: any;

 private $currentContainer = $("#plannerCont1");
 private $adder: any; 
 private $lastCell: any;

 private placeSearch: PlaceSearchBox;

 constructor(owner: Views.ViewBase) {
	 this.owner = owner;

	 this.registerTemplates();

	 this.loadData();
 }

 private loadData() {
	 
	this.addAdder();
 }

 private displayPlaceDetail() {

	 var html = this.placeDetailTemplate();
	 this.$currentContainer.after(html);

	var searchConfig = new PlaceSearchConfig();
		searchConfig.owner = this.owner;
		searchConfig.providers = "0,1,2,3";
		searchConfig.elementId = "cities";
		searchConfig.minCharsToSearch = 1;
		searchConfig.clearAfterSearch = false;

		this.placeSearch = new PlaceSearchBox(searchConfig);
		this.placeSearch.onPlaceSelected = (req, place) => this.placeSelected(req, place);
 }

 private placeSelected(req, place) {
	 var name = place.City + ", " + place.CountryCode;
	 $(".active .name").text(name);
 }

 private addAdder() {
	 var html = this.addPlaceTemplate();
	 this.$currentContainer.append(html);
	 this.$adder = $("#addPlace");
	 this.$lastCell = $("#lastCell");
	 this.$adder.click(() => {
		this.addPlace();
	 });
 }

 private registerTemplates() {
	 this.addPlaceTemplate = this.owner.registerTemplate("addPlace-template");
	 this.travelTemplate = this.owner.registerTemplate("travel-template");
	 this.placeTemplate = this.owner.registerTemplate("place-template");	
	 this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");	
 }
 
 public addPlace() {
	 var context = {
		isActive: true,
		name: "Empty",
		arrivalDateLong: "1.1.2000"
	 }

	 var html = this.placeTemplate(context);
	 this.$lastCell.before(html);

	 this.displayPlaceDetail();
 }
}