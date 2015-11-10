
class DialogManager {
	public placeDetailTemplate: any;
	public travelDetailTemplate: any;
  public selectedId: string;

	public owner: Views.ViewBase;
  public planner: Planner;
  public $currentContainer = $("#plannerCont1");

	constructor(owner: Views.ViewBase, planner: Planner) {
	 this.owner = owner;
		this.planner = planner;
	 this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");
	 this.travelDetailTemplate = this.owner.registerTemplate("travelDetail-template");  
  }
 
	public closeDialog() {
		$(".daybyday-form").remove();
	}

	public regClose($html) {
	 $html.find(".close").click(() => {
		this.closeDialog();
		this.deactivate();
	 });
	}

	public deactivate() {
	 $(".destination.active").removeClass("active");

	 var $trans = $(".transport.active");
	 $trans.removeClass("active");
	 $trans.find(".tab").remove();
	}
}

class PlaceDialog  {
 public dialogManager: DialogManager;
 private placeSearch: PlaceSearchBox;
 private addressSearch: PlaceSearchBox;
 private placeToVisitSearch: PlaceSearchBox;

 constructor(dialogManager: DialogManager) {
	 this.dialogManager = dialogManager;	
 }

 public display() {
	this.dialogManager.closeDialog();

	var prms = [["dialogType", "place"], ["tripId", this.dialogManager.planner.trip.tripId], ["id", this.dialogManager.selectedId]];
	 this.dialogManager.owner.apiGet("TripPlannerProperty", prms, (response) => {
		 this.create(response);
	 });	
 }

	private create(data) {	 
		this.buildTemplate();
		this.createNameSearch(data.place.selectedName);

		var addressName = "";
		if (data.address) {
			addressName = data.address.selectedName;
		}

		$("#stayAddress").val(data.addressText);

		this.createAddressSearch(addressName);
		this.createPlaceToVisitSearch();
		this.initDescription(data.description);
	}

 private createNameSearch(selectedName) {
	 var c = new PlaceSearchConfig();
		c.owner = this.dialogManager.owner;
		c.providers = "0,1,2,3";
		c.elementId = "cities";
		c.minCharsToSearch = 1;
		c.clearAfterSearch = false;

		this.placeSearch = new PlaceSearchBox(c);
		this.placeSearch.onPlaceSelected = (req, place) => this.onPlaceSelected(req, place);

		this.placeSearch.setText(selectedName);
 }

 private createPlaceToVisitSearch() {
	 var c = new PlaceSearchConfig();
	 c.owner = this.dialogManager.owner;
	 c.providers = "1,0";
	 c.elementId = "placeToVisit";
	 c.minCharsToSearch = 1;
	 c.clearAfterSearch = true;
	 //c.customSelectedFormat = (place) => {
		//return place.Name;
	 //}

	 this.placeToVisitSearch = new PlaceSearchBox(c);
	 this.placeToVisitSearch.onPlaceSelected = (req, place) => this.onPlaceToVisitSelected(req, place);	
 }

 private createAddressSearch(selectedName) {	 
	 var c = new PlaceSearchConfig();
	 c.owner = this.dialogManager.owner;
	 c.providers = "1,0";
	 c.elementId = "stayPlace";
	 c.minCharsToSearch = 1;
	 c.clearAfterSearch = false;
	 c.customSelectedFormat = (place) => {
		return place.Name;
	 }

	 this.addressSearch = new PlaceSearchBox(c);
	 this.addressSearch.onPlaceSelected = (req, place) => this.onAddressSelected(req, place);
	 

	 this.addressSearch.setText(selectedName);
 }


 private buildTemplate() {
	 var html = this.dialogManager.placeDetailTemplate();
		var $html = $(html);
		this.dialogManager.regClose($html);
		this.dialogManager.$currentContainer.after($html);
 }
 
 private onPlaceToVisitSelected(req, place) {

	 //$("#stayAddress").val(place.Address);

	 //var data = {
		// propertyName: "address",
		// values: {
		//	 tripId: this.dialogManager.planner.trip.tripId,
		//	 placeId: this.dialogManager.selectedId,
		//	 sourceId: req.SourceId,
		//	 sourceType: req.SourceType,
		//	 selectedName: place.Name,
		//	 address: place.Address
		// }
	 //};
	 //this.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {

	 //});

 }
  
