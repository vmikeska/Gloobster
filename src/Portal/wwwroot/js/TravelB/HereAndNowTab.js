var TravelB;
(function (TravelB) {
    var HereAndNowTab = (function () {
        function HereAndNowTab() {
            this.peopleTabConst = "people";
            this.mpTabConst = "meetingPoints";
            this.userTemplate = Views.ViewBase.currentView.registerTemplate("checkinUserItem-template");
        }
        HereAndNowTab.prototype.createTab = function () {
            var _this = this;
            this.tabs = new TravelB.Tabs($("#hereTabs"), "hereAndNow", 40);
            this.tabs.onBeforeSwitch = function () {
                $("#listCont").html("");
                _this.onBeforeSwitch();
            };
            this.tabs.addTab(this.peopleTabConst, "People", function () {
                _this.onPlacesCheckins();
            });
            this.tabs.addTab(this.mpTabConst, "Meeting points", function () {
                _this.onMeetingPoints();
            });
            this.tabs.create();
        };
        HereAndNowTab.prototype.genMeetingPoints = function (points) {
            var $listCont = $("#listCont");
            $listCont.html("meeting points");
        };
        HereAndNowTab.prototype.genPeopleList = function (checkins) {
            var _this = this;
            var $listCont = $("#listCont");
            $listCont.html("");
            var d = new Date();
            var curYear = d.getFullYear();
            checkins.forEach(function (p) {
                var context = {
                    id: p.userId,
                    name: p.displayName,
                    age: curYear - p.birthYear,
                    waitingFor: Views.TravelBView.getGenderStr(p.wantMeet),
                    wants: Views.TravelBView.getActivityStr(p.wantDo)
                };
                var $u = $(_this.userTemplate(context));
                $listCont.append($u);
            });
        };
        return HereAndNowTab;
    }());
    TravelB.HereAndNowTab = HereAndNowTab;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=HereAndNowTab.js.map