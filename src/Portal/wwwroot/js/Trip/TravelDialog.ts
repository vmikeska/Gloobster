module Trip {
	export class TravelDialog {
		public dialogManager: DialogManager;

		private files: Files;
		private data: any;

		private $rowCont;

		constructor(dialogManager: DialogManager) {
			this.dialogManager = dialogManager;
		}

		public display() {
			this.dialogManager.closeDialog();

			this.dialogManager.getDialogData(Common.TripEntityType.Travel, (data) => {
				this.data = data;
				this.$rowCont = $("#" + data.id).parent();

				if (this.dialogManager.planner.editable) {
					this.createEdit(data);
				} else {
					this.createView(data);
				}
			});

		}

		private createView(data) {
			this.buildTemplateView(data);

			this.files = this.dialogManager.createFilesInstanceView(data.id, Common.TripEntityType.Travel);
			this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);
		}

		private buildTemplateView(data) {

			var context = {
				description: data.description,
				isFlight: false
			};


			if (data.type === TravelType.Plane) {
				context.isFlight = true;
				var contextFlight = {
					from: "",
					to: "",

					flightDetails: "Delta Air Flight 2560 from Prague to Vienna"
				};

				if (data.flightFrom) {
					contextFlight.from = data.flightFrom.selectedName;
				}
				if (data.flightTo) {
					contextFlight.to = data.flightTo.selectedName;
				}

				context = $.extend(context, contextFlight);
			}


			var html = this.dialogManager.travelDetailViewTemplate(context);
			var $html = $(html);
			this.dialogManager.regClose($html);

			this.$rowCont.after($html);
		}

		private createEdit(data) {


			this.buildTemplateEdit(this.$rowCont);

			this.initTravelType(data.type);

			this.dialogManager.initDescription(data.description, Common.TripEntityType.Travel);

			this.files = this.dialogManager.createFilesInstance(data.id, Common.TripEntityType.Travel);
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

			var dHrs = new Common.DelayedCallback($hrs);
			dHrs.callback = () => { this.onTimeChanged($hrs, $min, propName); }
			$hrs.change(() => { this.onTimeChanged($hrs, $min, propName); });

			var mHrs = new Common.DelayedCallback($min);
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
			this.dialogManager.updateProp(data, (response) => {});
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

			$combo.find(".selected").html(`<span class="${cls} black left mright5"></span>${cap}`);

			$combo.find("li").click(evnt => {
				var travelType = $(evnt.target).data("value");
				this.showHideTravelDetails(travelType);
				var data = this.dialogManager.getPropRequest("travelType", { travelType: travelType });
				this.dialogManager.updateProp(data, (response) => {
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

		private buildTemplateEdit($row) {
			var html = this.dialogManager.travelDetailTemplate();
			var $html = $(html);
			this.dialogManager.regClose($html);

			$row.after($html);
		}
	}
}