var Business;
(function (Business) {
    (function (MonthlyExpenseType) {
        MonthlyExpenseType[MonthlyExpenseType["Employee"] = 0] = "Employee";
        MonthlyExpenseType[MonthlyExpenseType["Other"] = 1] = "Other";
        MonthlyExpenseType[MonthlyExpenseType["Marketing"] = 2] = "Marketing";
    })(Business.MonthlyExpenseType || (Business.MonthlyExpenseType = {}));
    var MonthlyExpenseType = Business.MonthlyExpenseType;
    var Consts = (function () {
        function Consts() {
        }
        Object.defineProperty(Consts, "daysPerMonthIndex", {
            get: function () { return 30 / Consts.daysPerMonth; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Consts, "userBaseProfit", {
            get: function () { return (this.userSellCases * this.averageSellVolume) * this.commision; },
            enumerable: true,
            configurable: true
        });
        ;
        Consts.daysPerMonth = 20;
        Consts.conversionRateIndex = 0.033;
        Consts.userSocialConversionRate = 0.08;
        Consts.userSellCases = 0.06;
        Consts.commision = 0.05;
        Consts.averageSellVolume = 130;
        Consts.oneVisitorCost = 0.5;
        Consts.oneVisitorIncome = 0.1;
        Consts.investorShare = 0.3;
        Consts.monthsIncomeOffset = 12;
        Consts.editableValues = [
            { id: "daysPerMonth", caption: "Worked days (year average) / month" },
            { id: "conversionRateIndex", caption: "Conversion rate of the new visitors" },
            { id: "userSocialConversionRate", caption: "User base social growth rate / month" },
            { id: "oneVisitorCost", caption: "How many costs one unique vistor" },
            { id: "userSellCases", caption: "How many times user buy something / month" },
            { id: "commision", caption: "Commision from sold stuff" },
            { id: "averageSellVolume", caption: "Average € value of one sell case" },
            { id: "monthsIncomeOffset", caption: "Project customer ready months offset" },
            { id: "investorShare", caption: "Share of the 1. investor" },
            { id: "userBaseProfit", caption: "Profit from one user / month", disabled: true },
        ];
        Consts.customMilestones = [
            { monthNo: 1, yearNo: 2018, text: "First public Android client release" },
            { monthNo: 4, yearNo: 2018, text: "First public iOS client release" },
            { monthNo: 7, yearNo: 2018, text: "Start of Travel Buddy" }
        ];
        Consts.titles = [
            { lineNo: 0, title: "CEO/CTO/DEV1" },
            { lineNo: 4, title: "DEV2" },
            { lineNo: 7, title: "Marketing" },
            { lineNo: 11, title: "Everyting man + his content team" },
            { lineNo: 14, title: "General direction" }
        ];
        Consts.data = [
            { lineNo: 1, title: "Finishing current hourly estimated backlog / feedbacks / UX", monthStart: 5, yearStart: 2017, daysDuration: 120 },
            { lineNo: 1, title: "Deals universal market place - WEB", monthStart: 11, yearStart: 2017, daysDuration: 80 },
            { lineNo: 2, title: "Hiring", monthStart: 5, yearStart: 2017, monthsDraw: 3 },
            { lineNo: 2, title: "Working on feedbacks - web", monthStart: 9, yearStart: 2018, daysDuration: 40 },
            { lineNo: 3, title: "Research of affiliate possibilities (fly tickets / holiday packages)", monthStart: 6, yearStart: 2017, daysDuration: 140 },
            { lineNo: 5, title: "Mobile framework base + xamarin warm-up", monthStart: 8, yearStart: 2017, daysDuration: 40 },
            { lineNo: 5, title: "Android client base without Deals", monthStart: 10, yearStart: 2017, daysDuration: 60 },
            { lineNo: 5, title: "iOS client base without Deals", monthStart: 1, yearStart: 2018, daysDuration: 60 },
            { lineNo: 5, title: "Mobile client testing/finishing", monthStart: 4, yearStart: 2018, daysDuration: 60 },
            { lineNo: 5, title: "Android client - Deals", monthStart: 11, yearStart: 2018, daysDuration: 60 },
            { lineNo: 5, title: "iOS client - Deals", monthStart: 2, yearStart: 2019, daysDuration: 60 },
            { lineNo: 8, id: "MarketingTest", title: "Setting/Testing/Evaluating marketing strategy", monthStart: 6, yearStart: 2017, monthsDraw: 7 },
            { lineNo: 8, id: "Marketing1", title: "I. Paid marketing testing,PR articles,backlinks,...", monthStart: 1, yearStart: 2018, monthsDraw: 16 },
            { lineNo: 8, id: "Marketing2", title: "II. Paid marketing testing,PR articles,backlinks,...", monthStart: 5, yearStart: 2019, monthsDraw: 12 },
            { lineNo: 8, id: "Marketing3", title: "III. Paid marketing testing,PR articles,backlinks,...", monthStart: 5, yearStart: 2020, monthsDraw: 12 },
            { lineNo: 8, id: "Marketing4", title: "IV. Paid marketing testing,PR articles,backlinks,...", monthStart: 5, yearStart: 2021, monthsDraw: 12 },
            { lineNo: 8, id: "Marketing5", title: "V. Paid marketing testing,PR articles,backlinks,...", monthStart: 5, yearStart: 2022, monthsDraw: 12 },
            { lineNo: 8, id: "Marketing6", title: "VI. Paid marketing testing,PR articles,backlinks,...", monthStart: 5, yearStart: 2023, monthsDraw: 12 },
            { lineNo: 9, title: "M.I.S. planning", monthStart: 6, yearStart: 2018, monthsDraw: 1 },
            { lineNo: 9, id: "MIT1", title: "Marketing in the streets", monthStart: 7, yearStart: 2018, monthsDraw: 2 },
            { lineNo: 9, title: "M.I.S. planning", monthStart: 5, yearStart: 2019, monthsDraw: 1 },
            { lineNo: 9, id: "MIT2", title: "Marketing in the streets", monthStart: 6, yearStart: 2019, monthsDraw: 3 },
            { lineNo: 9, title: "M.I.S. planning", monthStart: 5, yearStart: 2020, monthsDraw: 1 },
            { lineNo: 9, id: "MIT3", title: "Marketing in the streets", monthStart: 6, yearStart: 2020, monthsDraw: 3 },
            { lineNo: 9, title: "M.I.S. planning", monthStart: 5, yearStart: 2021, monthsDraw: 1 },
            { lineNo: 9, id: "MIT4", title: "Marketing in the streets", monthStart: 6, yearStart: 2021, monthsDraw: 3 },
            { lineNo: 9, title: "M.I.S. planning", monthStart: 5, yearStart: 2022, monthsDraw: 1 },
            { lineNo: 9, id: "MIT5", title: "Marketing in the streets", monthStart: 6, yearStart: 2022, monthsDraw: 3 },
            { lineNo: 9, title: "M.I.S. planning", monthStart: 5, yearStart: 2023, monthsDraw: 1 },
            { lineNo: 9, id: "MIT6", title: "Marketing in the streets", monthStart: 6, yearStart: 2023, monthsDraw: 3 },
            { lineNo: 12, title: "Filling the wiki - Phase 1", monthStart: 6, yearStart: 2017, monthsDraw: 13 },
            { lineNo: 12, title: "Filling the wiki - Phase 2", monthStart: 9, yearStart: 2018, monthsDraw: 20 },
            { lineNo: 15, title: "I. phase of development", monthStart: 5, yearStart: 2017, monthsDraw: 11 },
            { lineNo: 15, title: "Debugging, Ideas, Feedbacks", monthStart: 4, yearStart: 2018, monthsDraw: 3 },
            { lineNo: 15, title: "-Searching for II. level investor<br>-Supporting and hotfixing", monthStart: 7, yearStart: 2018, monthsDraw: 4 },
            { lineNo: 15, title: "II. phase of development. Work on feedbacks, new ideas and performance", monthStart: 11, yearStart: 2018, monthsDraw: 12 },
        ];
        Consts.budgets = [
            { title: "I. budget, I. payment", startMonth: 5, startYear: 2017, endMonth: 7, endYear: 2018, color: "#005476" },
            { title: "I. budget, II. payment", startMonth: 7, startYear: 2018, endMonth: 11, endYear: 2018, color: "#005476" },
            { title: "II. budget", startMonth: 11, startYear: 2018, endMonth: 11, endYear: 2019, color: "#3298C1" },
            { title: "III. budget", startMonth: 11, startYear: 2019, endMonth: 11, endYear: 2021, color: "#005476" },
        ];
        Consts.monthlyExpense = [
            { caption: "CEO/CTO/DEV1", type: MonthlyExpenseType.Employee, startMonth: 5, startYear: 2017, dailyCost: 130 },
            { caption: "DEV2", type: MonthlyExpenseType.Employee, startMonth: 8, startYear: 2017, dailyCost: 200 },
            { caption: "DEV3", type: MonthlyExpenseType.Employee, startMonth: 2, startYear: 2020, dailyCost: 300 },
            { caption: "DEV4", type: MonthlyExpenseType.Employee, startMonth: 8, startYear: 2020, dailyCost: 300 },
            { caption: "Everything man", type: MonthlyExpenseType.Employee, startMonth: 5, startYear: 2017, dailyCost: 55 },
            { caption: "WIKI admins / propagators (15h)", type: MonthlyExpenseType.Employee, count: 5, startMonth: 6, startYear: 2017, monthlyCost: 120 },
            { caption: "Accountant", type: MonthlyExpenseType.Employee, startMonth: 5, startYear: 2017, monthlyCost: 200 },
            { caption: "German translator (50h)", type: MonthlyExpenseType.Employee, startMonth: 5, startYear: 2017, monthlyCost: 500 },
            { caption: "Spanish translator (50h)", type: MonthlyExpenseType.Employee, startMonth: 5, startYear: 2017, monthlyCost: 150 },
            { caption: "Designer (12h)", type: MonthlyExpenseType.Employee, startMonth: 5, startYear: 2017, monthlyCost: 600 },
            { caption: "Office", type: MonthlyExpenseType.Other, startMonth: 10, startYear: 2017, monthlyCost: 500 },
            { caption: "Hosting", type: MonthlyExpenseType.Other, startMonth: 1, startYear: 2018, monthlyCost: 200 },
            { caption: "Setting/Testing/Evaluating marketing strategy", type: MonthlyExpenseType.Marketing, itemId: "MarketingTest", monthlyCost: 250 },
            { caption: "Classic web marketing", type: MonthlyExpenseType.Marketing, itemId: "Marketing1", monthlyCost: 500 },
            { caption: "Classic web marketing", type: MonthlyExpenseType.Marketing, itemId: "Marketing2", monthlyCost: 1000 },
            { caption: "Classic web marketing", type: MonthlyExpenseType.Marketing, itemId: "Marketing3", monthlyCost: 1500 },
            { caption: "Classic web marketing", type: MonthlyExpenseType.Marketing, itemId: "Marketing4", monthlyCost: 2000 },
            { caption: "Classic web marketing", type: MonthlyExpenseType.Marketing, itemId: "Marketing5", monthlyCost: 2500 },
            { caption: "Classic web marketing", type: MonthlyExpenseType.Marketing, itemId: "Marketing6", monthlyCost: 2500 },
            { caption: "Marketing in the streets", type: MonthlyExpenseType.Marketing, itemId: "MIT1", monthlyCost: 4000 },
            { caption: "Marketing in the streets", type: MonthlyExpenseType.Marketing, itemId: "MIT2", monthlyCost: 8000 },
            { caption: "Marketing in the streets", type: MonthlyExpenseType.Marketing, itemId: "MIT3", monthlyCost: 8000 },
            { caption: "Marketing in the streets", type: MonthlyExpenseType.Marketing, itemId: "MIT4", monthlyCost: 10000 },
            { caption: "Marketing in the streets", type: MonthlyExpenseType.Marketing, itemId: "MIT5", monthlyCost: 12000 },
            { caption: "Marketing in the streets", type: MonthlyExpenseType.Marketing, itemId: "MIT6", monthlyCost: 15000 },
            { caption: "Other", type: MonthlyExpenseType.Other, startMonth: 5, startYear: 2017, monthlyCost: 300 },
        ];
        Consts.oneTimeExpense = [
            { caption: "Laptop for DEV1", month: 5, year: 2017, cost: 2500 },
            { caption: "Viral video", month: 6, year: 2018, cost: 4000 },
            { caption: "Estabilish company", month: 12, year: 2018, cost: 1000 },
            { caption: "Apple testing stuff", month: 4, year: 2018, cost: 1500 },
        ];
        return Consts;
    }());
    Business.Consts = Consts;
})(Business || (Business = {}));
//# sourceMappingURL=Consts.js.map