 private onAddressSelected(req, place) {

	 $("#stayAddress").val(place.Address);
	
	 var data = {
		 propertyName: "address",
		 values: {
			 tripId: this.dialogManager.planner.trip.tripId,
			 placeId: this.dialogManager.selectedId,
			 sourceId: req.SourceId,
			 sourceType: req.SourceType,
			 selectedName: place.Name,
			 address: place.Address
		 }
	 };
	 this.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {

	 });

 }

	private onPlaceSelected(req, place) {
	 var name = place.City + ", " + place.CountryCode;
	 $(".active .name").text(name);

	 var data = {
		propertyName: "place",
		values: {
		 tripId: this.dialogManager.planner.trip.tripId,
		 placeId: this.dialogManager.selectedId,
		 sourceId: req.SourceId,
		 sourceType: req.SourceType,
		 selectedName: name
		}
	 };
	 this.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {

	 });

	}

	private initDescription(text) {
	 $("#dialogDescription").val(text);

	 var d = new DelayedCallback("dialogDescription");
	 d.callback = (description) => {
		var data = { propertyName: "description", values: {
		 dialogType: "place",
		 placeId: this.dialogManager.selectedId,
		 tripId: this.dialogManager.planner.trip.tripId,
		 description: description
		} };
		this.dialogManager.owner.apiPut("TripPlannerProperty", data, () => {

			});
	}
 }
}

class TravelDialog {
 public dialogUtils: DialogManager;

	private displayTravelDetail() {
	 this.dialogUtils.closeDialog();

	 var html = this.dialogUtils.travelDetailTemplate();
		var $html = $(html);
		this.dialogUtils.regClose($html);
		this.dialogUtils.$currentContainer.after($html);
	}
}


class Planner {

  public trip: any; 
	public owner: Views.ViewBase;

  private placesMgr: PlacesManager;
	private dialogManager: DialogManager;
  private placeDialog: PlaceDialog;

	private addPlaceTemplate: any;
	private travelTemplate: any;
	private placeTemplate: any;
	

	private $currentContainer = $("#plannerCont1");
	private $adder: any;
	private $lastCell: any;
 
	constructor(owner: Views.ViewBase, trip: any) {
		this.owner = owner;
		this.dialogManager = new DialogManager(owner, this);
		this.placeDialog = new PlaceDialog(this.dialogManager);
		this.trip = trip;

		this.registerTemplates();
		this.addAdder();


		this.placesMgr = new PlacesManager(trip.id, owner);
		this.placesMgr.setData(trip.travels, trip.places);
		this.redrawAll();
	}

	private redrawAll() {
	  var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");
	  orderedPlaces.forEach((place) => {

		  var name = "Empty";
			if (place.place) {
				name = place.place.selectedName;
			}
		 
			var placeContext = {
			 id: place.id,
			 isActive: false,
			 name: name,
			 arrivalDateLong: "1.1.2000"
			}
		 
		 this.addPlace(placeContext);	 

		 if (place.leaving) {
			 var travel = place.leaving;
			 this.addTravel(travel.id, travel.type);
		 }
		 
	  });
  }
 
	private addAdder() {
		var html = this.addPlaceTemplate();
		this.$currentContainer.append(html);
		this.$adder = $("#addPlace");
		this.$lastCell = $("#lastCell");
		this.$adder.click(() => {
			this.addEnd();
		});
	}

	private registerTemplates() {
		this.addPlaceTemplate = this.owner.registerTemplate("addPlace-template");
		this.travelTemplate = this.owner.registerTemplate("travel-template");
		this.placeTemplate = this.owner.registerTemplate("place-template");		
	}

