var TravelB;
(function (TravelB) {
    var DateUtils = (function () {
        function DateUtils() {
        }
        DateUtils.addDays = function (date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };
        DateUtils.myDateToStr = function (myDate) {
            return myDate.Day + "." + myDate.Month + "." + myDate.Year;
        };
        DateUtils.myDateToTrans = function (myDate) {
            return myDate.Day + "_" + myDate.Month + "_" + myDate.Year;
        };
        DateUtils.myDateToJsDate = function (myDate) {
            return new Date(myDate.Year, myDate.Month - 1, myDate.Day);
        };
        DateUtils.jsDateToMyDate = function (date) {
            return {
                Year: date.getFullYear(),
                Month: date.getMonth() + 1,
                Day: date.getDate()
            };
        };
        DateUtils.datePickerConfig = function () {
            return {
                dateFormat: "dd.mm.yy"
            };
        };
        DateUtils.initDatePicker = function ($datePicker, date, onChange) {
            if (onChange === void 0) { onChange = null; }
            var dpConfig = this.datePickerConfig();
            $datePicker.datepicker(dpConfig);
            if (date) {
                var d = DateUtils.myDateToJsDate(date);
                $datePicker.datepicker("setDate", d);
                $datePicker.data("myDate", date);
            }
            $datePicker.change(function (e) {
                var $this = $(e.target);
                var date = $this.datepicker("getDate");
                var myDate = DateUtils.jsDateToMyDate(date);
                $datePicker.data("myDate", myDate);
                if (onChange) {
                    onChange(myDate);
                }
            });
        };
        return DateUtils;
    }());
    TravelB.DateUtils = DateUtils;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=DateUtils.js.map