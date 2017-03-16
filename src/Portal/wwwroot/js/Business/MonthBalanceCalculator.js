var Business;
(function (Business) {
    var MonthBalanceCalculator = (function () {
        function MonthBalanceCalculator(items) {
            this.userGrowth = new Business.UsersGrowth();
            this.items = items;
        }
        MonthBalanceCalculator.prototype.calculate = function () {
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
                var month = {
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
        };
        MonthBalanceCalculator.prototype.getMonthExpenses = function (month, year) {
            var ex = this.calculateMonthlyExpenses(month, year, month, year);
            return ex;
        };
        MonthBalanceCalculator.prototype.getMonthExpenseOneTime = function (month, year) {
            var costs = 0;
            Business.Consts.oneTimeExpense.forEach(function (o) {
                if (o.month === month && o.year === year) {
                    costs += o.cost;
                }
            });
            return costs;
        };
        MonthBalanceCalculator.prototype.getExpenseStartEnd = function (ex) {
            var exStart;
            var exEnd = null;
            if (ex.itemId) {
                var item = this.getItemById(ex.itemId);
                exStart = this.parseDate(item.yearStart, item.monthStart);
                exEnd = exStart.clone().add(item.monthsDraw, "months");
            }
            else {
                exStart = this.parseDate(ex.startYear, ex.startMonth);
                if (ex.endYear) {
                    exEnd = this.parseDate(ex.endYear, ex.endMonth);
                }
            }
            return { start: exStart, end: exEnd };
        };
        MonthBalanceCalculator.prototype.calculateMonthlyExpenses = function (startMonth, startYear, endMonth, endYear) {
            var _this = this;
            var start = this.parseDate(startYear, startMonth);
            var end = this.parseDate(endYear, endMonth);
            var months = end.diff(start, "months");
            var actDate = start.clone();
            var cost = 0;
            for (var act = 0; act <= months; act++) {
                var onetimeCosts = this.getMonthExpenseOneTime(actDate.month() + 1, actDate.year());
                cost += onetimeCosts;
                Business.Consts.monthlyExpense.forEach(function (ex) {
                    var c = _this.expenseCostForAMonth(ex, actDate);
                    cost += c;
                });
                actDate.add(1, "months");
            }
            return cost;
        };
        MonthBalanceCalculator.prototype.expenseCostForAMonth = function (ex, actDate) {
            var exStartEnd = this.getExpenseStartEnd(ex);
            var exStart = exStartEnd.start;
            var exEnd = exStartEnd.end;
            var started = exStart.isSameOrBefore(actDate);
            var notEnded = false;
            if (!exEnd) {
                notEnded = true;
            }
            else {
                if (exEnd.isSameOrAfter(actDate)) {
                    notEnded = true;
                }
            }
            if (started && notEnded) {
                var c = 0;
                if (ex.dailyCost) {
                    var monthCost = ex.dailyCost * Business.Consts.daysPerMonth;
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
        };
        MonthBalanceCalculator.prototype.getExpenseDurationInPeriod = function (ex, endMonth, endYear) {
            var startEnd = this.getExpenseStartEnd(ex);
            var end = startEnd.end ? startEnd.end : this.parseDate(endYear, endMonth);
            var months = end.diff(startEnd.start, "months");
            return months;
        };
        MonthBalanceCalculator.prototype.getItemById = function (id) {
            var item = _.find(this.items, { id: id });
            return item;
        };
        MonthBalanceCalculator.prototype.parseDate = function (y, m) {
            var o = { y: y, M: m - 1, d: 1 };
            var d = moment(o);
            return d;
        };
        return MonthBalanceCalculator;
    }());
    Business.MonthBalanceCalculator = MonthBalanceCalculator;
})(Business || (Business = {}));
//# sourceMappingURL=MonthBalanceCalculator.js.map