	public addEnd() {
		this.dialogManager.closeDialog();
		this.dialogManager.deactivate();

		var lastPlace = this.placesMgr.getLastPlace();
		var data = { selectorId: lastPlace.id, position: NewPlacePosition.ToRight, tripId: this.trip.tripId };

		this.owner.apiPost("tripPlanner", data, (response) => {

			var t = new Travel();
			this.placesMgr.travels.push(t);
			t.id = response.travel.id;
			t.type = response.travel.id;

			lastPlace.leaving = t;
			t.from = lastPlace;

			var p = new Place();
			this.placesMgr.places.push(p);
			p.id = response.place.id;
			p.arriving = t;
			p.leaving = null;
			p.orderNo = response.place.orderNo;

			t.to = p;

			this.addTravel(t.id, t.type);

			var placeContext = {
				isActive: true,
				name: "Empty",
				arrivalDateLong: "1.1.2000"
			}
			this.addPlace(placeContext);

			this.placeDialog.display();
		});	 
	}

	private getTravelIcon(travelType) {
		switch (travelType) {
		case TravelType.Bus:
			return "icon-car";
		case TravelType.Car:
			return "icon-car";
		case TravelType.Plane:
			return "icon-plane";
		case TravelType.Ship:
			return "icon-boat";
		case TravelType.Walk:
			return "icon-walk";
		case TravelType.Bike:
			return "icon-bike";
		case TravelType.Train:
			return "icon-train";
		default:
			return "";
		}
	}
 
	public addTravel(id, travelType) {

		var context = {
			id: id,
			icon: this.getTravelIcon(travelType)
		};

		var html = this.travelTemplate(context);
		var $html = $(html);
		$html.find(".transport").click((e) => {
			var $elem = $(e.target);
			this.setActiveTravel($elem);
		});

		this.$lastCell.before($html);
	}

	private setActiveTravel($elem) {
	 this.dialogManager.deactivate();

	 $elem.addClass("active");
	 $elem.append($('<span class="tab"></span>'));

	 this.placeDialog.display();
	} 

	public addPlace(context) {
		var self = this;
	 var html = this.placeTemplate(context);
		var $html = $(html);

		$html.find(".destination").click((e) => {
			self.dialogManager.deactivate();
			$(e.target).addClass("active");
			self.dialogManager.selectedId = $(e.target).parent().attr("id");
			self.placeDialog.display();
		});

		this.$lastCell.before($html);

		//this.displayPlaceDetail();	 
	} 
}

class PlacesManager {
  private tripId: string;
	public places = [];
  public travels = [];
  private owner: Views.ViewBase;

	constructor(tripId: string, owner: Views.ViewBase) {
		this.owner = owner;
		this.tripId = tripId;
	}

  public setData(travels, places) {
	 
	  places.forEach((place) => {

		  var placeObj = new Place();
		  placeObj.id = place.id;
			placeObj.orderNo = place.orderNo;
		  placeObj.place = place.place;

		  if (place.arrivingId) {
			  placeObj.arriving = this.getOrCreateTravelById(place.arrivingId, travels);
			  placeObj.arriving.to = placeObj;
			}

		  if (place.leavingId) {
			  placeObj.leaving = this.getOrCreateTravelById(place.leavingId, travels);
			  placeObj.leaving.from = placeObj;
			}
			this.places.push(placeObj);
	  });

  }

	private getOrCreateTravelById(travelId, travelsInput) {
	 
		var cachedTravel = _.find(this.travels, (travel) => {
			return travel.id === travelId;
		});

		if (cachedTravel) {
			return cachedTravel;
		}

		var newTravel = _.find(travelsInput, (travel) => {
		 return travel.id === travelId;
		});

		var newTravelObj = new Travel();
		newTravelObj.id = newTravel.id;
		newTravelObj.type = newTravel.type;
		this.travels.push(newTravelObj);

		return newTravel;
	}

	private getTravelById(id: string) {
	  return _.find(this.travels, (travel) => { return travel.id === id});
  }

  public getLastPlace(): Place {
	  var lastPlace = _.max(this.places, (place) => { return place.orderNo });
	  return lastPlace;
  }
}

enum NewPlacePosition { ToLeft, ToRight }
enum TravelType { Walk, Plane, Car, Bus, Train, Ship, Bike }

class Place {
  public id: string;
  public orderNo: number;

	public place: PlaceLocation;

	public arriving: Travel;
	public leaving: Travel;
}

class PlaceLocation {
	public sourceId: string;
	public sourceType: SourceType;
	public selectedName: string; 
}

class Travel {
	public id: string;
  public type: TravelType;

	public from: Place;
	public to: Place;
}