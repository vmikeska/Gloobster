var TravelB;
(function (TravelB) {
    var CityTab = (function () {
        function CityTab() {
            this.layoutCreated = false;
            this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinCityItem-template");
        }
        CityTab.prototype.genCheckinsList = function (checkins) {
            var _this = this;
            var $listCont = $(".results .people");
            $listCont.find(".person").remove();
            var $no = $(".no-people-all");
            if (checkins.length > 0) {
                $no.hide();
            }
            else {
                $no.show();
            }
            var v = Views.ViewBase.currentView;
            var selFilter = v.filter.selectedFilter;
            checkins.forEach(function (c) {
                var context = TravelB.CheckinMapping.map(c, CheckinType.City);
                var tmp = _this.checkinTemplate;
                var $u = $(tmp(context));
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