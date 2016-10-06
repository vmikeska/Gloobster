var TravelB;
(function (TravelB) {
    var NowTab = (function () {
        function NowTab() {
            this.peopleTabConst = "people";
            this.mpTabConst = "meetingPoints";
            this.checkinTemplate = Views.ViewBase.currentView.registerTemplate("checkinNowItem-template");
            this.mpTemplate = Views.ViewBase.currentView.registerTemplate("meetingPointItem-template");
        }
        NowTab.prototype.genMeetingPoints = function (points) {
            var _this = this;
            var $listCont = $(".results .meeting-points");
            $listCont.find(".meeting-point").remove();
            points.forEach(function (p) {
                var context = {
                    sourceId: p.sourceId,
                    type: p.type,
                    name: p.text,
                    link: Common.GlobalUtils.getSocLink(p.type, p.sourceId),
                    photoUrl: p.photoUrl
                };
                var $u = $(_this.mpTemplate(context));
                $u.find(".btn-check").click(function (e) {
                    e.preventDefault();
                    var v = Views.ViewBase.currentView;
                    v.checkinWin.showNowCheckin(function () {
                        v.checkinWin.wpCombo.initValues({
                            sourceId: p.sourceId,
                            sourceType: p.type,
                            lastText: p.text,
                            coord: p.coord
                        });
                    });
                });
                $listCont.append($u);
            });
        };
        NowTab.prototype.genCheckinsList = function (checkins) {
            var _this = this;
            var fc = _.reject(checkins, function (c) { return c.userId === Views.ViewBase.currentUserId; });
            var $listCont = $(".results .people");
            $listCont.find(".person").remove();
            var d = new Date();
            var curYear = d.getFullYear();
            var cr = new CheckinReact();
            fc.forEach(function (p) {
                var context = {
                    id: p.userId,
                    name: p.displayName,
                    age: curYear - p.birthYear,
                    languages: Views.StrOpers.langsToFlags(p.languages, p.homeCountry),
                    homeCountry: p.homeCountry,
                    livesCountry: p.livesCountry,
                    livesOtherCountry: p.homeCountry !== p.livesCountry,
                    wmMan: ((p.wantMeet === TravelB.WantMeet.Man) || (p.wantMeet === TravelB.WantMeet.All)),
                    wmWoman: ((p.wantMeet === TravelB.WantMeet.Woman) || (p.wantMeet === TravelB.WantMeet.All)),
                    wmWomanGroup: ((p.wantMeet === TravelB.WantMeet.Woman) && p.multiPeopleAllowed),
                    wmManGroup: ((p.wantMeet === TravelB.WantMeet.Man) && p.multiPeopleAllowed),
                    wmMixGroup: ((p.wantMeet === TravelB.WantMeet.All) && p.multiPeopleAllowed),
                    wantDos: Views.StrOpers.getActivityStrArray(p.wantDo),
                    message: p.message
                };
                var $u = $(_this.checkinTemplate(context));
                $u.find(".chat-btn").click(function (e) {
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