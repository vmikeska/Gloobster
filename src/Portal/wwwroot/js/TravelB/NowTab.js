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
            var $no = $(".no-mp-all");
            if (points.length > 0) {
                $no.hide();
            }
            else {
                $no.show();
            }
            points.forEach(function (p) {
                var context = {
                    sourceId: p.sourceId,
                    type: p.type,
                    name: p.text,
                    link: Common.GlobalUtils.getSocLink(p.type, p.sourceId),
                    photoUrl: p.photoUrl,
                    categories: p.categories,
                    peopleMet: p.peopleMet,
                    distance: null
                };
                var l = TravelB.UserLocation.currentLocation;
                if (l != null) {
                    context.distance = Common.GlobalUtils.getDistance(l.lat, l.lng, p.coord.Lat, p.coord.Lng).toFixed(1);
                }
                var $u = $(_this.mpTemplate(context));
                $u.find(".btn-check").click(function (e) {
                    e.preventDefault();
                    var v = Views.ViewBase.currentView;
                    v.checkinWin.showNowCheckin(function () {
                        v.checkinWin.placeCombo.initValues({
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
            var $no = $(".no-people-all");
            if (fc.length > 0) {
                $no.hide();
            }
            else {
                $no.show();
            }
            var $listCont = $(".results .people");
            $listCont.find(".person").remove();
            var cr = new CheckinReact();
            fc.forEach(function (c) {
                var context = CheckinMapping.map(c, CheckinType.Now);
                var $u = $(_this.checkinTemplate(context));
                $u.find(".chat-btn").click(function (e) {
                    e.preventDefault();
                    cr.askForChat(c.userId, c.id);
                });
                $listCont.append($u);
            });
        };
        return NowTab;
    }());
    TravelB.NowTab = NowTab;
    var CheckinMapping = (function () {
        function CheckinMapping() {
        }
        CheckinMapping.map = function (c, type) {
            var d = new Date();
            var curYear = d.getFullYear();
            var context = {
                uid: c.userId,
                cid: c.id,
                name: c.displayName,
                age: curYear - c.birthYear,
                languages: c.languages,
                fromAge: c.fromAge,
                toAge: c.toAge,
                homeCountry: c.homeCountry,
                livesCountry: c.livesCountry,
                livesOtherCountry: c.homeCountry !== c.livesCountry,
                wmMan: ((c.wantMeet === TravelB.WantMeet.Man) || (c.wantMeet === TravelB.WantMeet.All)),
                wmWoman: ((c.wantMeet === TravelB.WantMeet.Woman) || (c.wantMeet === TravelB.WantMeet.All)),
                wmWomanGroup: ((c.wantMeet === TravelB.WantMeet.Woman) && c.multiPeopleAllowed),
                wmManGroup: ((c.wantMeet === TravelB.WantMeet.Man) && c.multiPeopleAllowed),
                wmMixGroup: ((c.wantMeet === TravelB.WantMeet.All) && c.multiPeopleAllowed),
                wantDos: Views.StrOpers.getActivityStrArray(c.wantDo),
                message: c.message,
                isYou: (c.userId === Views.ViewBase.currentUserId),
                waitingAtId: c.waitingAtId,
                waitingAtType: c.waitingAtType,
                waitingAtText: c.waitingAtText,
                waitingCoord: c.waitingCoord,
                waitingLink: Common.GlobalUtils.getSocLink(c.waitingAtType, c.waitingAtId)
            };
            if (type === CheckinType.Now) {
                context = $.extend(context, {
                    waitingStr: TravelB.TravelBUtils.minsToTimeStr(TravelB.TravelBUtils.waitingMins(c.waitingUntil))
                });
            }
            if (type === CheckinType.City) {
                context = $.extend(context, {
                    fromDate: Views.StrOpers.formatDate(c.fromDate),
                    toDate: Views.StrOpers.formatDate(c.toDate)
                });
            }
            return context;
        };
        return CheckinMapping;
    }());
    TravelB.CheckinMapping = CheckinMapping;
    var CheckinReact = (function () {
        function CheckinReact() {
        }
        CheckinReact.prototype.askForChat = function (uid, cid) {
            var data = { uid: uid, cid: cid };
            var v = Views.ViewBase.currentView;
            v.apiPost("CheckinReact", data, function () {
                var id = new Common.InfoDialog();
                id.create(v.t("RequestSentTitle", "jsTravelB"), v.t("RequestSentBody", "jsTravelB"));
            });
        };
        return CheckinReact;
    }());
    TravelB.CheckinReact = CheckinReact;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=NowTab.js.map