
class DialogManager {
	public placeDetailTemplate: any;
	public travelDetailTemplate: any;
  public visitedItemTemplate: any;
  public selectedId: string;

	
  public planner: Planner;
 
	constructor(planner: Planner) {		
		this.planner = planner;
		this.placeDetailTemplate =  Views.ViewBase.currentView.registerTemplate("placeDetail-template");
		this.travelDetailTemplate = Views.ViewBase.currentView.registerTemplate("travelDetail-template");
		this.visitedItemTemplate = Views.ViewBase.currentView.registerTemplate("visitItem-template");
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

		var files = new Files(filesConfig);

		files.fileUpload.customConfig = customData;

		return files;
	}

	public initDescription(text: string, entityType: TripEntityType) {
		$("#dialogDescription").val(text);

		var d = new DelayedCallback("dialogDescription");
		d.callback = (description) => {
			var data = this.getPropRequest("description", {
				entityType: entityType,
				description: description
			});
			Views.ViewBase.currentView.apiPut("TripPlannerProperty", data, () => {
			});
		}
	}

  public getDialogData(dialogType: TripEntityType, callback: Function) {
	  var prms = [["dialogType", dialogType], ["tripId", this.planner.trip.tripId], ["id", this.selectedId]];
		Views.ViewBase.currentView.apiGet("TripPlannerProperty", prms, (response) => {
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

  public getPropRequest(propName: string, customValues) {
	  var data = {
		 propertyName: propName,
			 values: {
				tripId: this.planner.trip.tripId,
				entityId: this.selectedId		 
				}
			};
		data.values = $.extend(data.values, customValues);
	  return data;
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

	 var data = this.dialogManager.getPropRequest("placeToVisit", {
		 sourceId: req.SourceId,
		 sourceType: req.SourceType,
		 selectedName: place.Name
	 });
	
	 Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {
		 var id = response.Result;
		 this.addPlaceToVisit(id, place.Name, req.SourceType);
	 });

 }
  
 private onAddressSelected(req, place) {

	 $("#stayAddress").val(place.Address);

	 var data = this.dialogManager.getPropRequest("address", {
		 sourceId: req.SourceId,
		 sourceType: req.SourceType,
		 selectedName: place.Name,
		 address: place.Address,
		 lat: place.Coordinates.Lat,
		 lng: place.Coordinates.Lng
	 });
	 
	 Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {
	 });
 }

	private onPlaceSelected(req, place) {

	 this.addressSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);
	 this.placeToVisitSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);

	 var name = place.City + ", " + place.CountryCode;
	 $(".active .name").text(name);

		var data = this.dialogManager.getPropRequest("place", {
			sourceId: req.SourceId,
			sourceType: req.SourceType,
			selectedName: name,
			lat: place.Coordinates.Lat,
			lng: place.Coordinates.Lng
		});
	
		Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {
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

			var data = this.dialogManager.getPropRequest("placeToVisitRemove", {
				id: $item.parent().data("id")
			});

			Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {});
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

class AirportCombo {
	private $combo: any;
	private $cont: any;
	private $input: any;
	private limit = 10;
	private lastText: string;

	public onSelected: Function;

	constructor(comboId: string) {
		this.$combo = $("#" + comboId);
		this.$cont = this.$combo.find("ul");
		this.$input = this.$combo.find("input");
		this.registerInput();
		this.registerInOut();
	}

	public setText(text) {
		this.lastText = text;
		this.$input.val(text);
	}

	private registerInOut() {
		this.$input.focus((e) => {
			$(e.target).val("");
		});
		this.$input.focusout(() => {
			this.setText(this.lastText);
		});
	}

	private registerInput() {
		var d = new DelayedCallback(this.$input);
		d.callback = (str) => {
			var data = [["query", str], ["limit", this.limit]];
			Views.ViewBase.currentView.apiGet("airport", data, (items) => this.onResult(items));
		}
	}

	private onResult(items) {
		this.displayResults(items);
	}

	private displayResults(items) {
		if (!items) {
			return;
		}

		this.$cont.html("");

		items.forEach((item) => {
			var itemHtml = this.getItemHtml(item);
			this.$cont.append(itemHtml);
		});
		this.registerClick();
	}

	private registerClick() {
		this.$cont.find("li").click((evnt) => {
			var $t = $(evnt.target);
			this.onClick($t);
		});
	}

