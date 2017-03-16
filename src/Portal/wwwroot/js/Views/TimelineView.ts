module Views {


		//http://www.hitmill.com/html/pastels.html

		export class ValueEditBuilder {

				public generate() {
						var $table = $(`<table class="values-edit-table"></table>`);

						var dlg = new ModDialog($table);

						var lg = Common.ListGenerator.init($table, "value-edit-template");

						lg.customMapping = (item) => {
								item.value = Business.Consts[item.id];
								return item;
						}

						lg.evnt("input", (e, $item, $target, item) => {
								var val = $item.find("input").val();
								
								try {
										Business.Consts[item.id] = Number(val);

										TimelineView.instance.refresh();

										Business.Consts.editableValues.forEach((ev) => {
												if (ev.disabled) {
														$(`#value_${ev.id}`).val(Business.Consts[ev.id]);
												}
										});

								} catch (exc) {

								}
								
						}).setEvent("input");



						lg.generateList(Business.Consts.editableValues);
				}

		}


		export class TableBuilder {
				public $table;

				constructor(cls = "") {
						this.$table = $(`<table cellspacing="0" cellpadding="0" class=${cls}></table>`);
				}

				public addThRow(items) {
						var $tr = $("<tr></tr>");
						items.forEach((i) => {
								var $th = $(`<th>${i}</th>`);
								$tr.append($th);
						});
						this.$table.append($tr);
				}

				public addTdRow(items) {
						var $tr = $("<tr></tr>");
						items.forEach((i) => {
								var $th = $(`<td>${i}</td>`);
								$tr.append($th);
						});
						this.$table.append($tr);
				}

				public addFirstThRestTrRow(items) {
						var $tr = $("<tr></tr>");
						var isFirst = true;
						items.forEach((i) => {

								if (isFirst) {
										var $th = $(`<th>${i}</th>`);
										$tr.append($th);
								} else {
										var $td = $(`<td>${i}</td>`);
										$tr.append($td);
								}

								isFirst = false;
						});
						this.$table.append($tr);
				}

		}

		export class ModDialog {
				private $dlg = $(".modal-dlg");
				public $cont = this.$dlg.find(".cont");

				public setTitle(title) {
						this.$dlg.find(".title").html(title);
				}

				constructor($html = "") {
						this.$cont.html($html);
						this.$dlg.removeClass("hidden");

						this.$dlg.find(".close")
								.click((e) => {

										this.$dlg.addClass("hidden");

										this.$cont.empty();

								});
				}
		}


		export class TimelineView extends ViewBase {

				public static instance: TimelineView;

				private balanceCalculator: Business.MonthBalanceCalculator;

				private lineHeight = 50;
				private gap = 6;
				private pxPerDay = 2;

				private startEnd;

				private $cont = $(".main-frame");
				private $times = $(".times");

				private colors = [
						"#CEA8F4", "#BCB4F3", "#A9C5EB", "#8CD1E6", "#AAAAFF", "#A8CFFF", "#99E0FF", "#93EEAA", "#A6CAA9", "#AAFD8E",
						"#FFBBFF", "#EEBBEE", "#FFBBBB", "#FFBBDD"
				];

				
				constructor() {
						super();

						TimelineView.instance = this;

						this.startEnd = this.getStartEnd();

						this.balanceCalculator = new Business.MonthBalanceCalculator(Business.Consts.data);

						this.draw();
						this.drawTitles();
						this.drawTimes();

						this.drawBudgets();

						this.drawMilestones();

						this.regMenu();

						var $cbm = $("#showMilestones");
						$cbm.change((e) => {
								$(".milestone").toggleClass("hidden", !$cbm.prop("checked"));
						});

						var lastLineNo = this.getMaxLineNo();
						$(".master-cont").css("height", ((lastLineNo + 7) * (this.lineHeight + this.gap) + "px"));
				}

				public refresh() {
						this.draw();
						this.drawTitles();
						this.drawMilestones();						
				}

				private regMenu() {
						$("#btnMonthlyBalance").click((e) => {
								e.preventDefault();
								this.showBalance();
						});

						$("#btnUserGrowth").click((e) => {
								e.preventDefault();
								this.showUserGrowth();
						});

						$("#btnExpense").click((e) => {
								e.preventDefault();
								this.showExpenses();
						});

						$("#btnValues").click((e) => {
								e.preventDefault();
								var vals = new ValueEditBuilder();
								vals.generate();
						});
				}

				private drawMilestones() {

						this.$cont.find(".milestone").remove();

						var months = this.balanceCalculator.calculate();
						
						Business.Consts.customMilestones.forEach((m) => {
								this.createMilestone(m.monthNo, m.yearNo, m.text);
						});

					  var dev3 = _.find(Business.Consts.monthlyExpense, { caption: "DEV3" });
						this.createMilestone(dev3.startMonth, dev3.startYear, "DEV3 hired");

						var dev4 = _.find(Business.Consts.monthlyExpense, { caption: "DEV4" });
						this.createMilestone(dev4.startMonth, dev4.startYear, "DEV4 hired");
						
						var breakEvenMonth: Business.IMonthBalance = _.find(months, (m: Business.IMonthBalance) => { return m.monthBalance > 0; });
						this.createMilestone(breakEvenMonth.monthNo, breakEvenMonth.yearNo, "Break even");

						//var investmentBackMonth: Business.IMonthBalance = _.find(months, (m: Business.IMonthBalance) => { return m.totalBalance > 0; });
						//this.createMilestone(investmentBackMonth.monthNo, investmentBackMonth.yearNo, "Investment = Cash");
				}

				private createMilestone(month, year, text) {

						var lastLineNo = this.getMaxLineNo();
						var height = (lastLineNo + 6) * (this.lineHeight + this.gap);
						var top = this.lineHeight;

						var left = this.getLeft(year, month);
						var $m = $(`<div class="milestone" style="top: ${top}px;height: ${height}px; left: ${left}px;"><div class="txt">${text}</div></div>`);
						this.$cont.append($m);
				}

				private showExpenses() {
						var expenses = Business.Consts.monthlyExpense;
						var onetime = Business.Consts.oneTimeExpense;

						var $tables = $(`<div><h3>Monthly expenses</h3><div class="cont1"></div><h3>One time expenses</h3><div class="cont2"></div></div>`);

						var tb = new Views.TableBuilder("oddEven");
						tb.addThRow(["Caption", "Type", "Start - End", "Months duration in I. budget", "Monthly cost", "Entire I. budget"]);

						var budget1YearEnd = Business.Consts.budgets[0].endYear;
						var budget1MonthEnd = Business.Consts.budgets[0].endMonth;

						expenses.forEach((ex: Business.IMonthlyExpense) => {

								var startEnd = this.balanceCalculator.getExpenseStartEnd(ex);

								var endStr = startEnd.end ? `${(startEnd.end.month() + 1)}/${startEnd.end.year()}` : "∞";

								var duration = startEnd.end ? startEnd.end.diff(startEnd.start, "months") : this.parseDate(budget1YearEnd, budget1MonthEnd).diff(startEnd.start, "months");

								var exDuration = this.balanceCalculator.getExpenseDurationInPeriod(ex, budget1MonthEnd, budget1YearEnd);
								var monthlyCost = ex.monthlyCost ? ex.monthlyCost : ex.dailyCost * Business.Consts.daysPerMonth;

								var costInFirstBudget = monthlyCost * exDuration;

								var tds = [ex.caption, Business.MonthlyExpenseType[ex.type], `${startEnd.start.month()}/${startEnd.start.year()}-${endStr}`, duration, `€${monthlyCost}`, `€${costInFirstBudget}`];
								tb.addTdRow(tds);
						});

						$tables.find(".cont1").append(tb.$table);

						var tbo = new TableBuilder("oddEven");
						tbo.addThRow(["Caption", "Date", "Cost"]);

						onetime.forEach((o: Business.IExpenseOneTime) => {
								tbo.addTdRow([o.caption, `${o.month}/${o.year}`, o.cost]);
						});

						$tables.find(".cont2").append(tbo.$table);

						var md = new Views.ModDialog($tables);
						md.setTitle("Expenses");
				}



				private showBalance() {
						var months = this.balanceCalculator.calculate();

						var dates = ["Month-Year"].concat(_.map(months, (r: Business.IMonthBalance) => { return `${r.monthNo}-${r.yearNo}`; }));
						var expenses = ["Expense"].concat(_.map(months, (r: Business.IMonthBalance) => { return Math.round(r.expense); }));
						var incomes = ["Income"].concat(_.map(months, (r: Business.IMonthBalance) => { return Math.round(r.income); }));
						var monthBalances = ["Month balance"].concat(_.map(months, (r: Business.IMonthBalance) => { return Math.round(r.monthBalance); }));
						var totalBalances = ["Total balance"].concat(_.map(months, (r: Business.IMonthBalance) => { return Math.round(r.totalBalance); }));

						var tb = new Views.TableBuilder();
						tb.addThRow(dates);
						tb.addFirstThRestTrRow(expenses);
						tb.addFirstThRestTrRow(incomes);
						tb.addFirstThRestTrRow(monthBalances);
						tb.addFirstThRestTrRow(totalBalances);

						var md = new Views.ModDialog(tb.$table);
						md.setTitle("Balance");
				}

				public showUserGrowth() {
						var ug = new Business.UsersGrowth();
						var reports = ug.defaultCalculation(84, 5, 2017);

						var dates = ["Month-Year"].concat(_.map(reports, (r: Business.IUsersMonthyState) => { return `${r.monthNo}-${r.yearNo}`; }));
						var visitors = ["Monthly new visitors"].concat(_.map(reports, (r: Business.IUsersMonthyState) => { return r.newVisitors; }));
						var newUsers = ["Monthly new users"].concat(_.map(reports, (r: Business.IUsersMonthyState) => { return Math.round(r.newUsers); }));
						var newBalance = ["Total users"].concat(_.map(reports, (r: Business.IUsersMonthyState) => { return Math.round(r.totalUsers); }));
						var profit = ["Profit"].concat(_.map(reports, (r: Business.IUsersMonthyState) => { return `€${Math.round(r.profit)}`; }));

						var tb = new Views.TableBuilder();
						tb.addThRow(dates);
						tb.addFirstThRestTrRow(visitors);
						tb.addFirstThRestTrRow(newUsers);
						tb.addFirstThRestTrRow(newBalance);
						tb.addFirstThRestTrRow(profit);

						var md = new Views.ModDialog(tb.$table);
						md.setTitle("User growth");
				}



				private getMaxLineNo() {
						var maxRows = _.max(_.map(Business.Consts.data, (i) => { return i.lineNo; }));
						return maxRows;
				}

				private drawBudgets() {
						//var lastLineNo = this.getMaxLineNo();

						Business.Consts.budgets.forEach((b) => {

								var top = 100;//this.getTop(lastLineNo + 2);
								var left = this.getLeft(b.startYear, b.startMonth);
								var width = this.getWidth(b.startMonth, b.startYear, b.endMonth, b.endYear);

								var cost = this.getBudgetCost(b);

								this.drawBudget(b.color, b.title, cost, top, left, width);
						});

				}

				private getBudgetCost(b) {
						var monthlyCosts = this.balanceCalculator.calculateMonthlyExpenses(b.startMonth, b.startYear, b.endMonth, b.endYear);

						var totalCosts = monthlyCosts;
						return totalCosts;
				}


				public draw() {

						this.$cont.find(".item").remove();

						Business.Consts.data.forEach((item) => {
								var top = this.getTop(item.lineNo) + (this.lineHeight * 3);

								var left = this.getLeft(item.yearStart, item.monthStart);

								var width = 0;
								if (item.daysDuration) {
										width = this.pxPerDay * (item.daysDuration * Business.Consts.daysPerMonthIndex);
								}

								if (item.monthsDraw) {

										var start = this.parseDate(item.yearStart, item.monthStart);
										var end = start.clone().add(item.monthsDraw, "months");

										width = this.getWidth(item.monthStart, item.yearStart, end.month() + 1, end.year());
								}

								var color = this.getColor(item.lineNo);

								
								this.drawItem(color, item.title, top, left, width);
						});

				}

				public drawTitles() {

						this.$cont.find(".items-title").remove();

						Business.Consts.titles.forEach((item) => {
								var top = this.getTop(item.lineNo) + (this.lineHeight * 3);

								var left = 50;

								this.drawTitle(item.title, top, left);
						});

				}

				private drawTimes() {
						
						var months = this.balanceCalculator.calculate();
						var investmentBackMonth = _.find(months, (m) => { return m.totalBalance > 0; });
						var totalMonths = 3 + this.parseDate(investmentBackMonth.yearNo, investmentBackMonth.monthNo).diff(this.startEnd.start, "months");

						var actDate = this.startEnd.start.clone();

						for (var actMonth = 0; actMonth <= totalMonths - 1; actMonth++) {

								var month = actDate.month() + 1;

								var daysDiff = actDate.diff(this.startEnd.start, "days");

								var left = daysDiff * this.pxPerDay;

								this.drawTime(left, month, actDate.year());

								actDate.add(1, "months");
						}
				}

				private getTop(lineNo) {
						var top = (lineNo + 1) * (this.lineHeight + this.gap) + this.gap;
						return top;
				}

				private getWidth(monthStart, yearStart, monthEnd, yearEnd) {

						var start = this.parseDate(yearStart, monthStart);
						var end = this.parseDate(yearEnd, monthEnd);

						var days = end.diff(start, "days");

						var width = this.pxPerDay * days;
						return width;
				}

				private getLeft(yearStart, monthStart) {
						var itemStart = this.parseDate(yearStart, monthStart);

						//fnc for decimal days
						var decMonth = monthStart - Math.floor(monthStart);
						if (decMonth > 0) {
								var days = decMonth * 30;
								itemStart.add(days, "days");
						}

						var daysFromStart = itemStart.diff(this.startEnd.start, "days");
						var left = daysFromStart * this.pxPerDay;

						return left;
				}

				private getColor(index) {
						if (index > this.colors.length) {
							index = index - this.colors.length;
						}
						
						return this.colors[index];
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
						this.$times.append($t);
				}

				private drawItem(color, txt, top, left, width, cost = "") {
						var $i = $(`<div class="item" style="background-color: ${color}; top: ${top}px; left: ${left}px; width: ${width}px; height: ${this.lineHeight}px;">
														<div class="txt">${txt}</div>
														<div class="cost">${cost}</div>
												</div>`);
						this.$cont.append($i);
				}

				private drawTitle(title, top, left) {
						var $i = $(`<span class="items-title" style="top: ${top}px; left: ${left}px;">${title}</span>`);
						this.$cont.append($i);
				}

				private drawBudget(color, title, cost, top, left, width) {
						var $i = $(`<div class="budget-item" style="background-color: ${color}; top: ${top}px; left: ${left}px; width: ${
								width}px;">
														<div class="title">${title}</div>
														<div class="cost"><span>${cost}</span><span>€</span></div>
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

						Business.Consts.data.forEach((item) => {

								var o = this.parseDate(item.yearStart, item.monthStart);
								var from = moment(o);

								var to = from.clone();

								if (item.daysDuration) {
										var daysToAdd = item.daysDuration * Business.Consts.daysPerMonthIndex;
										to.add(daysToAdd, "days");
								}

								if (item.monthsDraw) {
										to.add(item.monthsDraw, "months");
								}


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

						end.add(1, "months");

						return { start: start, end: end };
				}


		}
}