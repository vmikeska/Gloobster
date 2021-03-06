module Trip {
	export class PlaceTravelTime {

		private dialogManager;
		private data;

		private mainTmp;

		private $html;

		constructor(dialogManager, data) {
			this.mainTmp = Views.ViewBase.currentView.registerTemplate("placeTravelTime-template");
			this.dialogManager = dialogManager;
			this.data = data;
		}
			
		public create(type: TripEntityType) {
			var context = {};
				
			var v = Views.ViewBase.currentView;

			if (type === TripEntityType.Travel) {

				context = {
					infoTxt: v.t("HowLongTakesTravel", "jsTrip"),
					dir1: "leaving",
					dir2: "arriving",
					showLeft: true,
					showMiddle: true,
					showRight: true
					};
					
				this.$html = $(this.mainTmp(context));
					
				var travel = this.dialogManager.planner.placesMgr.getTravelById(this.data.id);
					
				this.initDatePicker("leavingDate", this.data.leavingDateTime, (datePrms, date) => {
						this.updateDateTime(datePrms, null, "leavingDateTime");

						var placeId = travel.from.id;
						this.ribbonUpdate(placeId, date, "leavingDate");
					});
					
				this.initDatePicker("arrivingDate", this.data.arrivingDateTime, (datePrms, date) => {
						this.updateDateTime(datePrms, null, "arrivingDateTime");

						var placeId = travel.to.id;
						this.ribbonUpdate(placeId, date, "arrivingDate");
				});
					
				this.initTimePicker("arrivingHours", "arrivingMinutes", "arrivingDateTime", this.data.arrivingDateTime);
				this.initTimePicker("leavingHours", "leavingMinutes", "leavingDateTime", this.data.leavingDateTime);					
			}

			if (type === TripEntityType.Place) {					
				var showLeft = (this.data.arrivingDateTime != null);
				var showRight = (this.data.leavingDateTime != null);
				var isComplete = showLeft && showRight;
					
				var infoTxt = this.getInfoText(isComplete, showLeft, showRight);

				context = {
					infoTxt: infoTxt,
					dir1: "arriving",
					dir2: "leaving",
					showLeft: showLeft,
					showMiddle: isComplete,
					showRight: showRight
				};
					
				this.$html = $(this.mainTmp(context));
					
				if (showRight) {						
					this.initDatePicker("leavingDate", this.data.leavingDateTime, (datePrms, date) => {
							this.updateDateTime(datePrms, null, "leavingDateTime", this.data.leavingId);
							this.ribbonUpdate(this.data.id, date, "leavingDate");
						});
						
					this.initTimePicker(
						"leavingHours",
						"leavingMinutes",
						"leavingDateTime",
						this.data.leavingDateTime,
						this.data.leavingId);						
				}
					
				if (showLeft) {
						
					this.initDatePicker("arrivingDate", this.data.arrivingDateTime, (datePrms, date) => {
							this.updateDateTime(datePrms, null, "arrivingDateTime", this.data.arrivingId);
							this.ribbonUpdate(this.data.id, date, "arrivingDate");
						});
						
					this.initTimePicker(
						"arrivingHours",
						"arrivingMinutes",
						"arrivingDateTime",
						this.data.arrivingDateTime,
						this.data.arrivingId);
				}
			}
				
			this.setUseTime(type);
				
			return this.$html;
		}

		private setUseTime(type) {
			var $tv = this.$html.find("#timeVis");
			$tv.prop("checked", this.data.useTime);
			this.visibilityTime(this.data.useTime);
			$tv.change((e) => {
				var state = $tv.prop("checked");
				var data = this.dialogManager.getPropRequest("useTime", { state: state, entityType: type });
				this.dialogManager.updateProp(data,
					(response) => {
					});
				this.visibilityTime(state);
			});
		}
			
		private getInfoText(isComplete, showLeft, showRight) {

				var v = Views.ViewBase.currentView;
				
			var infoTxt = "";
			if (isComplete) {
					infoTxt = v.t("HowLongStaying", "jsTrip");
			} else if (showLeft) {
					infoTxt = v.t("WhenArrive", "jsTrip");
			} else if (showRight) {
					infoTxt = v.t("WhenStartJourney", "jsTrip");
			}
			return infoTxt;
		}

		private visibilityTime(visible) {
			var $t = this.$html.find(".time");

			if (visible) {
				$t.show();
			} else {
				$t.hide();
			}
		}

		private initTimePicker(hrsElementId, minElementId, propName, curDateStr, customEntityId = null) {
			var $hrs = this.$html.find(`#${hrsElementId}`);
			var $min = this.$html.find(`#${minElementId}`);

			if (curDateStr) {
				var utcTime = Utils.dateStringToUtcDate(curDateStr);
				$hrs.val(utcTime.getHours());
				$min.val(utcTime.getMinutes());
			}

			var dHrs = new Common.DelayedCallback($hrs);
			dHrs.callback = () => { this.onTimeChanged($hrs, $min, propName, customEntityId); }
			$hrs.change(() => { this.onTimeChanged($hrs, $min, propName, customEntityId); });

			var mHrs = new Common.DelayedCallback($min);
			mHrs.callback = () => { this.onTimeChanged($hrs, $min, propName, customEntityId); }
			$min.change(() => { this.onTimeChanged($hrs, $min, propName, customEntityId); });
		}


		private initDatePicker(elementId, curDateStr, onChange) {				
			var utc = curDateStr ? moment.utc(curDateStr) : moment.utc();
			
			var $dpCont = this.$html.find(`#${elementId}`);
			
			var dp = new Common.MyCalendar($dpCont, utc);
			
			dp.onChange = (date) => {
				var datePrms = this.getDatePrms(date);
				onChange(datePrms, date);
			}
		}

		private ribbonUpdate(placeId, date, cssClass) {
			this.dialogManager.planner.updateRibbonDate(placeId, cssClass, date);
		}


		private getDatePrms(date) {
			var datePrms = {
				year: date.year(),
				month: date.month() + 1,
				day: date.date()
			}
			return datePrms;
		}

		private updateDateTime(date, time, propName, customEntityId = null) {
			var fullDateTime = {};
			if (date) {
				fullDateTime = $.extend(fullDateTime, date);
			}
			if (time) {
				fullDateTime = $.extend(fullDateTime, time);
			}

			var data = this.dialogManager.getPropRequest(propName, fullDateTime);
			if (customEntityId != null) {
				data.values.entityId = customEntityId;
			}

			this.dialogManager.updateProp(data, (response) => {});
		}

		private onTimeChanged($hrs, $min, propName, customEntityId = null) {
			var hrs = $hrs.val();
			if (hrs === "") {
				hrs = "0";
			}
			var min = $min.val();
			if (min === "") {
				min = "0";
			}

			var time = { hour: hrs, minute: min };
			this.updateDateTime(null, time, propName, customEntityId);
		}

	}
}