	private onClick($item) {
		var selName = $item.data("value");
		var selId = $item.data("id");
		this.$input.val(selName);

		this.$cont.html("");

		var data = { id: selId, name: selName };
		this.onSelected(data);
	}

	private getItemHtml(item) {
		var code = item.iataFaa;
		if (code === "") {
			code = item.icao;
		}

		var displayName = `${item.name} (${item.city})`;
		var displayNameSel = `${item.city} (${code})`;

		return `<li data-value="${displayNameSel}" data-id="${item.id}">${displayName}<span class="color2">• ${code}</span></li>`;
	}
}

class TravelDialog {
	public dialogManager: DialogManager;

	private files: Files;
  private data: any;
	constructor(dialogManager: DialogManager) {
		this.dialogManager = dialogManager;
	}

	public display() {
	 this.dialogManager.closeDialog();

	 this.dialogManager.getDialogData(TripEntityType.Travel, (response) => this.create(response));	 
	}

	private create(data) {
		this.data = data;
	  var $rowCont = $("#" + data.id).parent();
		this.buildTemplate($rowCont);

		this.initTravelType(data.type);

		this.dialogManager.initDescription(data.description, TripEntityType.Travel);

		this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Travel);
		this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);

		this.initAirport(data.flightFrom, "airportFrom", "flightFrom");
		this.initAirport(data.flightTo, "airportTo", "flightTo");

		this.initDatePicker("leavingDate", "leavingDateTime", data.leavingDateTime);
		this.initDatePicker("arrivingDate", "arrivingDateTime", data.arrivingDateTime);

		this.initTimePicker("leavingHours", "leavingMinutes", "leavingDateTime", data.leavingDateTime);
		this.initTimePicker("arrivingHours", "arrivingMinutes", "arrivingDateTime", data.arrivingDateTime);
	}

	private initTimePicker(hrsElementId, minElementId, propName, curDateStr) {
		var $hrs = $("#" + hrsElementId);
		var $min = $("#" + minElementId);

		if (curDateStr) {
		 var utcTime = Utils.dateStringToUtcDate(curDateStr);
		 $hrs.val(utcTime.getUTCHours());
		 $min.val(utcTime.getUTCMinutes());
		}

		var dHrs = new DelayedCallback($hrs);
		dHrs.callback = () => { this.onTimeChanged($hrs, $min, propName); }
		$hrs.change(() => { this.onTimeChanged($hrs, $min, propName); });
		
		var mHrs = new DelayedCallback($min);
		mHrs.callback = () => { this.onTimeChanged($hrs, $min, propName); }
		$min.change(() => { this.onTimeChanged($hrs, $min, propName); });

	}

	private onTimeChanged($hrs, $min, propName) {
	  var hrs = $hrs.val();
			if (hrs === "") {
				hrs = "0";
			}
			var min = $min.val();
			if (min === "") {
				min = "0";
			}

			var time = { hour: hrs, minute: min };
			this.updateDateTime(null, time, propName);
  }

	private initDatePicker(elementId, propertyName, curDateStr) {
		var dpConfig = this.datePickerConfig();
		var $datePicker = $("#" + elementId);

		$datePicker.datepicker(dpConfig);

		if (curDateStr) {
			var utcTime = Utils.dateStringToUtcDate(curDateStr);			
			$datePicker.datepicker("setDate", utcTime);
		}

		$datePicker.change((e) => {
			var $this = $(e.target);
			var date = $this.datepicker("getDate");
			var datePrms = this.getDatePrms(date);
			this.updateDateTime(datePrms, null, propertyName);

			var travel = this.dialogManager.planner.placesMgr.getTravelById(this.data.id);
			var placeId = elementId === "arrivingDate" ? travel.to.id : travel.from.id;
		  
			var utcDate = Utils.dateToUtcDate(date);
			this.dialogManager.planner.updateRibbonDate(placeId, elementId, utcDate);			
		});
	}
 

	private getDatePrms(date) {
		var datePrms = {
			year: date.getUTCFullYear(),
			month: date.getUTCMonth() + 1,
			day: date.getUTCDate() + 1
	 }

		if (datePrms.day === 32) {
			datePrms.day = 1;
			datePrms.month = datePrms.month + 1;
		}

		return datePrms;
	}

	private updateDateTime(date, time, propName) {
		var fullDateTime = {};
		if (date) {
			fullDateTime = $.extend(fullDateTime, date);
		}
		if (time) {
			fullDateTime = $.extend(fullDateTime, time);
		}

		var data = this.dialogManager.getPropRequest(propName, fullDateTime);
		Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {
			
		});
	}

	private datePickerConfig() {
	  return {
		  dateFormat: "dd.mm.yy"
	  };
  }

	private initAirport(flight, comboId, propName) {
		var airportFrom = new AirportCombo(comboId);
		airportFrom.onSelected = (evntData) => {
			var data = this.dialogManager.getPropRequest(propName,
			{
				id: evntData.id,
				name: evntData.name
			});
			Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {});		 
		}
	  if (flight) {
		 airportFrom.setText(flight.selectedName);
		}
	}

	private initTravelType(initTravelType: TravelType) {
		this.showHideTravelDetails(initTravelType);
	  var $combo = $("#travelType");
		var $input = $combo.find("input");
		$input.val(initTravelType);
		var $initIcon = $combo.find(`li[data-value='${initTravelType}']`);
		var cls = $initIcon.data("cls");
		var cap = $initIcon.data("cap");

		$combo.find(".selected").html(`<span class="${cls} black left mright5"></span>${cap}`);

		$combo.find("li").click(evnt => {
			var travelType = $(evnt.target).data("value");
			this.showHideTravelDetails(travelType);
			var data = this.dialogManager.getPropRequest("travelType", { travelType: travelType });
			Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, (response) => {
				var $currentIcon = $combo.find(`li[data-value='${travelType}']`);
				var currentCls = $currentIcon.data("cls");
				$(".active").children().first().attr("class", currentCls);
			});

		});
	}

	private showHideTravelDetails(travelType: TravelType) {
		var $flightDetails = $("#flightDetails");

		$flightDetails.hide();

		if (travelType === TravelType.Plane) {
			$flightDetails.show();
		}
	}

	private buildTemplate($row) {
		var html = this.dialogManager.travelDetailTemplate();
		var $html = $(html);
		this.dialogManager.regClose($html);

		$row.after($html);
	}
}

