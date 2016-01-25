module Trip {
	export class Planner {

		public trip: any;

		public isOwner: boolean;
		public isInvited: boolean;

		public placesMgr: PlacesManager;
		private dialogManager: DialogManager;
		private placeDialog: PlaceDialog;
		private travelDialog: TravelDialog;

		private addPlaceTemplate: any;
		private travelTemplate: any;
		private placeTemplate: any;


		public $currentContainer = $("#plannerCont1");
		public editable: boolean;

		private lastRowNo = 1;
		private placesPerRow = 4;
		private contBaseName = "plannerCont";

		private inverseColor = false;

		private $adder: any;
		private $lastCell: any;

		constructor(trip: any, editable: boolean) {

		 var thisParticipant = _.find(trip.participants, (p) => { return p.userId === Reg.LoginManager.currentUserId });
		 this.isInvited = (thisParticipant != null);
			this.isOwner = trip.ownerId === Reg.LoginManager.currentUserId;

			this.editable = editable;
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

			if (this.editable) {
				this.addAdder();
			}
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
			return `${dt.getUTCDate()}.${dt.getUTCMonth() + 1}.`;
		}

	}

}