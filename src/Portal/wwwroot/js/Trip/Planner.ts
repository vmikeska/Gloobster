module Trip {
	export class Planner {

		public trip: any;
		public resizer: Trip.TripResizer;

		public isOwner: boolean;
		public isInvited: boolean;

		public placesMgr: PlacesManager;
		private dialogManager: DialogManager;
		private placeDialog: PlaceDialog;
		private travelDialog: TravelDialog;

		private addPlaceTemplate: any;
		private travelTemplate: any;
		private placeTemplate: any;
			
		private $activeBlock;

		public $currentContainer = $("#dataCont");
		public editable: boolean;
		
		private emptyName = Views.ViewBase.currentView.t("Unnamed", "jsTrip");

		private inverseColor = false;

		private $adder: any;
		private $lastCell: any;

		constructor(trip: any, editable: boolean) {

			var thisParticipant = _.find(trip.participants, (p) => {
				return p.userId === Views.ViewBase.currentUserId;
			});

			this.isInvited = (thisParticipant != null);
			this.isOwner = trip.ownerId === Views.ViewBase.currentUserId;

			this.editable = editable;
			this.dialogManager = new DialogManager(this);
			this.placeDialog = new PlaceDialog(this.dialogManager);
			this.travelDialog = new TravelDialog(this.dialogManager);
			this.trip = trip;

			this.registerTemplates();

			this.placesMgr = new PlacesManager(trip.id);
			this.placesMgr.setData(trip.travels, trip.places);
			this.redrawAll();

			this.initResizer();
		}

		private $lastBlockOnRow;

		private initResizer() {
				this.resizer = new TripResizer();

			this.resizer.onBeforeResize = () => {								
					var $cd = $(".details");
					if ($cd.length > 0) {
						$cd.hide();
					}
			}

			this.resizer.onAfterResize = () => {								
				var $cd = $(".details");
				if ($cd.length > 0) {
						this.$lastBlockOnRow = this.resizer.getLast(this.$activeBlock.data("no"));
						this.$lastBlockOnRow.after($cd);
						$cd.slideDown();
				}
			}
		}

		private redrawAll() {
			var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");

			var placeCount = 0;			
			orderedPlaces.forEach((place) => {
				placeCount++;
					
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

		private refreshAdder() {
			this.$lastCell.remove();
			this.addAdder();
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
					
				this.updateRibbonDate(lastPlace.id, "leavingDate", t.leavingDateTime);

				this.addTravel(t, !this.inverseColor);
				this.addPlace(p, this.inverseColor);

				this.inverseColor = !this.inverseColor;

				this.dialogManager.selectedId = response.place.id;
			});
		}

		public updateRibbonDate(placeId: string, livingArriving: string, date) {
				$(`#${placeId}`).find(`.${livingArriving}`).text(this.formatShortDateTimeMoment(date));
		}

		private formatShortDateTimeMoment(dt) {				
			var d = dt.format("l");
			var v = d.replace(dt.year(), "");
			return v;
		}

		private formatShortDateTime(dt) {				
				var d = moment.utc(dt).format("l");				
				var v = d.replace(dt.getUTCFullYear(), "");
				return v;
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


		private regDateLinks($root) {
			$root.find(".dateLink").click((e) => {
				e.preventDefault();
				var $t = $(e.target);
				var $block = $t.closest(".placeCont");
				this.setActivePlaceOrTravel($block);
			});
		}
			
		private appendToTimeline($html) {
			if (this.$adder) {
				this.$lastCell.before($html);
			} else {
				this.$currentContainer.append($html);
			}
		}

		private activeBlockChanged($block) {
			this.$activeBlock = $block;
			this.$lastBlockOnRow = this.resizer.getLast($block.data("no"));


			this.dialogManager.$lastBlockOnRow = this.$lastBlockOnRow;			
		}

		private setActivePlaceOrTravel($block) {
				
				this.activeBlockChanged($block);
				var id = $block.attr("id");

			this.dialogManager.deactivate();
				
			var $cont = $(`#${id}`);
			var isPlace = $cont.hasClass("placeCont");
			var $actCont;
			var dialog;

			var tab = `<span class="tab"></span>`;

			if (isPlace) {
				dialog = this.placeDialog;
				$actCont = $cont.find(".destination");
				$cont.find(".tab-cont").html(tab);
			} else {
				dialog = this.travelDialog;
				$actCont = $cont.find(".transport");
				$actCont.append(tab);
			}

			$actCont.addClass("active");
			this.dialogManager.selectedId = id;
			dialog.display();
		}

		private getHighestBlockNo() {
			var highest = 0;
			this.$currentContainer.find(".block").toArray().forEach((b) => {
				var $b = $(b);

				var no = $b.data("no");
				if (no && no > highest) {
					highest = no;
				}					
			});

			return highest;
		}

		public addPlace(place: Place, inverseColor: boolean) {
			var name = this.emptyName;
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
				isFirstDay: (place.arriving == null),
				colorClassArriving: "",
				colorClassLeaving: "",
				arrivingId: "",
				leavingId: "",
				no: this.getHighestBlockNo() + 1
			}

			if (place.arriving != null) {
				var da = place.arriving.arrivingDateTime;
				context.arrivingDate = this.formatShortDateTime(da);
				context.arrivalDateLong = this.formatShortDateTime(da) + `${da.getUTCFullYear()}`;
				context.arrivingId = place.arriving.id;
			}

			if (place.leaving != null) {
				var dl = place.leaving.leavingDateTime;
				context.leavingDate = this.formatShortDateTime(dl);
				context.leavingId = place.leaving.id;
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
			this.regDateLinks($html);

			$html.find(".destination").click("*", (e) => {
				var $t = $(e.delegateTarget);
				var $block = $t.closest(".block");				
				this.setActivePlaceOrTravel($block);
			});

			this.appendToTimeline($html);

			return $html;
		}

		public addTravel(travel: Travel, inverseColor: boolean) {

				var context = {
						id: travel.id,
						icon: this.getTravelIcon(travel.type),
						colorClass: "",
						no: this.getHighestBlockNo() + 1
				};

				if (inverseColor) {
						context.colorClass = "";
				} else {
						context.colorClass = "green";
				}

				var html = this.travelTemplate(context);
				var $html = $(html);

				$html.find(".transport").click("*", (e) => {
						var $t = $(e.delegateTarget);
						var $block = $t.closest(".block");						
						this.setActivePlaceOrTravel($block);
				});

				this.appendToTimeline($html);

				return $html;
		}


		

	}

}