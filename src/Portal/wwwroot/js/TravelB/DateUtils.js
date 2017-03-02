var TravelB;
(function (TravelB) {
    var DateUtils = (function () {
        function DateUtils() {
        }
        DateUtils.myDateToStr = function (myDate) {
            return myDate.Day + "." + myDate.Month + "." + myDate.Year;
        };
        DateUtils.myDateToTrans = function (myDate) {
            return myDate.Day + "_" + myDate.Month + "_" + myDate.Year;
        };
        DateUtils.myDateToJsDate = function (myDate) {
            return new Date(myDate.Year, myDate.Month - 1, myDate.Day);
        };
        DateUtils.transToMomentDate = function (trans) {
            var prms = trans.split("_");
            var o = {
                y: parseInt(prms[2]),
                M: parseInt(prms[1]) - 1,
                d: parseInt(prms[0])
            };
            return moment(o);
        };
        DateUtils.myDateToMomentDate = function (myDate) {
            if (!myDate) {
                return null;
            }
            return moment([myDate.Year, myDate.Month - 1, myDate.Day]);
        };
        DateUtils.momentDateToTrans = function (mDate) {
            return mDate.date() + "_" + (mDate.month() + 1) + "_" + mDate.year();
        };
        DateUtils.momentDateToMyDate = function (mDate) {
            if (!mDate) {
                return null;
            }
            return {
                Year: mDate.year(),
                Month: mDate.month() + 1,
                Day: mDate.date()
            };
        };
        DateUtils.jsDateToMyDate = function (date) {
            return {
                Year: date.getFullYear(),
                Month: date.getMonth() + 1,
                Day: date.getDate()
            };
        };
        return DateUtils;
    }());
    TravelB.DateUtils = DateUtils;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=DateUtils.js.map