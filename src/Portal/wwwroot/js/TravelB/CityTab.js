var TravelB;
(function (TravelB) {
    var CityTab = (function () {
        function CityTab() {
            this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");
        }
        CityTab.prototype.genCheckinsList = function (checkins) {
            var _this = this;
            var $listCont = $("#theCont");
            $listCont.html("");
            var d = new Date();
            var curYear = d.getFullYear();
            checkins.forEach(function (p) {
                var context = {
                    id: p.userId,
                    name: p.displayName,
                    age: curYear - p.birthYear,
                    waitingFor: Views.TravelBView.getGenderStr(p.wantMeet),
                    wants: Views.TravelBView.getActivityStr(p.wantDo),
                    fromDate: TravelB.DateUtils.myDateToStr(p.fromDate),
                    toDate: TravelB.DateUtils.myDateToStr(p.toDate)
                };
                var $u = $(_this.checkinTemplate(context));
                $listCont.append($u);
            });
        };
        return CityTab;
    }());
    TravelB.CityTab = CityTab;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CityTab.js.map