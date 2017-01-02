var Dashboard;
(function (Dashboard) {
    var CalendarUtils = (function () {
        function CalendarUtils() {
        }
        CalendarUtils.convertEvent = function (event) {
            var start = moment.utc(event.start);
            var end = moment.utc(event.end);
            var e = {
                title: event.name,
                start: this.convDate(start),
                end: this.convDate(end),
                tripId: event.tripId
            };
            return e;
        };
        CalendarUtils.getCalRange = function ($cal) {
            var view = $cal.fullCalendar("getView");
            return { from: view.start, to: view.end };
        };
        CalendarUtils.convDate = function (date) {
            var d = moment.utc(date);
            var s = d.format("YYYY-MM-DD");
            return s;
        };
        return CalendarUtils;
    }());
    Dashboard.CalendarUtils = CalendarUtils;
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=CalendarUtils.js.map