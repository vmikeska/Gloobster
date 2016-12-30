module Trip {
	export class TravelDialog {
		public dialogManager: DialogManager;

		private files: TripFiles;
		private data: any;
			
		constructor(dialogManager: DialogManager) {
			this.dialogManager = dialogManager;
		}

		public display() {
			
			this.dialogManager.getDialogData(TripEntityType.Travel, (data) => {
				this.data = data;

				if (this.dialogManager.planner.editable) {
					this.createEdit(data);
				} else {
					this.createView(data);
				}
			});

		}

		private createView(data) {
			this.buildTemplateView(data);

			this.files = this.dialogManager.createFilesInstanceView(data.id, TripEntityType.Travel);
			this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);
		}

		private extendContextForFlight(context, data) {
			context.isFlight = true;
			var contextFlight = {
				from: "",
				to: "",

				flightDetails: "-"
			};

			if (data.flightFrom) {
				contextFlight.from = data.flightFrom.selectedName;
			}
			if (data.flightTo) {
				contextFlight.to = data.flightTo.selectedName;
			}
			var newContext = $.extend(context, contextFlight);
			return newContext;
		}

		private formatDate(d, useTime) {

			var fs = useTime ? "LLL" : "LL";
			var v = moment.utc(d).format(fs);
			return v;
		}

		private buildTemplateView(data) {
			var html = "";

			var lDate = new Date(data.leavingDateTime);
			var aDate = new Date(data.arrivingDateTime);

			if (this.dialogManager.planner.isInvited || this.dialogManager.planner.isOwner) {

				var contextInvited = {
					arrivingDateTime: this.formatDate(lDate, data.useTime),
					leavingDateTime: this.formatDate(aDate, data.useTime),
					description: data.description,
					isFlight: false
				};

				if (data.type === TravelType.Plane) {
					contextInvited = this.extendContextForFlight(contextInvited, data);
				}

				html = this.dialogManager.travelDetailViewTemplate(contextInvited);
			} else {
				var contextNonInvited = {
					arrivingDateTime: this.formatDate(lDate, data.useTime),
					leavingDateTime: this.formatDate(aDate, data.useTime),
					isFlight: false
				};
				if (data.type === TravelType.Plane) {
					contextNonInvited = this.extendContextForFlight(contextNonInvited, data);
				}

				html = this.dialogManager.travelDetailViewFriends(contextNonInvited);
			}

			var $html = $(html);
			this.dialogManager.regClose($html);

			this.dialogManager.insertDialog($html);
		}

		private createEdit(data) {
			this.buildTemplateEdit(data);

			this.initTravelType(data.type);

			this.dialogManager.initDescription(data.description, TripEntityType.Travel);

			this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Travel);
			this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);

			this.initAirport(data.flightFrom, "airportFrom", "flightFrom");
			this.initAirport(data.flightTo, "airportTo", "flightTo");
		}

		private initAirport(flight, comboId, propName) {
			var airportFrom = new AirportCombo(comboId);
			airportFrom.onSelected = (evntData) => {
				var data = this.dialogManager.getPropRequest(propName,
				{
					id: evntData.id,
					name: evntData.name
				});
				this.dialogManager.updateProp(data, (response) => {});
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

			$combo.find(".selected").html(`<span class="ticon ${cls} black"></span>    ${cap}`);

			$input.change((e) => {
				var travelType = parseInt($input.val());
				this.showHideTravelDetails(travelType);
				var data = this.dialogManager.getPropRequest("travelType", { travelType: travelType });

				this.dialogManager.updateProp(data, (r) => {
					var $currentIcon = $combo.find(`li[data-value='${travelType}']`);
					var currentCls = $currentIcon.data("cls");


					$(".active").find(".ticon").attr("class", `ticon ${currentCls}`);
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

		private buildTemplateEdit(data) {
			var $html = $(this.dialogManager.travelDetailTemplate());

			var ptt = new PlaceTravelTime(this.dialogManager, data);
			var $time = ptt.create(TripEntityType.Travel);
			$html.find(".the-first").after($time);

			Common.DropDown.registerDropDown($html.find(".dropdown"));
			this.dialogManager.regClose($html);

			this.dialogManager.insertDialog($html);
		}
	}
}