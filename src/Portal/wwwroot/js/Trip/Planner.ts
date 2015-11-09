

class Planner {

  private trip: any; 
	public owner: Views.ViewBase;

  private placesMgr: PlacesManager;

	private addPlaceTemplate: any;
	private travelTemplate: any;
	private placeTemplate: any;
	private placeDetailTemplate: any;
	private travelDetailTemplate: any;

	private $currentContainer = $("#plannerCont1");
	private $adder: any;
	private $lastCell: any;

	private placeSearch: PlaceSearchBox;

	constructor(owner: Views.ViewBase, trip: any) {
		this.owner = owner;
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
			if (place.selectedName) {
				name = place.selectedName;
			}
		 
		 var placeContext = {
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
 
	private closeDialog() {
		$(".daybyday-form").remove();
	}

	private deactivate() {
		$(".destination.active").removeClass("active");

		var $trans = $(".transport.active");
		$trans.removeClass("active");
		$trans.find(".tab").remove();
	}

	private regClose($html) {
		$html.find(".close").click(() => {
			this.closeDialog();
			this.deactivate();
		});
	}

	private displayPlaceDetail() {
		this.closeDialog();

		var html = this.placeDetailTemplate();
		var $html = $(html);
		this.regClose($html);
		this.$currentContainer.after($html);

		var searchConfig = new PlaceSearchConfig();
		searchConfig.owner = this.owner;
		searchConfig.providers = "0,1,2,3";
		searchConfig.elementId = "cities";
		searchConfig.minCharsToSearch = 1;
		searchConfig.clearAfterSearch = false;

		this.placeSearch = new PlaceSearchBox(searchConfig);
		this.placeSearch.onPlaceSelected = (req, place) => this.onPlaceSelected(req, place);
	}

	private displayTravelDetail() {
		this.closeDialog();

		var html = this.travelDetailTemplate();
		var $html = $(html);
		this.regClose($html);
		this.$currentContainer.after($html);
	}

	private onPlaceSelected(req, place) {
		var name = place.City + ", " + place.CountryCode;
		$(".active .name").text(name);
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
		this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");
		this.travelDetailTemplate = this.owner.registerTemplate("travelDetail-template");
	}

	public addEnd() {
		this.closeDialog();
		this.deactivate();

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

			this.displayPlaceDetail();
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

	public addPlace(context) {
	 
	 var html = this.placeTemplate(context);
		var $html = $(html);

		$html.find(".destination").click((e) => {
			this.deactivate();
			$(e.target).addClass("active");
			this.displayPlaceDetail();
		});

		this.$lastCell.before($html);

		//this.displayPlaceDetail();	 
	}
 
	private setActiveTravel($elem) {
		this.deactivate();

		$elem.addClass("active");
		$elem.append($('<span class="tab"></span>'));

		this.displayTravelDetail();
	} 
}

enum NewPlacePosition { ToLeft, ToRight }
enum TravelType { Walk, Plane, Car, Bus, Train, Ship, Bike }

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
			placeObj.selectedName = place.selectedName;
			placeObj.sourceId = place.sourceId;
		  placeObj.sourceType = place.sourceType;

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
 

	//public addNewPlaceEnd() {
	//	var lastPlace = this.getLastPlace();

	//	this.callAddPlace(lastPlace.id, NewPlacePosition.ToRight, (response) => {
	//		var t = new Travel();
	//		t.id = response.travel.id;
	//		t.from = lastPlace;


	//		var p = new Place();
	//		p.id = response.place.id;
	//		p.arriving = t;
	//		p.leaving = null;

	//		t.to = p;
	//	});
	//}

	private getTravelById(id: string) {
	  return _.find(this.travels, (travel) => { return travel.id === id});
  }

  public getLastPlace(): Place {
	  var lastPlace = _.max(this.places, (place) => { return place.orderNo });
	  return lastPlace;
  }

	//private callAddPlace(selectorId: string, position: NewPlacePosition, callback: Function) {
	//  var data = { tripId: this.tripId, selectorId: selectorId, position: position};	 
	//	this.owner.apiPost("tripPlanner", data, (response) => callback(response));
 // }
 
}

class Place {
  public id: string;
  public orderNo: number;

	public sourceId: string;
	public sourceType: SourceType;
	public selectedName: string; 

	public arriving: Travel;
	public leaving: Travel;
}

class Travel {
	public id: string;
  public type: TravelType;

	public from: Place;
	public to: Place;
}