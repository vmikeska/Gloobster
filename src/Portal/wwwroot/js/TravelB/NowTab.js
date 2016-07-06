var TravelB;
(function (TravelB) {
    var NowTab = (function () {
        function NowTab() {
            this.peopleTabConst = "people";
            this.mpTabConst = "meetingPoints";
            this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinNowItem-template");
            this.mpTemplate = Views.ViewBase.currentView.registerTemplate("meetingPointItem-template");
        }
        NowTab.prototype.createTab = function () {
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
        NowTab.prototype.genMeetingPoints = function (points) {
            var _this = this;
            var $listCont = $("#listCont");
            $listCont.html("");
            points.forEach(function (p) {
                var context = {
                    sourceId: p.sourceId,
                    type: p.type,
                    name: p.text,
                    link: "abcd"
                };
                var $u = $(_this.mpTemplate(context));
                $listCont.append($u);
            });
        };
        NowTab.prototype.genCheckinsList = function (checkins) {
            var _this = this;
            var $listCont = $("#listCont");
            $listCont.html("");
            var d = new Date();
            var curYear = d.getFullYear();
            var cr = new CheckinReact();
            checkins.forEach(function (p) {
                var context = {
                    id: p.userId,
                    name: p.displayName,
                    age: curYear - p.birthYear,
                    waitingFor: Views.StrOpers.getGenderStr(p.wantMeet),
                    wants: Views.StrOpers.getActivityStr(p.wantDo)
                };
                var $u = $(_this.checkinTemplate(context));
                $u.find(".startChatBtn").click(function (e) {
                    e.preventDefault();
                    cr.askForChat(p);
                });
                $listCont.append($u);
            });
        };
        return NowTab;
    }());
    TravelB.NowTab = NowTab;
    var CheckinReact = (function () {
        function CheckinReact() {
        }
        CheckinReact.prototype.askForChat = function (checkin) {
            var data = { uid: checkin.userId, cid: checkin.id };
            Views.ViewBase.currentView.apiPost("CheckinReact", data, function () {
                var id = new Common.InfoDialog();
                id.create("Request sent", "You asked to start chat with the user, now you have to wait until he confirms the chat");
            });
        };
        return CheckinReact;
    }());
    TravelB.CheckinReact = CheckinReact;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=NowTab.js.map