class Utils {
	public static dateStringToUtcDate(dateStr: string): Date {
		var dateLocal = new Date(Date.parse(dateStr));
		var userOffset = dateLocal.getTimezoneOffset() * 60000;
		var utcTime = new Date(dateLocal.getTime() + userOffset);
		return utcTime;				
	}

	public static dateToUtcDate(dateLocal: Date): Date {	 
	 var userOffset = dateLocal.getTimezoneOffset() * 60000;
	 var localUtcTime = new Date(dateLocal.getTime() - userOffset);

	 var utcDate = new Date(Date.UTC(localUtcTime.getUTCFullYear(), localUtcTime.getUTCMonth(), localUtcTime.getUTCDate()));	 
	 return utcDate;
	}
}


class Planner {

  public trip: any; 

  public placesMgr: PlacesManager;
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
  
  private inverseColor = false;

	private $adder: any;
	private $lastCell: any;
 
	constructor(trip: any) {
		this.dialogManager = new DialogManager(this);
		this.placeDialog = new PlaceDialog(this.dialogManager);
		this.travelDialog = new TravelDialog(this.dialogManager);
		this.trip = trip;

		this.registerTemplates();
	
		this.placesMgr = new PlacesManager(trip.id);
		this.placesMgr.setData(trip.travels, trip.places);
		this.redrawAll();
	}

