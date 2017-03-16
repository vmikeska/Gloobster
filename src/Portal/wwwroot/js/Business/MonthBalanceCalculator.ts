module Business {
		export interface IMonthBalance {
				yearNo: number;
				monthNo: number;
				income: number;
				expense: number;
				monthBalance: number;
				totalBalance: number;
		}


		export interface IExpenseOneTime {
				caption: string;
				month: number;
				year: number;
				cost: number;
		}

		export interface IMonthlyExpense {
				caption: string;

				type: MonthlyExpenseType;

				itemId?: string;

				startMonth?: number;
				startYear?: number;

				endMonth?: number;
				endYear?: number;

				count?: number;

				dailyCost?: number;
				monthlyCost?: number;
		}

		export class MonthBalanceCalculator {

				private userGrowth: UsersGrowth;

				private items: IItem[];

				constructor(items: IItem[]) {
						this.userGrowth = new UsersGrowth();
						this.items = items;
				}

				public calculate() {
						var months = [];

						var monthsToCalculate = 84;

						var usersResults = this.userGrowth.defaultCalculation(monthsToCalculate, 5, 2017);

						var actMonth = 5;
						var actYear = 2017;

						var lastMonthBalance = 0;

						for (var act = 1; act <= monthsToCalculate; act++) {
								
								var userResult = _.find(usersResults, { yearNo: actYear, monthNo: actMonth });
								var totalIncome = userResult.profit;

								var monthlyExpenses = this.getMonthExpenses(actMonth, actYear);
								var monthlyExpensesOnce = this.getMonthExpenseOneTime(actMonth, actYear);
							  var monthlyExpensesTotal = monthlyExpenses + monthlyExpensesOnce;

								var thisMonthBalance = totalIncome - monthlyExpensesTotal;

								var totalBalance = lastMonthBalance + thisMonthBalance;

								var month: IMonthBalance = {
										monthNo: actMonth,
										yearNo: actYear,
										income: totalIncome,
										expense: monthlyExpensesTotal,
										monthBalance: thisMonthBalance,
										totalBalance: totalBalance
								};
								months.push(month);

								lastMonthBalance = totalBalance;

								actMonth++;
								if (actMonth === 13) {
										actMonth = 1;
										actYear++;
								}
						}

						return months;
				}

				private getMonthExpenses(month, year) {
						var ex = this.calculateMonthlyExpenses(month, year, month, year);
						return ex;
				}

				private getMonthExpenseOneTime(month, year) {
						var costs = 0;

						Consts.oneTimeExpense.forEach((o: IExpenseOneTime) => {
								if (o.month === month && o.year === year) {
										costs += o.cost;
								}
						});

						return costs;
				}

				public getExpenseStartEnd(ex: Business.IMonthlyExpense) {
						var exStart;
						var exEnd = null;

						if (ex.itemId) {

								var item = this.getItemById(ex.itemId);
								exStart = this.parseDate(item.yearStart, item.monthStart);
								exEnd = exStart.clone().add(item.monthsDraw, "months");

						} else {
								exStart = this.parseDate(ex.startYear, ex.startMonth);

								if (ex.endYear) {
										exEnd = this.parseDate(ex.endYear, ex.endMonth);
								}

						}

						return { start: exStart, end: exEnd };
				}

				public calculateMonthlyExpenses(startMonth, startYear, endMonth, endYear) {

						var start = this.parseDate(startYear, startMonth);
						var end = this.parseDate(endYear, endMonth);

						var months = end.diff(start, "months");

						var actDate = start.clone();

						var cost = 0;

						for (var act = 0; act <= months; act++) {

								var onetimeCosts = this.getMonthExpenseOneTime(actDate.month() + 1, actDate.year());
							  cost += onetimeCosts;

								Consts.monthlyExpense.forEach((ex: IMonthlyExpense) => {

									  var c = this.expenseCostForAMonth(ex, actDate);
										cost += c;
		
								});

								actDate.add(1, "months");
						}

						return cost;
				}

				public expenseCostForAMonth(ex: IMonthlyExpense, actDate) {
						var exStartEnd = this.getExpenseStartEnd(ex);
						var exStart = exStartEnd.start;
						var exEnd = exStartEnd.end;

						var started = exStart.isSameOrBefore(actDate);
						var notEnded = false;

						if (!exEnd) {
								notEnded = true;
						} else {
								if (exEnd.isSameOrAfter(actDate)) {
										notEnded = true;
								}
						}

					if (started && notEnded) {
							
						var c = 0;

						if (ex.dailyCost) {
							var monthCost = ex.dailyCost * Consts.daysPerMonth;
							c = monthCost;
						}

						if (ex.monthlyCost) {
							c = ex.monthlyCost;
						}

						if (ex.count) {
							c = c * ex.count;
						}

						return c;
						}

					return 0;
				}

				public getExpenseDurationInPeriod(ex: IMonthlyExpense, endMonth, endYear) {
						var startEnd = this.getExpenseStartEnd(ex);

						var end = startEnd.end ? startEnd.end : this.parseDate(endYear, endMonth);

						var months = end.diff(startEnd.start, "months");
						return months;
				}

				private getItemById(id): IItem {
						var item = _.find(this.items, { id: id });
						return item;
				}

				private parseDate(y, m) {
						var o = { y: y, M: m - 1, d: 1 };
						var d = moment(o);
						return d;
				}


		}
}