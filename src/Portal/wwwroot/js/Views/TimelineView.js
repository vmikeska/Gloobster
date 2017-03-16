var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var ValueEditBuilder = (function () {
        function ValueEditBuilder() {
        }
        ValueEditBuilder.prototype.generate = function () {
            var $table = $("<table class=\"values-edit-table\"></table>");
            var dlg = new ModDialog($table);
            var lg = Common.ListGenerator.init($table, "value-edit-template");
            lg.customMapping = function (item) {
                item.value = Business.Consts[item.id];
                return item;
            };
            lg.evnt("input", function (e, $item, $target, item) {
                var val = $item.find("input").val();
                try {
                    Business.Consts[item.id] = Number(val);
                    TimelineView.instance.refresh();
                    Business.Consts.editableValues.forEach(function (ev) {
                        if (ev.disabled) {
                            $("#value_" + ev.id).val(Business.Consts[ev.id]);
                        }
                    });
                }
                catch (exc) {
                }
            }).setEvent("input");
            lg.generateList(Business.Consts.editableValues);
        };
        return ValueEditBuilder;
    }());
    Views.ValueEditBuilder = ValueEditBuilder;
    var TableBuilder = (function () {
        function TableBuilder(cls) {
            if (cls === void 0) { cls = ""; }
            this.$table = $("<table cellspacing=\"0\" cellpadding=\"0\" class=" + cls + "></table>");
        }
        TableBuilder.prototype.addThRow = function (items) {
            var $tr = $("<tr></tr>");
            items.forEach(function (i) {
                var $th = $("<th>" + i + "</th>");
                $tr.append($th);
            });
            this.$table.append($tr);
        };
        TableBuilder.prototype.addTdRow = function (items) {
            var $tr = $("<tr></tr>");
            items.forEach(function (i) {
                var $th = $("<td>" + i + "</td>");
                $tr.append($th);
            });
            this.$table.append($tr);
        };
        TableBuilder.prototype.addFirstThRestTrRow = function (items) {
            var $tr = $("<tr></tr>");
            var isFirst = true;
            items.forEach(function (i) {
                if (isFirst) {
                    var $th = $("<th>" + i + "</th>");
                    $tr.append($th);
                }
                else {
                    var $td = $("<td>" + i + "</td>");
                    $tr.append($td);
                }
                isFirst = false;
            });
            this.$table.append($tr);
        };
        return TableBuilder;
    }());
    Views.TableBuilder = TableBuilder;
    var ModDialog = (function () {
        function ModDialog($html) {
            var _this = this;
            if ($html === void 0) { $html = ""; }
            this.$dlg = $(".modal-dlg");
            this.$cont = this.$dlg.find(".cont");
            this.$cont.html($html);
            this.$dlg.removeClass("hidden");
            this.$dlg.find(".close")
                .click(function (e) {
                _this.$dlg.addClass("hidden");
                _this.$cont.empty();
            });
        }
        ModDialog.prototype.setTitle = function (title) {
            this.$dlg.find(".title").html(title);
        };
        return ModDialog;
    }());
    Views.ModDialog = ModDialog;
    var TimelineView = (function (_super) {
        __extends(TimelineView, _super);
        function TimelineView() {
            _super.call(this);
            this.lineHeight = 50;
            this.gap = 6;
            this.pxPerDay = 2;
            this.$cont = $(".main-frame");
            this.$times = $(".times");
            this.colors = [
                "#CEA8F4", "#BCB4F3", "#A9C5EB", "#8CD1E6", "#AAAAFF", "#A8CFFF", "#99E0FF", "#93EEAA", "#A6CAA9", "#AAFD8E",
                "#FFBBFF", "#EEBBEE", "#FFBBBB", "#FFBBDD"
            ];
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
            $cbm.change(function (e) {
                $(".milestone").toggleClass("hidden", !$cbm.prop("checked"));
            });
            var lastLineNo = this.getMaxLineNo();
            $(".master-cont").css("height", ((lastLineNo + 7) * (this.lineHeight + this.gap) + "px"));
        }
        TimelineView.prototype.refresh = function () {
            this.draw();
            this.drawTitles();
            this.drawMilestones();
        };
        TimelineView.prototype.regMenu = function () {
            var _this = this;
            $("#btnMonthlyBalance").click(function (e) {
                e.preventDefault();
                _this.showBalance();
            });
            $("#btnUserGrowth").click(function (e) {
                e.preventDefault();
                _this.showUserGrowth();
            });
            $("#btnExpense").click(function (e) {
                e.preventDefault();
                _this.showExpenses();
            });
            $("#btnValues").click(function (e) {
                e.preventDefault();
                var vals = new ValueEditBuilder();
                vals.generate();
            });
        };
        TimelineView.prototype.drawMilestones = function () {
            var _this = this;
            this.$cont.find(".milestone").remove();
            var months = this.balanceCalculator.calculate();
            Business.Consts.customMilestones.forEach(function (m) {
                _this.createMilestone(m.monthNo, m.yearNo, m.text);
            });
            var dev3 = _.find(Business.Consts.monthlyExpense, { caption: "DEV3" });
            this.createMilestone(dev3.startMonth, dev3.startYear, "DEV3 hired");
            var dev4 = _.find(Business.Consts.monthlyExpense, { caption: "DEV4" });
            this.createMilestone(dev4.startMonth, dev4.startYear, "DEV4 hired");
            var breakEvenMonth = _.find(months, function (m) { return m.monthBalance > 0; });
            this.createMilestone(breakEvenMonth.monthNo, breakEvenMonth.yearNo, "Break even");
        };
        TimelineView.prototype.createMilestone = function (month, year, text) {
            var lastLineNo = this.getMaxLineNo();
            var height = (lastLineNo + 6) * (this.lineHeight + this.gap);
            var top = this.lineHeight;
            var left = this.getLeft(year, month);
            var $m = $("<div class=\"milestone\" style=\"top: " + top + "px;height: " + height + "px; left: " + left + "px;\"><div class=\"txt\">" + text + "</div></div>");
            this.$cont.append($m);
        };
        TimelineView.prototype.showExpenses = function () {
            var _this = this;
            var expenses = Business.Consts.monthlyExpense;
            var onetime = Business.Consts.oneTimeExpense;
            var $tables = $("<div><h3>Monthly expenses</h3><div class=\"cont1\"></div><h3>One time expenses</h3><div class=\"cont2\"></div></div>");
            var tb = new Views.TableBuilder("oddEven");
            tb.addThRow(["Caption", "Type", "Start - End", "Months duration in I. budget", "Monthly cost", "Entire I. budget"]);
            var budget1YearEnd = Business.Consts.budgets[0].endYear;
            var budget1MonthEnd = Business.Consts.budgets[0].endMonth;
            expenses.forEach(function (ex) {
                var startEnd = _this.balanceCalculator.getExpenseStartEnd(ex);
                var endStr = startEnd.end ? (startEnd.end.month() + 1) + "/" + startEnd.end.year() : "∞";
                var duration = startEnd.end ? startEnd.end.diff(startEnd.start, "months") : _this.parseDate(budget1YearEnd, budget1MonthEnd).diff(startEnd.start, "months");
                var exDuration = _this.balanceCalculator.getExpenseDurationInPeriod(ex, budget1MonthEnd, budget1YearEnd);
                var monthlyCost = ex.monthlyCost ? ex.monthlyCost : ex.dailyCost * Business.Consts.daysPerMonth;
                var costInFirstBudget = monthlyCost * exDuration;
                var tds = [ex.caption, Business.MonthlyExpenseType[ex.type], (startEnd.start.month() + "/" + startEnd.start.year() + "-" + endStr), duration, ("\u20AC" + monthlyCost), ("\u20AC" + costInFirstBudget)];
                tb.addTdRow(tds);
            });
            $tables.find(".cont1").append(tb.$table);
            var tbo = new TableBuilder("oddEven");
            tbo.addThRow(["Caption", "Date", "Cost"]);
            onetime.forEach(function (o) {
                tbo.addTdRow([o.caption, (o.month + "/" + o.year), o.cost]);
            });
            $tables.find(".cont2").append(tbo.$table);
            var md = new Views.ModDialog($tables);
            md.setTitle("Expenses");
        };
        TimelineView.prototype.showBalance = function () {
            var months = this.balanceCalculator.calculate();
            var dates = ["Month-Year"].concat(_.map(months, function (r) { return r.monthNo + "-" + r.yearNo; }));
            var expenses = ["Expense"].concat(_.map(months, function (r) { return Math.round(r.expense); }));
            var incomes = ["Income"].concat(_.map(months, function (r) { return Math.round(r.income); }));
            var monthBalances = ["Month balance"].concat(_.map(months, function (r) { return Math.round(r.monthBalance); }));
            var totalBalances = ["Total balance"].concat(_.map(months, function (r) { return Math.round(r.totalBalance); }));
            var tb = new Views.TableBuilder();
            tb.addThRow(dates);
            tb.addFirstThRestTrRow(expenses);
            tb.addFirstThRestTrRow(incomes);
            tb.addFirstThRestTrRow(monthBalances);
            tb.addFirstThRestTrRow(totalBalances);
            var md = new Views.ModDialog(tb.$table);
            md.setTitle("Balance");
        };
        TimelineView.prototype.showUserGrowth = function () {
            var ug = new Business.UsersGrowth();
            var reports = ug.defaultCalculation(84, 5, 2017);
            var dates = ["Month-Year"].concat(_.map(reports, function (r) { return r.monthNo + "-" + r.yearNo; }));
            var visitors = ["Monthly new visitors"].concat(_.map(reports, function (r) { return r.newVisitors; }));
            var newUsers = ["Monthly new users"].concat(_.map(reports, function (r) { return Math.round(r.newUsers); }));
            var newBalance = ["Total users"].concat(_.map(reports, function (r) { return Math.round(r.totalUsers); }));
            var profit = ["Profit"].concat(_.map(reports, function (r) { return "\u20AC" + Math.round(r.profit); }));
            var tb = new Views.TableBuilder();
            tb.addThRow(dates);
            tb.addFirstThRestTrRow(visitors);
            tb.addFirstThRestTrRow(newUsers);
            tb.addFirstThRestTrRow(newBalance);
            tb.addFirstThRestTrRow(profit);
            var md = new Views.ModDialog(tb.$table);
            md.setTitle("User growth");
        };
        TimelineView.prototype.getMaxLineNo = function () {
            var maxRows = _.max(_.map(Business.Consts.data, function (i) { return i.lineNo; }));
            return maxRows;
        };
        TimelineView.prototype.drawBudgets = function () {
            var _this = this;
            Business.Consts.budgets.forEach(function (b) {
                var top = 100;
                var left = _this.getLeft(b.startYear, b.startMonth);
                var width = _this.getWidth(b.startMonth, b.startYear, b.endMonth, b.endYear);
                var cost = _this.getBudgetCost(b);
                _this.drawBudget(b.color, b.title, cost, top, left, width);
            });
        };
        TimelineView.prototype.getBudgetCost = function (b) {
            var monthlyCosts = this.balanceCalculator.calculateMonthlyExpenses(b.startMonth, b.startYear, b.endMonth, b.endYear);
            var totalCosts = monthlyCosts;
            return totalCosts;
        };
        TimelineView.prototype.draw = function () {
            var _this = this;
            this.$cont.find(".item").remove();
            Business.Consts.data.forEach(function (item) {
                var top = _this.getTop(item.lineNo) + (_this.lineHeight * 3);
                var left = _this.getLeft(item.yearStart, item.monthStart);
                var width = 0;
                if (item.daysDuration) {
                    width = _this.pxPerDay * (item.daysDuration * Business.Consts.daysPerMonthIndex);
                }
                if (item.monthsDraw) {
                    var start = _this.parseDate(item.yearStart, item.monthStart);
                    var end = start.clone().add(item.monthsDraw, "months");
                    width = _this.getWidth(item.monthStart, item.yearStart, end.month() + 1, end.year());
                }
                var color = _this.getColor(item.lineNo);
                _this.drawItem(color, item.title, top, left, width);
            });
        };
        TimelineView.prototype.drawTitles = function () {
            var _this = this;
            this.$cont.find(".items-title").remove();
            Business.Consts.titles.forEach(function (item) {
                var top = _this.getTop(item.lineNo) + (_this.lineHeight * 3);
                var left = 50;
                _this.drawTitle(item.title, top, left);
            });
        };
        TimelineView.prototype.drawTimes = function () {
            var months = this.balanceCalculator.calculate();
            var investmentBackMonth = _.find(months, function (m) { return m.totalBalance > 0; });
            var totalMonths = 3 + this.parseDate(investmentBackMonth.yearNo, investmentBackMonth.monthNo).diff(this.startEnd.start, "months");
            var actDate = this.startEnd.start.clone();
            for (var actMonth = 0; actMonth <= totalMonths - 1; actMonth++) {
                var month = actDate.month() + 1;
                var daysDiff = actDate.diff(this.startEnd.start, "days");
                var left = daysDiff * this.pxPerDay;
                this.drawTime(left, month, actDate.year());
                actDate.add(1, "months");
            }
        };
        TimelineView.prototype.getTop = function (lineNo) {
            var top = (lineNo + 1) * (this.lineHeight + this.gap) + this.gap;
            return top;
        };
        TimelineView.prototype.getWidth = function (monthStart, yearStart, monthEnd, yearEnd) {
            var start = this.parseDate(yearStart, monthStart);
            var end = this.parseDate(yearEnd, monthEnd);
            var days = end.diff(start, "days");
            var width = this.pxPerDay * days;
            return width;
        };
        TimelineView.prototype.getLeft = function (yearStart, monthStart) {
            var itemStart = this.parseDate(yearStart, monthStart);
            var decMonth = monthStart - Math.floor(monthStart);
            if (decMonth > 0) {
                var days = decMonth * 30;
                itemStart.add(days, "days");
            }
            var daysFromStart = itemStart.diff(this.startEnd.start, "days");
            var left = daysFromStart * this.pxPerDay;
            return left;
        };
        TimelineView.prototype.getColor = function (index) {
            if (index > this.colors.length) {
                index = index - this.colors.length;
            }
            return this.colors[index];
        };
        TimelineView.prototype.getRandomColor = function () {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        TimelineView.prototype.drawTime = function (left, month, year) {
            var $t = $("<div class=\"time\" style=\"left: " + left + "px;\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"month\">" + month + "</div>\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"year\">" + year + "</div>\n\t\t\t\t\t\t\t\t\t\t</div>");
            this.$times.append($t);
        };
        TimelineView.prototype.drawItem = function (color, txt, top, left, width, cost) {
            if (cost === void 0) { cost = ""; }
            var $i = $("<div class=\"item\" style=\"background-color: " + color + "; top: " + top + "px; left: " + left + "px; width: " + width + "px; height: " + this.lineHeight + "px;\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"txt\">" + txt + "</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"cost\">" + cost + "</div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>");
            this.$cont.append($i);
        };
        TimelineView.prototype.drawTitle = function (title, top, left) {
            var $i = $("<span class=\"items-title\" style=\"top: " + top + "px; left: " + left + "px;\">" + title + "</span>");
            this.$cont.append($i);
        };
        TimelineView.prototype.drawBudget = function (color, title, cost, top, left, width) {
            var $i = $("<div class=\"budget-item\" style=\"background-color: " + color + "; top: " + top + "px; left: " + left + "px; width: " + width + "px;\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"title\">" + title + "</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"cost\"><span>" + cost + "</span><span>\u20AC</span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>");
            this.$cont.append($i);
        };
        TimelineView.prototype.parseDate = function (y, m) {
            var o = { y: y, M: m - 1, d: 1 };
            var d = moment(o);
            return d;
        };
        TimelineView.prototype.getStartEnd = function () {
            var _this = this;
            var start = null;
            var end = null;
            Business.Consts.data.forEach(function (item) {
                var o = _this.parseDate(item.yearStart, item.monthStart);
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
                }
                else if (start.isAfter(from)) {
                    start = from;
                }
                if (end === null) {
                    end = to;
                }
                else if (end.isBefore(to)) {
                    end = to;
                }
            });
            end.add(1, "months");
            return { start: start, end: end };
        };
        return TimelineView;
    }(Views.ViewBase));
    Views.TimelineView = TimelineView;
})(Views || (Views = {}));
//# sourceMappingURL=TimelineView.js.map