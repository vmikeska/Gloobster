var TravelB;
(function (TravelB) {
    var TravelBUtils = (function () {
        function TravelBUtils() {
        }
        TravelBUtils.waitingMins = function (waitingUntil) {
            var now = new Date();
            var untilDate = new Date(waitingUntil);
            var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            var untilUtc = new Date(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate(), untilDate.getUTCHours(), untilDate.getUTCMinutes(), untilDate.getUTCSeconds());
            var dd = Math.abs(nowUtc.getTime() - untilUtc.getTime());
            var diffMins = Math.ceil(dd / (1000 * 60));
            return diffMins;
        };
        return TravelBUtils;
    }());
    TravelB.TravelBUtils = TravelBUtils;
    var CheckinWin = (function () {
        function CheckinWin() {
            this.nowTab = "nowTab";
            this.futureTab = "futureTab";
            this.activeTab = this.nowTab;
            this.registerTemplates();
            this.ddReg = new Common.DropDown();
        }
        CheckinWin.prototype.showCheckinWin = function (isNew) {
            var _this = this;
            var btnTxt = isNew ? "Checkin" : "Update checkin";
            var context = { sumbitText: btnTxt };
            this.$html = $(this.checkinWindowDialog(context));
            $("body").append(this.$html);
            this.$html.fadeIn();
            this.ddReg.registerDropDown(this.$html.find("#fromAge"));
            this.ddReg.registerDropDown(this.$html.find("#toAge"));
            this.$html.find("#nowTabBtn").click(function (e) {
                e.preventDefault();
                _this.switchCheckinTabs(_this.nowTab);
            });
            this.$html.find("#futureTabBtn").click(function (e) {
                e.preventDefault();
                _this.switchCheckinTabs(_this.futureTab);
            });
            this.wpCombo = this.initPlaceDD("1,0,4", this.$html.find("#waitingPlace"));
            this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));
            this.$html.find("#submitCheckin").click(function (e) {
                e.preventDefault();
                _this.callServer(isNew);
            });
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.$html.fadeOut();
                _this.$html.remove();
            });
            this.fillAgeCombo("fromAge");
            this.fillAgeCombo("toAge");
            if (!isNew) {
                Views.ViewBase.currentView.apiGet("TravelBCheckin", [["me", "true"]], function (r) {
                    _this.selectRadio("wantDo", r.wantDo);
                    _this.selectRadio("wantMeet", r.wantMeet);
                    $("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);
                    var combo = null;
                    if (r.checkinType === 0) {
                        combo = _this.wpCombo;
                        var diffMins = TravelBUtils.waitingMins(r.waitingUntil);
                        _this.$html.find("#minsWaiting").val(diffMins);
                    }
                    if (r.checkinType === 1) {
                        combo = _this.wcCombo;
                    }
                    _this.setCombo(_this.$html.find("#fromAge"), r.fromAge);
                    _this.setCombo(_this.$html.find("#toAge"), r.toAge);
                    combo.initValues({
                        sourceId: r.waitingAtId,
                        sourceType: r.waitingAtType,
                        lastText: r.waitingAtText,
                        coord: r.waitingCoord
                    });
                });
            }
        };
        CheckinWin.prototype.setCombo = function ($combo, value) {
            $combo.find("input").val(value);
            $combo.find("span").html(value);
        };
        CheckinWin.prototype.selectRadio = function (group, val) {
            $("input[name=" + group + "][value=" + val + "]").prop('checked', true);
        };
        CheckinWin.prototype.fillAgeCombo = function (id) {
            var $ul = $("#" + id).find("ul");
            ;
            var ageStart = 18;
            var ageEnd = 70;
            for (var act = ageStart; act <= ageEnd; act++) {
                $ul.append("<li data-value=\"" + act + "\">" + act + "</li>");
            }
        };
        CheckinWin.prototype.callServer = function (isNew) {
            var _this = this;
            var checkinType = (this.activeTab === this.nowTab) ? 0 : 1;
            var combo = (this.activeTab === this.nowTab) ? this.wpCombo : this.wcCombo;
            var data = {
                wantDo: $('input[name=wantDo]:checked').val(),
                wantMeet: $('input[name=wantMeet]:checked').val(),
                multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
                fromAge: $("#fromAge input").val(),
                toAge: $("#toAge input").val(),
                minsWaiting: $("#minsWaiting").val(),
                fromDate: $("#fromDate").val(),
                toDate: $("#toDate").val(),
                checkinType: checkinType,
                waitingAtId: combo.sourceId,
                waitingAtType: combo.sourceType,
                waitingAtText: combo.lastText,
                waitingCoord: combo.coord
            };
            if (isNew) {
                Views.ViewBase.currentView.apiPost("TravelBCheckin", data, function (r) {
                    _this.refreshStat();
                });
            }
            else {
                Views.ViewBase.currentView.apiPut("TravelBCheckin", data, function (r) {
                    _this.refreshStat();
                });
            }
        };
        CheckinWin.prototype.refreshStat = function () {
            var status = new TravelB.Status();
            status.refresh();
            this.$html.fadeOut();
            this.$html.remove();
        };
        CheckinWin.prototype.registerTemplates = function () {
            this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");
        };
        CheckinWin.prototype.initPlaceDD = function (providers, selObj) {
            var c = new Common.PlaceSearchConfig();
            c.providers = providers;
            c.selOjb = selObj;
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            var combo = new Common.PlaceSearchBox(c);
            return combo;
        };
        CheckinWin.prototype.switchCheckinTabs = function (tab) {
            $("#" + this.nowTab).hide();
            $("#" + this.futureTab).hide();
            $("#" + tab).show();
            this.activeTab = tab;
        };
        return CheckinWin;
    }());
    TravelB.CheckinWin = CheckinWin;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinWin.js.map