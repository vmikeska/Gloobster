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
            var $statusRow = $(".status-row");
            Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], function (r) {
                if (!r) {
                    _this.visibilityStatusIsSet(false);
                    return;
                }
                $statusRow.remove();
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
                $html.find(".delete").click(function (e) {
                    e.preventDefault();
                    Views.ViewBase.currentView.apiDelete("CheckinNow", [], function () {
                        _this.visibilityStatusIsSet(false);
                    });
                });
                $checkinRow.after($html);
                _this.visibilityStatusIsSet(true);
            });
        };
        Status.prototype.visibilityStatusIsSet = function (isSet) {
            var $checkinRow = $(".checkin-row");
            var $statusRow = $(".status-row");
            if (isSet) {
                $checkinRow.hide();
                $statusRow.show();
            }
            else {
                $checkinRow.show();
                $statusRow.remove();
            }
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