module Views {


		//http://www.hitmill.com/html/pastels.html

		export class TimelineView extends ViewBase {

				private daysPerMonth = 20;
				private daysPerMonthIndex = 30 / this.daysPerMonth;

				private lineHeight = 50;
				private gap = 2;

				private $cont = $(".main-frame");

				private colors = ["#CEA8F4", "#BCB4F3", "#A9C5EB", "#8CD1E6", "#AAAAFF", "#A8CFFF", "#99E0FF", "#93EEAA", "#A6CAA9", "#AAFD8E", "#FFBBFF", "#EEBBEE", "#FFBBBB", "#FFBBDD"];

				private data = [
						{ lineNo: 0, title: "Finishing current hourly estimated backlog / feedbacks / UX", monthStart: 5, yearStart: 2017, daysDuration: 100 },
						{ lineNo: 0, title: "Deals universal market place - WEB", monthStart: 10, yearStart: 2017, daysDuration: 80 },


						{ lineNo: 1, title: "Hiring", monthStart: 5, yearStart: 2017, daysDuration: 60 },

						{ lineNo: 2, title: "Research of affiliate possibilities (fly tickets / holiday packages)", monthStart: 6, yearStart: 2017, daysDuration: 140 },
						

						{ lineNo: 3, title: "Mobile framework base + xamarin warm-up", monthStart: 8, yearStart: 2017, daysDuration: 40 },
						{ lineNo: 3, title: "Android client base without Deals", monthStart: 10, yearStart: 2017, daysDuration: 60 },
						{ lineNo: 3, title: "iOS client base without Deals", monthStart: 1, yearStart: 2018, daysDuration: 60 },

						{ lineNo: 3, title: "Android client - Deals", monthStart: 11, yearStart: 2018, daysDuration: 60 },
						{ lineNo: 3, title: "iOS client - Deals", monthStart: 2, yearStart: 2019, daysDuration: 60 },

						{ lineNo: 4, title: "Filling the wiki - Phase 1", monthStart: 6, yearStart: 2017, daysDuration: 260 },
						
						{ lineNo: 6, title: "Paid marketing testing,PR articles,backlinks,...", monthStart: 6, yearStart: 2017, daysDuration: 240 },
						{ lineNo: 6, title: "MIS planning", monthStart: 6, yearStart: 2018, daysDuration: 19 },
						{ lineNo: 6, title: "Marketing in the streets", monthStart: 7, yearStart: 2018, daysDuration: 40 },

						
						{ lineNo: 9, title: "I. phase of development", monthStart: 5, yearStart: 2017, daysDuration: 220 },
						{ lineNo: 9, title: "Debugging, Ideas, Feedbacks", monthStart: 4, yearStart: 2018, daysDuration: 60 },
						{ lineNo: 9, title: "Searching for II. level investor, Supporting and hotfixing", monthStart: 7, yearStart: 2018, daysDuration: 80 },
						{ lineNo: 9, title: "II. phase of development", monthStart: 11, yearStart: 2018, daysDuration: 240 },

						{ lineNo: 10, title: "I. budget, I. payment", monthStart: 5, yearStart: 2017, daysDuration: 280 },
						{ lineNo: 10, title: "I. budget, II. payment", monthStart: 7, yearStart: 2018, daysDuration: 80 },
						

				];

				constructor() {
						super();
						this.draw();

						var maxRows = _.max(_.map(this.data, (i) => { return i.lineNo; }));
						$(".master-cont").css("height", ((maxRows + 2) * (this.lineHeight + this.gap) + "px"));

						$(window).resize(() => {
								this.$cont.empty();
								this.draw();
						});
				}

				public draw() {
						var width = $(window).width();

						var startEnd = this.getStartEnd();
						var daysLength = startEnd.end.diff(startEnd.start, "days");
						
						var monthsLength = daysLength / 30;

						var pxPerDay = width / daysLength;

						//draw time
						var totalMonths = Math.round(monthsLength);
						var actDate = startEnd.start.clone();

						for (var actMonth = 0; actMonth <= totalMonths - 1; actMonth++) {

								var month = actDate.month() + 1;

								var left = (actMonth * 30) * pxPerDay;

								this.drawTime(left, month, actDate.year());

								actDate.add(1, "months");
						}
						//draw time


						this.data.forEach((item) => {								
								var top = item.lineNo * (this.lineHeight + this.gap) + this.gap;

								var itemStart = this.parseDate(item.yearStart, item.monthStart);
								//fnc for decimal days
								var decMonth = item.monthStart - Math.floor(item.monthStart);
								if (decMonth > 0) {
										var days = decMonth * 30;
									itemStart.add(days, "days");
								}

								var daysFromStart = itemStart.diff(startEnd.start, "days");
								var left = daysFromStart * pxPerDay;

								var width = pxPerDay * (item.daysDuration * this.daysPerMonthIndex);

								var color = this.getColor(item.lineNo);

								this.drawItem(color, item.title, top, left, width);

								//currentItem++;
						});

				}

				private getColor(index) {
						if (index <= this.colors.length) {
								return this.colors[index];
						}

						return this.getRandomColor();
				}

				private getRandomColor() {
						var letters = '0123456789ABCDEF';
						var color = '#';
						for (var i = 0; i < 6; i++) {
								color += letters[Math.floor(Math.random() * 16)];
						}
						return color;
				}

				private drawTime(left, month, year) {
						var $t = $(`<div class="time" style="left: ${left}px;">
												<div class="month">${month}</div>
												<div class="year">${year}</div>
										</div>`);
						this.$cont.append($t);
				}

				private drawItem(color, txt, top, left, width) {
						var $i = $(`<div class="item" style="background-color: ${color}; top: ${top}px; left: ${left}px; width: ${width}px;">
														<span class="txt">${txt}</span>
												</div>`);
						this.$cont.append($i);
				}

				private parseDate(y, m) {
						var o = { y: y, M: m - 1, d: 1 };
						var d = moment(o);
						return d;
				}

				private getStartEnd() {

						var start = null;
						var end = null;

						this.data.forEach((item) => {

								var o = this.parseDate(item.yearStart, item.monthStart);
								var from = moment(o);

								var to = from.clone();
								var daysToAdd = item.daysDuration * this.daysPerMonthIndex;
								to.add(daysToAdd, "days");

								if (start === null) {
										start = from;
								} else if (start.isAfter(from)) {
										start = from;
								}

								if (end === null) {
										end = to;
								} else if (end.isBefore(to)) {
										end = to;
								}
						});

						return { start: start, end: end };
				}


		}
}