var Business;
(function (Business) {
    var UsersGrowth = (function () {
        function UsersGrowth() {
            this.months = [];
        }
        UsersGrowth.prototype.defaultCalculation = function (monthsCnt, startMonth, startYear) {
            var mbc = new Business.MonthBalanceCalculator(Business.Consts.data);
            var montsSettings = [];
            var currentYear = startYear;
            var currentMonth = startMonth;
            var marketingItems = _.filter(Business.Consts.monthlyExpense, { type: Business.MonthlyExpenseType.Marketing });
            for (var act = 1; act <= monthsCnt; act++) {
                var actDate = this.parseDate(currentYear, currentMonth);
                var totalMonthMarketingCost = 0;
                marketingItems.forEach(function (mc) {
                    var itemCost = mbc.expenseCostForAMonth(mc, actDate);
                    totalMonthMarketingCost += itemCost;
                });
                var efficiencyIndex = 0;
                var passedOffset = act > Business.Consts.monthsIncomeOffset;
                if (passedOffset) {
                    efficiencyIndex = (1 / Business.Consts.oneVisitorCost);
                }
                var items = [
                    {
                        name: "Generic rate - for now",
                        cost: totalMonthMarketingCost,
                        efficiencyIndex: efficiencyIndex
                    }
                ];
                var s = {
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
        };
        UsersGrowth.prototype.parseDate = function (y, m) {
            var o = { y: y, M: m - 1, d: 1 };
            var d = moment(o);
            return d;
        };
        UsersGrowth.prototype.calculateMonths = function (months) {
            var _this = this;
            var reports = [];
            var prevMonthTotalUsers = 0;
            months.forEach(function (month) {
                var newMonthVisitors = _this.getNewUsersFromMonthConfiguration(month.items);
                var newMonthUsers = newMonthVisitors * Business.Consts.conversionRateIndex;
                var newTotalMonthUsers = newMonthUsers + prevMonthTotalUsers;
                var totalUsersAfterSocialConversion = newTotalMonthUsers + (newTotalMonthUsers * Business.Consts.userSocialConversionRate);
                var profit = totalUsersAfterSocialConversion * Business.Consts.userBaseProfit;
                var report = {
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
        };
        UsersGrowth.prototype.getNewUsersFromMonthConfiguration = function (items) {
            var newMonthVisitors = 0;
            items.forEach(function (i) {
                var newItemVisitors = i.cost * i.efficiencyIndex;
                newMonthVisitors += newItemVisitors;
            });
            return newMonthVisitors;
        };
        return UsersGrowth;
    }());
    Business.UsersGrowth = UsersGrowth;
})(Business || (Business = {}));
//# sourceMappingURL=UsersGrowth.js.map