	private redrawAll() {
		var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");
	 
		var placeCount = 0;
		orderedPlaces.forEach((place) => {
			placeCount++;
		 
			this.manageRows(placeCount);
			this.addPlace(place, this.inverseColor);

			if (place.leaving) {
				var travel = place.leaving;			
				this.addTravel(travel, this.inverseColor);
			}

			this.inverseColor = !this.inverseColor;

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
	 this.addPlaceTemplate = Views.ViewBase.currentView.registerTemplate("addPlace-template");
	 this.travelTemplate = Views.ViewBase.currentView.registerTemplate("travel-template");
	 this.placeTemplate = Views.ViewBase.currentView.registerTemplate("place-template");		
	}

	public addEnd() {
		this.dialogManager.closeDialog();
		this.dialogManager.deactivate();

		var lastPlace = this.placesMgr.getLastPlace();
		var data = { selectorId: lastPlace.id, position: NewPlacePosition.ToRight, tripId: this.trip.tripId };

		Views.ViewBase.currentView.apiPost("tripPlanner", data, (response) => {		 
			var t = this.placesMgr.mapTravel(response.travel, lastPlace, null);
			lastPlace.leaving = t;
			this.placesMgr.travels.push(t);
		 
			var p = this.placesMgr.mapPlace(response.place, t, null);
			t.to = p;
			this.placesMgr.places.push(p);
			 
			this.manageRows(this.placesMgr.places.length);

			//$("#" + lastPlace.id).find(".leaving").text(this.formatShortDateTime(t.leavingDateTime));
			this.updateRibbonDate(lastPlace.id, "leavingDate", t.leavingDateTime);

			this.addTravel(t, !this.inverseColor);		 
			this.addPlace(p, this.inverseColor);

			this.inverseColor = !this.inverseColor;

			this.dialogManager.selectedId = response.place.id;			
		});	 
	}

  public updateRibbonDate(placeId: string, livingArriving: string, date: Date) {
	  $("#" + placeId).find("." + livingArriving).text(this.formatShortDateTime(date));
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
 
	public addTravel(travel: Travel, inverseColor: boolean) {

		var context = {
			id: travel.id,
			icon: this.getTravelIcon(travel.type),
			colorClass: ""
	 };

		if (inverseColor) {
		 context.colorClass = "";
		} else {
		 context.colorClass = "green";		 
		}

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

	public addPlace(place: Place, inverseColor: boolean) {
		var self = this;

		var name = "Empty";
		if (place.place) {
			name = place.place.selectedName;
		}

		var context = {
			id: place.id,
			isActive: false,
			name: name,
			arrivingDate: "",
			leavingDate: "",
			arrivalDateLong: "",
			rowNo: this.lastRowNo,
			isFirstDay: (place.arriving == null),
			colorClassArriving: "",
			colorClassLeaving: ""
		}

		if (place.arriving != null) {
			var da = place.arriving.arrivingDateTime;
			context.arrivingDate = this.formatShortDateTime(da);
			context.arrivalDateLong = this.formatShortDateTime(da) + `${da.getUTCFullYear()}`;
		}

		if (place.leaving != null) {
			var dl = place.leaving.leavingDateTime;
			context.leavingDate = this.formatShortDateTime(dl);
		}

		if (inverseColor) {
		 context.colorClassArriving = "green";
		 context.colorClassLeaving = "";
		} else {
		 context.colorClassArriving = "";
		 context.colorClassLeaving = "green";
		}

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
  
  private formatShortDateTime(dt) {
	  return `${dt.getUTCDate() }.${dt.getUTCMonth() + 1}.`;
  }
  
}

class PlacesManager {
  private tripId: string;
	public places = [];
  public travels = [];

	constructor(tripId: string) {
		this.tripId = tripId;
	}

  public mapTravel(resp, from: Place, to: Place): Travel {
	  var t = new Travel();	 
		t.id = resp.id;
		t.type = resp.type;
		t.arrivingDateTime = Utils.dateStringToUtcDate(resp.arrivingDateTime);
		t.leavingDateTime = Utils.dateStringToUtcDate(resp.leavingDateTime);
		t.from = from;
	  t.to = to;
		return t;
  }

	public mapPlace(resp, arriving: Travel, leaving: Travel): Place {
		var p = new Place();
		p.id = resp.id;
		p.orderNo = resp.orderNo;
		p.place = resp.place;
		p.arriving = arriving;
		p.leaving = leaving;
	 
		return p;
	}

	public setData(travels, places) {
		places.forEach((place) => {
			var p = this.mapPlace(place, null, null);

			if (place.arrivingId) {
				p.arriving = this.getOrCreateTravelById(place.arrivingId, travels);
				p.arriving.to = p;
			}

			if (place.leavingId) {
				p.leaving = this.getOrCreateTravelById(place.leavingId, travels);
				p.leaving.from = p;
			}
			this.places.push(p);
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
	 
		var newTravelObj = this.mapTravel(newTravel, null, null);
		this.travels.push(newTravelObj);

		return newTravelObj;
	}

	public getTravelById(id: string): Travel {
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

  public arrivingDateTime: Date;
	public leavingDateTime: Date;
 
}