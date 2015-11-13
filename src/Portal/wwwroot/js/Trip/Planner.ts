
class DialogManager {
	public placeDetailTemplate: any;
	public travelDetailTemplate: any;
  public visitedItemTemplate: any;
  public selectedId: string;

	public owner: Views.ViewBase;
  public planner: Planner;
 
	constructor(owner: Views.ViewBase, planner: Planner) {
		this.owner = owner;
		this.planner = planner;
		this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");
		this.travelDetailTemplate = this.owner.registerTemplate("travelDetail-template");
		this.visitedItemTemplate = this.owner.registerTemplate("visitItem-template");
	}

	public createFilesInstance(entityId: string, entityType: TripEntityType): Files {
		var filesConfig = new FilesConfig();
		filesConfig.containerId = "entityDocs";
		filesConfig.inputId = "entityFileInput";
		filesConfig.templateId = "fileItem-template";
		filesConfig.editable = true;
		filesConfig.addAdder = true;
		filesConfig.entityId = entityId;

		var customData = new TripFileCustom();
		customData.tripId = this.planner.trip.tripId;
		customData.entityId = entityId;
		customData.entityType = entityType;

		var files = new Files(this.owner, filesConfig);

		files.fileUpload.customConfig = customData;

		return files;
	}

	public initDescription(text: string, entityType: TripEntityType) {
		$("#dialogDescription").val(text);

		var d = new DelayedCallback("dialogDescription");
		d.callback = (description) => {
			var data = {
				propertyName: "description",
				values: {
				 entityType: entityType,
					entityId: this.selectedId,
					tripId: this.planner.trip.tripId,
					description: description
				}
			};
			this.owner.apiPut("TripPlannerProperty", data, () => {

			});
		}
	}

  public getDialogData(dialogType: TripEntityType, callback: Function) {
	  var prms = [["dialogType", dialogType], ["tripId", this.planner.trip.tripId], ["id", this.selectedId]];
	 this.owner.apiGet("TripPlannerProperty", prms, (response) => {
		callback(response);
	 });
	}
  

	public closeDialog() {
		$(".daybyday-form").remove();
	}

