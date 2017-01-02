var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var CalendarView = (function (_super) {
        __extends(CalendarView, _super);
        function CalendarView() {
            _super.call(this);
            this.init();
        }
        CalendarView.prototype.init = function () {
            this.createCalendar();
        };
        CalendarView.prototype.createCalendar = function () {
            var __this = this;
            var $c = $("#calendar")
                .fullCalendar({
                header: { left: "title", right: "prev,next" },
                footer: false,
                navLinks: false,
                editable: false,
                eventLimit: true,
                fixedWeekCount: false,
                viewRender: function (view, element) {
                    __this.showData(view);
                },
                eventClick: function (evnt) {
                    window.open("/trip/" + evnt.tripId, "_blank");
                }
            });
            this.$calendar = $c;
        };
        CalendarView.prototype.showData = function (view) {
            var _this = this;
            view.calendar.removeEvents();
            var tFrom = TravelB.DateUtils.momentDateToTrans(view.start);
            var tTo = TravelB.DateUtils.momentDateToTrans(view.end);
            var prms = [["from", tFrom], ["to", tTo]];
            this.apiGet("FriendsEvents", prms, function (events) {
                var evnts = _.map(events, function (event) { return Dashboard.CalendarUtils.convertEvent(event); });
                evnts.forEach(function (evnt) {
                    _this.$calendar.fullCalendar("renderEvent", evnt);
                });
            });
        };
        return CalendarView;
    }(Views.ViewBase));
    Views.CalendarView = CalendarView;
})(Views || (Views = {}));
//# sourceMappingURL=CalendarView.js.map