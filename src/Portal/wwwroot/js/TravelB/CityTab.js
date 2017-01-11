var TravelB;
(function (TravelB) {
    var CityTab = (function () {
        function CityTab(v) {
            this.layoutCreated = false;
            this.v = v;
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
            checkins.forEach(function (c) {
                var context = TravelB.CheckinMapping.map(c, CheckinType.City);
                var tmp = _this.checkinTemplate;
                var $u = $(tmp(context));
                $u.find(".chat-btn").click(function (e) {
                    e.preventDefault();
                    var $t = $(e.target);
                    var uid = $t.data("uid");
                    _this.v.hasFullReg(function () {
                        var link = window["messagesLink"] + "/" + uid;
                        window.open(link, "_blank");
                    });
                });
                $listCont.append($u);
            });
        };
        return CityTab;
    }());
    TravelB.CityTab = CityTab;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CityTab.js.map