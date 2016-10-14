var TravelB;
(function (TravelB) {
    var CityCheckinsMgmt = (function () {
        function CityCheckinsMgmt(view) {
            this.itemTmp = Views.ViewBase.currentView.registerTemplate("city-checkin-mgmt-item-template");
            this.$wcont = $(".checkin-win .cont");
            this.view = view;
        }
        CityCheckinsMgmt.prototype.genCheckins = function (callback) {
            var _this = this;
            this.$wcont.empty();
            Views.ViewBase.currentView.apiGet("CheckinCity", [["type", "my"]], function (cs) {
                cs.forEach(function (c) {
                    var context = {
                        id: c.id,
                        cityName: c.waitingAtText,
                        fromDate: moment.utc(c.fromDate).format("L"),
                        toDate: moment.utc(c.toDate).format("L"),
                        fromAge: c.fromAge,
                        toAge: c.toAge,
                        wmMan: ((c.wantMeet === TravelB.WantMeet.Man) || (c.wantMeet === TravelB.WantMeet.All)),
                        wmWoman: ((c.wantMeet === TravelB.WantMeet.Woman) || (c.wantMeet === TravelB.WantMeet.All)),
                        wmWomanGroup: ((c.wantMeet === TravelB.WantMeet.Woman) && c.multiPeopleAllowed),
                        wmManGroup: ((c.wantMeet === TravelB.WantMeet.Man) && c.multiPeopleAllowed),
                        wmMixGroup: ((c.wantMeet === TravelB.WantMeet.All) && c.multiPeopleAllowed),
                        wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
                        message: c.message
                    };
                    var $item = $(_this.itemTmp(context));
                    $item.find(".edit").click(function (e) {
                        e.preventDefault();
                        var id = _this.getId(e);
                        _this.edit(id);
                    });
                    $item.find(".delete").click(function (e) {
                        e.preventDefault();
                        var id = _this.getId(e);
                        _this.delete(id, $item);
                    });
                    _this.$wcont.append($item);
                });
                callback();
            });
        };
        CityCheckinsMgmt.prototype.edit = function (id) {
            this.view.checkinMenu.activateTab("check", id);
        };
        CityCheckinsMgmt.prototype.delete = function (id, $item) {
            var cd = new Common.ConfirmDialog();
            cd.create("Checkin deletion", "Do you want to delete this checkin ?", "Cancel", "Delete", function () {
                Views.ViewBase.currentView.apiDelete("CheckinCity", [["id", id]], function () {
                    $item.remove();
                    cd.hide();
                });
            });
        };
        CityCheckinsMgmt.prototype.getId = function (e) {
            var $t = $(e.target);
            var $r = $t.closest(".checkin-mgmt-item");
            var id = $r.data("id");
            return id;
        };
        return CityCheckinsMgmt;
    }());
    TravelB.CityCheckinsMgmt = CityCheckinsMgmt;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CityCheckinsMgmt.js.map