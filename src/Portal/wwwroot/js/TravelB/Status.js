var TravelB;
(function (TravelB) {
    var Status = (function () {
        function Status() {
            this.template = Views.ViewBase.currentView.registerTemplate("status-template");
        }
        Status.prototype.refresh = function () {
            var _this = this;
            var $cont = $("#statusCont");
            Views.ViewBase.currentView.apiGet("TravelBCheckin", [["me", "true"]], function (r) {
                if (!r) {
                    $cont.html("No status");
                }
                var context = {
                    placeName: r.waitingAtText,
                    wantMeetName: Views.TravelBView.getGenderStr(r.wantMeet),
                    wantDoName: Views.TravelBView.getActivityStr(r.wantDo)
                };
                var $html = $(_this.template(context));
                $html.click(function (e) {
                    e.preventDefault();
                    _this.editClick();
                });
                $cont.html($html);
            });
        };
        Status.prototype.editClick = function () {
            var win = new TravelB.CheckinWin();
            win.showCheckinWin(false);
        };
        return Status;
    }());
    TravelB.Status = Status;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=Status.js.map