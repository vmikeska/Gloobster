var Common;
(function (Common) {
    var MyCalendar = (function () {
        function MyCalendar($cont, date) {
            if (date === void 0) { date = null; }
            this.opened = false;
            this.$cont = $cont;
            var inputId = $cont.attr("id") + "-input";
            this.id = inputId;
            this.$cont.addClass("calendar-cont");
            this.now = moment();
            if (date) {
                this.date = date;
            }
            else {
                this.date = moment();
            }
            this.date.startOf("day");
            this.gen();
        }
        MyCalendar.prototype.enabled = function (state) {
            if (state === null) {
                return !this.$cont.hasClass("disabled");
            }
            this.$cont.toggleClass("disabled", state);
        };
        MyCalendar.prototype.setDate = function (date) {
            this.date = date;
            this.setDateInternal();
        };
        MyCalendar.prototype.setDateInternal = function () {
            if (this.isNative) {
                var input = this.$input.get(0);
                input["valueAsDate"] = this.date.toDate();
            }
            else {
                var d = this.date.format("L");
                this.$input.val(d);
            }
        };
        MyCalendar.prototype.gen = function () {
            this.createInput();
        };
        MyCalendar.prototype.onFocus = function () {
            this.genCal();
        };
        MyCalendar.prototype.createCalBase = function () {
            var _this = this;
            var calTmp = Views.ViewBase.currentView.registerTemplate("calendar-base-template");
            this.$calCont = $(calTmp());
            this.$cont.append(this.$calCont);
            this.$calCont.find(".close-cal").click(function (e) {
                e.preventDefault();
                _this.closeCal();
            });
        };
        MyCalendar.prototype.regMove = function () {
            var _this = this;
            this.$cont.find(".move-month").click(function (e) {
                var $t = $(e.target);
                var prev = $t.hasClass("prev");
                var directionVal = prev ? -1 : 1;
                _this.date.add(directionVal, "months");
                _this.closeCal();
                _this.genCal();
            });
        };
        MyCalendar.prototype.closeCal = function () {
            this.$cont.find(".my-calendar-win").remove();
            this.opened = false;
        };
        MyCalendar.prototype.genCal = function () {
            var _this = this;
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
                var $weekCont = $("<div class=\"week-row\"></div>");
                for (var act = 1; act <= 7; act++) {
                    if (!titleFinished) {
                        var $tc = this.$calCont.find(".days-title");
                        var txt = date.format("dd");
                        var $td = $("<div class=\"day\">" + txt + "</div>");
                        $tc.append($td);
                        if (act === 6 || act === 7) {
                            $td.addClass("weekend");
                        }
                    }
                    var dayNo = date.date();
                    var $day = $("<div class=\"day\" data-d=\"" + dayNo + "\" data-m=\"" + date.month() + "\" data-y=\"" + date.year() + "\">" + dayNo + "</div>");
                    $weekCont.append($day);
                    $day.click(function (e) {
                        var $t = $(e.target);
                        var day = $t.data("d");
                        var month = $t.data("m");
                        var year = $t.data("y");
                        var d = moment([year, month, day]);
                        _this.dayClicked(d, $t);
                    });
                    var daysDiff = this.now.diff(date, "day");
                    var isPast = daysDiff > 0;
                    if (isPast) {
                        $day.addClass("old");
                    }
                    else {
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
        };
        MyCalendar.prototype.dayClicked = function (date, $day) {
            this.date = date;
            this.$cont.find(".week-row .day").removeClass("active");
            $day.addClass("active");
            this.$input.val(date.format("L"));
            this.callChange();
            this.closeCal();
        };
        MyCalendar.prototype.callChange = function () {
            if (this.onChange) {
                this.onChange(this.date);
            }
        };
        MyCalendar.prototype.getCalStart = function (date) {
            var d = date.clone();
            d.startOf("month");
            d.startOf("week");
            return d;
        };
        MyCalendar.prototype.getCalEnd = function (date) {
            var d = date.clone();
            d.endOf("month");
            d.endOf("week");
            return d;
        };
        MyCalendar.prototype.createInput = function () {
            var _this = this;
            var os = Views.ViewBase.getMobileOS();
            this.isNative = os !== OS.Other;
            var $wrap = $("<div class=\"cal-wrap\"><span class=\"icon-calendar\"></span></div>");
            if (this.isNative) {
                this.$input = $("<input class=\"calendar-input\" type=\"date\" id=\"" + this.id + "\" />");
                $wrap.prepend(this.$input);
                this.$cont.html($wrap);
                this.$input.change(function () {
                    _this.date = moment(_this.$input.val());
                    _this.callChange();
                });
            }
            else {
                this.$input = $("<input class=\"calendar-input\" readonly type=\"text\" id=\"" + this.id + "\" />");
                $wrap.prepend(this.$input);
                this.$cont.html($wrap);
                this.$input.focusin(function () {
                    _this.onFocus();
                });
            }
            this.setDateInternal();
        };
        return MyCalendar;
    }());
    Common.MyCalendar = MyCalendar;
})(Common || (Common = {}));
//# sourceMappingURL=MyCalendar.js.map