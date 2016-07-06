var TravelB;
(function (TravelB) {
    var Status = (function () {
        function Status() {
            this.template = Views.ViewBase.currentView.registerTemplate("status-template");
        }
        Status.prototype.refresh = function () {
            var _this = this;
            var $cont = $("#statusCont");
            Views.ViewBase.currentView.apiGet("CheckinNow", [["me", "true"]], function (r) {
                if (!r) {
                    $cont.html("No status");
                    return;
                }
                var context = {
                    placeName: r.waitingAtText,
                    wantMeetName: Views.StrOpers.getGenderStr(r.wantMeet),
                    wantDoName: "(" + Views.StrOpers.getActivityStr(r.wantDo) + ")"
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
            win.showNowCheckin();
        };
        return Status;
    }());
    TravelB.Status = Status;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=Status.js.map