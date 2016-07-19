var TravelB;
(function (TravelB) {
    var CityTab = (function () {
        function CityTab() {
            this.layoutCreated = false;
            this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");
            this.checkinMgmtTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityMgmtItem-template");
        }
        CityTab.prototype.genCheckinsList = function (checkins) {
            var _this = this;
            var $listCont = $("#theCont");
            $listCont.html("");
            var d = new Date();
            var curYear = d.getFullYear();
            var v = Views.ViewBase.currentView;
            var selFilter = v.filter.selectedFilter;
            checkins.forEach(function (p) {
                var context = {
                    cid: p.id,
                    id: p.userId,
                    name: p.displayName,
                    age: curYear - p.birthYear,
                    waitingFor: Views.StrOpers.getGenderStr(p.wantMeet),
                    multiStr: Views.StrOpers.getMultiStr(p.multiPeopleAllowed),
                    wants: Views.StrOpers.getActivityStr(p.wantDo),
                    fromDate: TravelB.DateUtils.myDateToStr(p.fromDate),
                    toDate: TravelB.DateUtils.myDateToStr(p.toDate),
                    message: p.message
                };
                var tmp = _.contains(selFilter, "mine") ? _this.checkinMgmtTemplate : _this.checkinTemplate;
                var $u = $(tmp(context));
                $u.find(".del").click(function (e) {
                    e.preventDefault();
                    var cd = new Common.ConfirmDialog();
                    cd.create("Checkin deletion", "Do you really want to delete this checkin ?", "Cancel", "Delete", function () {
                        var $t = $(e.target);
                        var $c = $t.closest(".userItem");
                        var cid = $c.data("cid");
                        var prms = [["id", cid]];
                        Views.ViewBase.currentView.apiDelete("CheckinCity", prms, function (r) {
                            $c.remove();
                        });
                    });
                });
                $u.find(".sendMsg").click(function (e) {
                    e.preventDefault();
                    var $t = $(e.target);
                    var $c = $t.closest(".userItem");
                    var userId = $c.data("uid");
                    window.location.href = "/TravelB/Message/" + userId;
                });
                $listCont.append($u);
            });
        };
        return CityTab;
    }());
    TravelB.CityTab = CityTab;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CityTab.js.map