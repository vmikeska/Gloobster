var TravelB;
(function (TravelB) {
    (function (WantMeet) {
        WantMeet[WantMeet["Man"] = 0] = "Man";
        WantMeet[WantMeet["Woman"] = 1] = "Woman";
        WantMeet[WantMeet["All"] = 2] = "All";
    })(TravelB.WantMeet || (TravelB.WantMeet = {}));
    var WantMeet = TravelB.WantMeet;
    var Status = (function () {
        function Status() {
            this.template = Views.ViewBase.currentView.registerTemplate("status-template");
        }
        Status.prototype.refresh = function () {
            var _this = this;
            var $checkinRow = $(".checkin-row");
            Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], function (r) {
                if (!r) {
                    $checkinRow.show();
                    return;
                }
                var context = {
                    placeName: r.waitingAtText,
                    placeLink: Common.GlobalUtils.getSocLink(r.waitingAtType, r.waitingAtId),
                    wmMan: ((r.wantMeet === WantMeet.Man) || (r.wantMeet === WantMeet.All)),
                    wmWoman: ((r.wantMeet === WantMeet.Woman) || (r.wantMeet === WantMeet.All)),
                    wmWomanGroup: ((r.wantMeet === WantMeet.Woman) && r.multiPeopleAllowed),
                    wmManGroup: ((r.wantMeet === WantMeet.Man) && r.multiPeopleAllowed),
                    wmMixGroup: ((r.wantMeet === WantMeet.All) && r.multiPeopleAllowed),
                    wantDos: Views.StrOpers.getActivityStrArray(r.wantDo)
                };
                var $html = $(_this.template(context));
                $html.find(".edit").click(function (e) {
                    e.preventDefault();
                    _this.editClick();
                });
                $checkinRow.after($html);
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