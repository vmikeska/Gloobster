class PlaceDialog  {
	public dialogManager: DialogManager;
	private placeSearch: PlaceSearchBox;
	private addressSearch: PlaceSearchBox;
	private placeToVisitSearch: PlaceSearchBox;

	private files: Files;

  private $rowCont;

	constructor(dialogManager: DialogManager) {
		this.dialogManager = dialogManager;	
	}

	public display() {
		this.dialogManager.closeDialog();

		this.dialogManager.getDialogData(TripEntityType.Place, (data) => {
			this.$rowCont = $("#" + data.id).parent();

			if (this.dialogManager.planner.editable) {
				this.createEdit(data);
			} else {
				this.createView(data);
			}
		});
	}

	private createView(data) {
	 this.buildTemplateView(this.$rowCont, data);
	 
	 this.files = this.dialogManager.createFilesInstanceView(data.id, TripEntityType.Place);
	 this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);
	}

	private createEdit(data) {
		
	 this.buildTemplateEdit(this.$rowCont);

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
 
	private buildTemplateView($row, data) {
	 var name = "Empty";
	 if (data.place) {
		name = data.place.selectedName;
	 }

	 var context = {
		  name: name,
			description: data.description,
			wantVisit: []			
	  }

	 context.wantVisit = _.map(data.wantVisit, (item) => {
		 return {
			name: item.selectedName,
			icon: this.getIcon(item.sourceType)			
		 }
		});

	 var html = this.dialogManager.travelDetailViewTemplate(context);
	 var $html = $(html);
	 this.dialogManager.regClose($html);

	 $row.after($html);
	}

	private buildTemplateEdit($row) {	 
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

		this.dialogManager.updateProp(data, (response) => {
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
	 
		this.dialogManager.updateProp(data, (response) => { });
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
	
		this.dialogManager.updateProp(data, (response) => { });

	}

	private addPlaceToVisit(id: string, name: string, sourceType: SourceType) {		
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

			this.dialogManager.updateProp(data, (response) => { });
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