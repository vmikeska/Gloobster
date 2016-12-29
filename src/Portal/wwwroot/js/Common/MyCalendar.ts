module Common {
		
		export class MyCalendar {

				public onChange:Function;

				private $cont;
				private $calCont;

				public date;
				private now;

				private id;
				private $input;

				private opened = false;
				
				constructor($cont, id: string, date = null) {
						this.$cont = $cont;
					  this.id = id;

						this.now = moment();

						if (date) {
								this.date = date;								
						} else {
							this.date = moment();								
						}
						this.date.startOf("day");						
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

						this.$calCont.find(".close").click((e) => {
								e.preventDefault();
								this.closeCal();
						});

				}

				private regMove() {
					this.$cont.find(".move-month").click((e) => {
							var $t = $(e.target);

							var prev = $t.hasClass("prev");
							var directionVal = prev ? -1 : 1;

							this.date.add(directionVal, "months");

							this.closeCal();
							this.genCal();
					});
				}

				private closeCal() {
						this.$cont.find(".my-calendar-win").remove();
						this.opened = false;
				}

			private genCal() {

				this.opened = true;
				this.createCalBase();

				this.regMove();

				var origDate = moment(this.date);

				var date = this.getCalStart(this.date);
				var end = this.getCalEnd(this.date);

				var titleFinished = false;

				var notEnd = true;

				this.$calCont.find(".months .date").html(origDate.format("MMMM YYYY"));

				var $bottom = this.$calCont.find(".bottom");

				while (notEnd) {

					var $weekCont = $(`<div class="week-row"></div>`);

					for (var act = 1; act <= 7; act++) {

						if (!titleFinished) {

							var $tc = this.$calCont.find(".days-title");

							var txt = date.format("dd");
							var $td = $(`<div class="day">${txt}</div>`);
							$tc.append($td);

							if (act === 6 || act === 7) {
									$td.addClass("weekend");
							}
						}

						var dayNo = date.date();

						var $day = $(`<div class="day" data-d="${dayNo}" data-m="${date.month()}" data-y="${date.year()}">${dayNo}</div>`);
						$weekCont.append($day);

						$day.click((e) => {
							var $t = $(e.target);
							var day = $t.data("d");
							var month = $t.data("m");
							var year = $t.data("y");

							var d = moment([year, month, day]);
							this.dayClicked(d, $t);
						});

						var daysDiff = this.now.diff(date, "day");

						var isPast = daysDiff > 0;

						if (isPast) {
							$day.addClass("old");
						} else {
							if (act === 6 || act === 7) {
								$day.addClass("weekend");
							}

							$day.addClass("selectable");
						}

						if (origDate.month() === date.month() && origDate.date() === date.date()) {
							$day.addClass("active");
						}

						if (end.month() === date.month() && end.date() === date.date()) {
							notEnd = false;
						}

						date.add(1, "days");
					}

					titleFinished = true;

					$bottom.before($weekCont);
				}

			}

			private dayClicked(date, $day) {

						this.$cont.find(".week-row .day").removeClass("active");
						$day.addClass("active");

						this.$input.val(date.format("L"));

						if (this.onChange) {
							this.onChange(date);
						}

					this.closeCal();
				}

			private getCalStart(date) {
				var d = date.clone();
				d.startOf("month");
				d.startOf("week");

				return d;
			}

			private getCalEnd(date) {
				var d = date.clone();

				d.endOf("month");
				d.endOf("week");
				return d;
			}
				
			private createInput() {

					var os = Views.ViewBase.getMobileOS();

						var isNative = os !== OS.Other;
				
						if (isNative) {
							this.$input = $(`<input class="calendar-input" type="date" id="${this.id}" />`);
							this.$cont.html(this.$input);
								
							var input = document.getElementById(this.id);								
							input["valueAsDate"] = this.date.toDate();
							
						} else {

								this.$input = $(`<input class="calendar-input" readonly type="text" id="${this.id}" />`);
								this.$cont.html(this.$input);

							  var d = moment().format("L");

								this.$input.val(d);

								this.$input.focusin(() => {
								this.onFocus();
							});

						}

				}


		}
		
}