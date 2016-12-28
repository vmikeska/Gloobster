var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var MyCalendar = (function () {
        function MyCalendar($cont, id, date) {
            if (date === void 0) { date = null; }
            this.mondayWeekDays = ["mo", "tu", "we", "th", "fr", "sa", "su"];
            this.sundayWeekDays = ["su", "mo", "tu", "we", "th", "fr", "sa"];
            this.daysOrder = [];
            this.$cont = $cont;
            this.id = id;
            if (date) {
                this.date = date;
            }
            else {
                this.date = new Date();
            }
            var mondayFirst = true;
            if (mondayFirst) {
                this.daysOrder = this.mondayWeekDays;
            }
            else {
                this.daysOrder = this.sundayWeekDays;
            }
        }
        MyCalendar.prototype.gen = function () {
            this.createInput();
        };
        MyCalendar.prototype.onFocus = function () {
            this.genCal();
        };
        MyCalendar.prototype.createCalBase = function () {
            var calTmp = Views.ViewBase.currentView.registerTemplate("calendar-base-template");
            this.$calCont = $(calTmp());
            this.$cont.append(this.$calCont);
        };
        MyCalendar.prototype.genCal = function () {
            this.getCalEnd(this.date);
            this.createCalBase();
            var date = this.getCalStart(this.date);
            var sameMonth = true;
            var origMonthNo = date.month();
            while (sameMonth) {
                var $weekCont = $("<div class=\"week-row\"></div>");
                for (var act = 1; act <= 7; act++) {
                    var dayNo = date.date();
                    var $day = $("<div class=\"day\">" + dayNo + "</div>");
                    $weekCont.append($day);
                    date.add(1, "days");
                }
                if (date.month() !== origMonthNo) {
                    sameMonth = false;
                }
                this.$calCont.append($weekCont);
            }
        };
        MyCalendar.prototype.getCalStart = function (date) {
            var d = this.getFirstDayOfMonth(date);
            var ed = this.getWeekFirstDate(d);
            return ed;
        };
        MyCalendar.prototype.getCalEnd = function (date) {
            var me = moment(date);
            me.locale("cs");
            me.endOf("month");
            me.endOf("week");
            return me;
        };
        MyCalendar.prototype.getWeekFirstDate = function (date) {
            date.locale("en");
            var curDay = date.format("dd").toLowerCase();
            var dayNo = this.getArrayOrderNo(this.daysOrder, curDay);
            while (dayNo !== 0) {
                date.add(-1, "days");
                dayNo--;
            }
            return date;
        };
        MyCalendar.prototype.getFirstDayOfMonth = function (date) {
            var d = moment(date).startOf('month');
            return d;
        };
        MyCalendar.prototype.getArrayOrderNo = function (arr, val) {
            var found = null;
            for (var act = 0; act <= arr.length - 1; act++) {
                var v = arr[act];
                if (v === val) {
                    found = act;
                }
            }
            return found;
        };
        MyCalendar.prototype.createInput = function () {
            var _this = this;
            var isNative = false;
            if (isNative) {
                this.$cont.html("<input class=\"calendar-input\" type=\"date\" id=\"" + this.id + "\" />");
            }
            else {
                var $si = $("<input class=\"calendar-input\" type=\"text\" id=\"" + this.id + "\" />");
                this.$cont.html($si);
                var d = moment().format("L");
                $si.val(d);
                $si.focusin(function () {
                    _this.onFocus();
                });
            }
        };
        return MyCalendar;
    }());
    Views.MyCalendar = MyCalendar;
    var HomePageView = (function (_super) {
        __extends(HomePageView, _super);
        function HomePageView() {
            _super.call(this);
            Views.AirLoc.registerLocationCombo($("#currentCity"), function (place) {
                window.location.href = "/deals";
            });
            var cal = new MyCalendar($("#testCont"), "myDate");
            cal.gen();
        }
        Object.defineProperty(HomePageView.prototype, "pageType", {
            get: function () { return Views.PageType.HomePage; },
            enumerable: true,
            configurable: true
        });
        return HomePageView;
    }(Views.ViewBase));
    Views.HomePageView = HomePageView;
})(Views || (Views = {}));
//# sourceMappingURL=HomePageView.js.map