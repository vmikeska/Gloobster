module Views {

		

		export class MyCalendar {

				private mondayWeekDays = ["mo", "tu", "we", "th", "fr", "sa", "su"];
				private sundayWeekDays = ["su", "mo", "tu", "we", "th", "fr", "sa"];

				private $cont;
				private $calCont;
				public date;
				private id;
				
				constructor($cont, id: string, date: Date = null) {
						this.$cont = $cont;
					  this.id = id;
						
						if (date) {
							this.date = date;
						} else {

							this.date = new Date();								
						}

						var mondayFirst = true;
						if (mondayFirst) {
							this.daysOrder = this.mondayWeekDays;
						} else {
								this.daysOrder = this.sundayWeekDays;
						}
				}

				private daysOrder = [];

				public gen() {						
						this.createInput();
				}

				private onFocus() {
					this.genCal();
				}

				private createCalBase() {
						var calTmp = Views.ViewBase.currentView.registerTemplate("calendar-base-template");
						this.$calCont = $(calTmp());
					 this.$cont.append(this.$calCont);
				}

				private genCal() {

						this.getCalEnd(this.date);

						this.createCalBase();

						var date = this.getCalStart(this.date);

					var sameMonth = true;
					var origMonthNo = date.month();

					while (sameMonth) {

							var $weekCont = $(`<div class="week-row"></div>`);
							
							for (var act = 1; act <= 7; act++) {

								var dayNo = date.date();

								var $day = $(`<div class="day">${dayNo}</div>`);
								$weekCont.append($day);

								date.add(1, "days");
							}

							if (date.month() !== origMonthNo) {
								sameMonth = false;
							}

						this.$calCont.append($weekCont);
					}



				}

				private getCalStart(date) {
						var d = this.getFirstDayOfMonth(date);
						var ed = this.getWeekFirstDate(d);
					return ed;
				}

				private getCalEnd(date) {
						var me = moment(date);
						me.locale("cs");
						me.endOf("month");
						me.endOf("week");
						return me;
				}

				private getWeekFirstDate(date) {
						
						date.locale("en");
						var curDay = date.format("dd").toLowerCase();

					  var dayNo = this.getArrayOrderNo(this.daysOrder, curDay);

					//var firstWeekDate = moment(date);
					while (dayNo !== 0) {
							date.add(-1, "days");
						dayNo--;
					}

					return date;
				}

				private getFirstDayOfMonth(date) {
						var d = moment(date).startOf('month');
						return d;
				}

			private getArrayOrderNo(arr, val) {
				var found = null;

				for (var act = 0; act <= arr.length -1; act++) {
					var v = arr[act];
					if (v === val) {
						found = act;
					}
				}

				return found;
			}

			private createInput() {

						var isNative = false;
						
						if (isNative) {
							this.$cont.html(`<input class="calendar-input" type="date" id="${this.id}" />`);
						} else {

								var $si = $(`<input class="calendar-input" type="text" id="${this.id}" />`);
								this.$cont.html($si);

							  var d = moment().format("L");

							  $si.val(d);

							$si.focusin(() => {
								this.onFocus();
							});

						}

				}


		}


		export class HomePageView extends ViewBase {

			constructor() {
				super();

				AirLoc.registerLocationCombo($("#currentCity"), (place) => {
						window.location.href = "/deals";
				});

				var cal = new MyCalendar($("#testCont"), "myDate");
				cal.gen();

			}

			public get pageType(): PageType { return PageType.HomePage; }

	}
}