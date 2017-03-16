module Business {

		export interface IMonthSetting {
				yearNo: number;
				monthNo: number;
				totalMonthNo: number;
				items: ISourceMonthly[];
		}

		export interface ISourceMonthly {
				name: string;
				cost: number;
				efficiencyIndex: number;
		}

		export interface IUsersMonthyState {
				yearNo: number;
				monthNo: number;
				totalUsers: number;
				newUsers: number;
				newVisitors: number;
				profit: number;
		}

		export class UsersGrowth {

				//http://www.designforfounders.com/average-conversion-rate/

				private months: IUsersMonthyState[] = [];

				public defaultCalculation(monthsCnt, startMonth, startYear) {

						var mbc = new MonthBalanceCalculator(Consts.data);

						var montsSettings: IMonthSetting[] = [];

						var currentYear = startYear;
						var currentMonth = startMonth;

						var marketingItems = _.filter(Consts.monthlyExpense, { type: MonthlyExpenseType.Marketing });


						for (var act = 1; act <= monthsCnt; act++) {

								var actDate = this.parseDate(currentYear, currentMonth);


								var totalMonthMarketingCost = 0;
								marketingItems.forEach((mc) => {
										var itemCost = mbc.expenseCostForAMonth(mc, actDate);
										totalMonthMarketingCost += itemCost;
								});


								var efficiencyIndex = 0;
								var passedOffset = act > Consts.monthsIncomeOffset;
								if (passedOffset) {
										efficiencyIndex = (1 / Consts.oneVisitorCost);
								}
								
								var items: ISourceMonthly[] = [
										{
												name: "Generic rate - for now",
												cost: totalMonthMarketingCost,
												efficiencyIndex: efficiencyIndex
										}
								];


								var s: IMonthSetting = {
										monthNo: currentMonth,
										yearNo: currentYear,
										items: items,
										totalMonthNo: act
								};

								montsSettings.push(s);

								currentMonth++;
								if (currentMonth === 13) {
										currentMonth = 1;
										currentYear++;
								}
						}

						var reports = this.calculateMonths(montsSettings);
						return reports;
				}

				private parseDate(y, m) {
						var o = { y: y, M: m - 1, d: 1 };
						var d = moment(o);
						return d;
				}



				public calculateMonths(months: IMonthSetting[]): IUsersMonthyState[] {

						var reports: IUsersMonthyState[] = [];
						var prevMonthTotalUsers = 0;

						months.forEach((month: IMonthSetting) => {

								var newMonthVisitors = this.getNewUsersFromMonthConfiguration(month.items);

								var newMonthUsers = newMonthVisitors * Consts.conversionRateIndex;

								var newTotalMonthUsers = newMonthUsers + prevMonthTotalUsers;

								var totalUsersAfterSocialConversion = newTotalMonthUsers + (newTotalMonthUsers * Consts.userSocialConversionRate);

								var profit = totalUsersAfterSocialConversion * Consts.userBaseProfit;

								var report: IUsersMonthyState = {
										yearNo: month.yearNo,
										monthNo: month.monthNo,

										newVisitors: newMonthVisitors,
										newUsers: newMonthUsers,
										totalUsers: totalUsersAfterSocialConversion,
										profit: profit
								};
								reports.push(report);

								prevMonthTotalUsers = totalUsersAfterSocialConversion;
						});

						return reports;
				}

				private getNewUsersFromMonthConfiguration(items: ISourceMonthly[]) {
						var newMonthVisitors = 0;

						items.forEach((i: ISourceMonthly) => {
								var newItemVisitors = i.cost * i.efficiencyIndex;
								newMonthVisitors += newItemVisitors;
						});

						return newMonthVisitors;
				}

		}
}