	public regClose($html) {
	 $html.find(".close").click((e) => {
		e.preventDefault();
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

 private files: Files;

 constructor(dialogManager: DialogManager) {
	 this.dialogManager = dialogManager;	
 }

 public display() {
	this.dialogManager.closeDialog();

	this.dialogManager.getDialogData(TripEntityType.Place, (response) => this.create(response));	
 }

	private create(data) {
		var $rowCont = $("#" + data.id).parent();
	 this.buildTemplate($rowCont);

	 this.createNameSearch(data);
	 
		$("#stayAddress").val(data.addressText);

		this.createAddressSearch(data);
		
		this.createPlaceToVisitSearch(data);
		this.dialogManager.initDescription(data.description, TripEntityType.Place);

	  if (data.wantVisit) {
		  data.wantVisit.forEach((place) => {
			 this.addPlaceToVisit(place.id, place.selectedName, place.sourceType);
		  });
		}
	 
		this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Place);
		this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);
	}

 private createNameSearch(data) {
	 var c = new PlaceSearchConfig();
		c.owner = this.dialogManager.owner;
		c.providers = "0,1,2,3";
		c.elementId = "cities";
		c.minCharsToSearch = 1;
		c.clearAfterSearch = false;

		this.placeSearch = new PlaceSearchBox(c);
		this.placeSearch.onPlaceSelected = (req, place) => this.onPlaceSelected(req, place);

		if (data.place) {
		 this.placeSearch.setText(data.place.selectedName);
		}	
 }

 private createPlaceToVisitSearch(data) {
	 var c = new PlaceSearchConfig();
	 c.owner = this.dialogManager.owner;
	 c.providers = "1,0";
	 c.elementId = "placeToVisit";
	 c.minCharsToSearch = 1;
	 c.clearAfterSearch = true;
	
	 this.placeToVisitSearch = new PlaceSearchBox(c);
	 this.placeToVisitSearch.onPlaceSelected = (req, place) => this.onPlaceToVisitSelected(req, place);	

	 if (data.place && data.place.coordinates) {
		this.placeToVisitSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
	 }	
 }

	private createAddressSearch(data) {
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

		var addressName = "";
		if (data.address) {
			addressName = data.address.selectedName;
		}
		this.addressSearch.setText(addressName);

		if (data.place && data.place.coordinates) {
			this.addressSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
		}
	}


	private buildTemplate($row) {
	 var html = this.dialogManager.placeDetailTemplate();
		var $html = $(html);
		this.dialogManager.regClose($html);
	 
		$row.after($html);
 }
 
 private onPlaceToVisitSelected(req, place) {
	
	 var data = {
		 propertyName: "placeToVisit",
		 values: {
			 tripId: this.dialogManager.planner.trip.tripId,
			 placeId: this.dialogManager.selectedId,
			 sourceId: req.SourceId,
			 sourceType: req.SourceType,
			 selectedName: place.Name			 
		 }
	 };

	 this.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {
		 var id = response.Result;
		 this.addPlaceToVisit(id, place.Name, req.SourceType);
	 });

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
			 address: place.Address,
			 lat: place.Coordinates.Lat,
			 lng: place.Coordinates.Lng
		 }
	 };
	 this.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {

	 });

 }

	private onPlaceSelected(req, place) {

	 this.addressSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);
	 this.placeToVisitSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);

	 var name = place.City + ", " + place.CountryCode;
	 $(".active .name").text(name);

	 var data = {
		propertyName: "place",
		values: {
		 tripId: this.dialogManager.planner.trip.tripId,
		 placeId: this.dialogManager.selectedId,
		 sourceId: req.SourceId,
		 sourceType: req.SourceType,
		 selectedName: name,
		 lat: place.Coordinates.Lat,
		 lng: place.Coordinates.Lng		
		}
	 };
	 this.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {

	 });

	}

	private addPlaceToVisit(id: string, name: string, sourceType: SourceType) {
		var self = this;
		var iconClass = this.getIcon(sourceType);

		var context = { id: id, icon: iconClass, name: name };

		var html = this.dialogManager.visitedItemTemplate(context);
		var $html = $(html);
		
		$html.find(".delete").click((e) => {
		 e.preventDefault();
		 var $item = $(e.target);

			var data = {
				propertyName: "placeToVisitRemove",
				values: {
					tripId: this.dialogManager.planner.trip.tripId,
					placeId: this.dialogManager.selectedId,
					id: $item.parent().data("id")
				}
			};
			self.dialogManager.owner.apiPut("tripPlannerProperty", data, (response) => {});
			$html.remove();
		});

		$("#placeToVisit").before($html);
	}

	private getIcon(sourceType: SourceType) {

	 switch (sourceType) {
		case SourceType.FB:
		 return "icon-facebook";
		//case SourceType.City:
		// return "icon-city";
		//case SourceType.Country:
		// return "icon-country";
		case SourceType.S4:
		 return "icon-foursquare";
	 }

	 return "";
	}
 
}

class TravelDialog {
	public dialogManager: DialogManager;

	private files: Files;
	constructor(dialogManager: DialogManager) {
		this.dialogManager = dialogManager;
	}

	public display() {
	 this.dialogManager.closeDialog();

	 this.dialogManager.getDialogData(TripEntityType.Travel, (response) => this.create(response));	 
	}

	private create(data) {
		var $rowCont = $("#" + data.id).parent();
		this.buildTemplate($rowCont);

		this.dialogManager.initDescription(data.description, TripEntityType.Travel);

		this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Travel);
		this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);
	}

	private buildTemplate($row) {
		var html = this.dialogManager.travelDetailTemplate();
		var $html = $(html);
		this.dialogManager.regClose($html);

		$row.after($html);
	}

}


class Planner {

  public trip: any; 
	public owner: Views.ViewBase;
  //public masterFiles: Files;

  private placesMgr: PlacesManager;
	private dialogManager: DialogManager;
  private placeDialog: PlaceDialog;
	private travelDialog: TravelDialog;

	private addPlaceTemplate: any;
	private travelTemplate: any;
	private placeTemplate: any;
	

	public $currentContainer = $("#plannerCont1");
  private lastRowNo = 1; 
  private placesPerRow = 4;
  private contBaseName = "plannerCont";
  

	private $adder: any;
	private $lastCell: any;
 
	constructor(owner: Views.ViewBase, trip: any) {
		this.owner = owner;
		this.dialogManager = new DialogManager(owner, this);
		this.placeDialog = new PlaceDialog(this.dialogManager);
		this.travelDialog = new TravelDialog(this.dialogManager);
		this.trip = trip;

		this.registerTemplates();
	
		this.placesMgr = new PlacesManager(trip.id, owner);
		this.placesMgr.setData(trip.travels, trip.places);
		this.redrawAll();
	}

	private redrawAll() {
		var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");

		var placeCount = 0;
		orderedPlaces.forEach((place) => {
			placeCount++;

			var name = "Empty";
			if (place.place) {
				name = place.place.selectedName;
			}

			var placeContext = {
				id: place.id,
				isActive: false,
				name: name,
				arrivalDateLong: "1.1.2000",
				rowNo: this.lastRowNo
			}
		 
		  this.manageRows(placeCount);
			this.addPlace(placeContext);

			if (place.leaving) {
				var travel = place.leaving;
				this.addTravel(travel.id, travel.type);
			}

		});

		this.addAdder();
	}

	private manageRows(placeCount) {
		var currentRow = Math.floor(placeCount / this.placesPerRow);
		var rest = placeCount % this.placesPerRow;
		if (rest > 0) {
			currentRow++;
		}
		if (currentRow > this.lastRowNo) {
			this.addRowContainer();

			if (this.$lastCell) {
				this.$lastCell.appendTo(this.$currentContainer);
			}
		}
	}

	private addRowContainer() {	
	  var newRowNo = this.lastRowNo + 1;
		var newRowId = this.contBaseName + newRowNo;
		var html = `<div id="${newRowId}" class="daybyday table margin"></div>`;
	  var $html = $(html);

		this.$currentContainer.after($html);

		this.$currentContainer = $html;
	  this.lastRowNo = newRowNo;

  }
 
	private addAdder() {
		var html = this.addPlaceTemplate();
		this.$currentContainer.append(html);
		this.$adder = $("#addPlace");
		this.$lastCell = $("#lastCell");
		this.$adder.click((e) => {
		  e.preventDefault();
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
			t.type = response.travel.type;

			lastPlace.leaving = t;
			t.from = lastPlace;

			var p = new Place();
			this.placesMgr.places.push(p);
			p.id = response.place.id;
			p.arriving = t;
			p.leaving = null;
			p.orderNo = response.place.orderNo;

			t.to = p;
		  
			this.manageRows(this.placesMgr.places.length);

			this.addTravel(t.id, t.type);

			var placeContext = {
			  id: p.id,
				isActive: true,
				name: "Empty",
				arrivalDateLong: "1.1.2000",
				rowNo: this.lastRowNo
			}
			
			this.addPlace(placeContext);

			this.dialogManager.selectedId = response.place.id;
			//this.placeDialog.display();
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
		$html.find(".transport").click("*", (e) => {
		 var $elem = $(e.delegateTarget);			
			this.setActiveTravel($elem);
		});

		this.appendToTimeline($html);
	}

  private appendToTimeline($html) {
	  if (this.$adder) {
		this.$lastCell.before($html);
	 } else {
		this.$currentContainer.append($html);
	 }
  }

	private setActiveTravel($elem) {
	 this.dialogManager.deactivate();

	 $elem.addClass("active");
	 $elem.append($('<span class="tab"></span>'));

	 this.dialogManager.selectedId = $elem.parent().attr("id");
	 this.travelDialog.display();
	} 

	public addPlace(context) {
		var self = this;
	 var html = this.placeTemplate(context);
		var $html = $(html);
		
		$html.find(".destination").click("*", (e) => {
		 self.dialogManager.deactivate();
		 var $elem = $(e.delegateTarget);			
			$elem.addClass("active");
			self.dialogManager.selectedId = $elem.parent().attr("id");
			self.placeDialog.display();
		});

		this.appendToTimeline($html); 
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