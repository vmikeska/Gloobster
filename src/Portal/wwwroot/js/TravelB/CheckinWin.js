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
            this.nowTabConst = "nowTab";
            this.futureTabConst = "futureTab";
            this.registerTemplates();
            this.ddReg = new Common.DropDown();
        }
        CheckinWin.prototype.createWin = function (edit) {
            var _this = this;
            var btnTxt = edit ? "Update checkin" : "Checkin";
            var context = { sumbitText: btnTxt };
            this.$html = $(this.checkinWindowDialog(context));
            $("body").append(this.$html);
            this.$html.fadeIn();
            this.ddReg.registerDropDown(this.$html.find("#fromAge"));
            this.ddReg.registerDropDown(this.$html.find("#toAge"));
            this.$html.find("#submitCheckin").click(function (e) {
                e.preventDefault();
                _this.callNow();
            });
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.$html.fadeOut();
                _this.$html.remove();
            });
            this.fillAgeCombo("fromAge");
            this.fillAgeCombo("toAge");
        };
        CheckinWin.prototype.createWinNow = function () {
            var $d = $(this.dlgNow());
            this.$html.find("#dlgSpec").html($d);
            this.wpCombo = this.initPlaceDD("1,0,4", this.$html.find("#waitingPlace"));
        };
        CheckinWin.prototype.createWinCity = function () {
            this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));
        };
        CheckinWin.prototype.showNowCheckin = function () {
            var _this = this;
            Views.ViewBase.currentView.apiGet("CheckinNow", [["me", "true"]], function (r) {
                var hasStatus = r !== null;
                _this.createWin(hasStatus);
                _this.createWinNow();
                if (hasStatus) {
                    _this.selectRadio("wantDo", r.wantDo);
                    _this.selectRadio("wantMeet", r.wantMeet);
                    $("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);
                    var diffMins = TravelBUtils.waitingMins(r.waitingUntil);
                    _this.$html.find("#minsWaiting").val(diffMins);
                    _this.setCombo(_this.$html.find("#fromAge"), r.fromAge);
                    _this.setCombo(_this.$html.find("#toAge"), r.toAge);
                    _this.wpCombo.initValues({
                        sourceId: r.waitingAtId,
                        sourceType: r.waitingAtType,
                        lastText: r.waitingAtText,
                        coord: r.waitingCoord
                    });
                }
            });
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
        CheckinWin.prototype.getRequestObj = function () {
            var data = {
                wantDo: $('input[name=wantDo]:checked').val(),
                wantMeet: $('input[name=wantMeet]:checked').val(),
                multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
                fromAge: $("#fromAge input").val(),
                toAge: $("#toAge input").val(),
                minsWaiting: $("#minsWaiting").val(),
                fromDate: $("#fromDate").val(),
                toDate: $("#toDate").val()
            };
            return data;
        };
        CheckinWin.prototype.callNow = function () {
            var _this = this;
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.wpCombo.sourceId,
                waitingAtType: this.wpCombo.sourceType,
                waitingAtText: this.wpCombo.lastText,
                waitingCoord: this.wpCombo.coord
            });
            Views.ViewBase.currentView.apiPost("CheckinNow", data, function (r) {
                _this.refreshStat();
            });
        };
        CheckinWin.prototype.callCity = function () {
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.wcCombo.sourceId,
                waitingAtType: this.wcCombo.sourceType,
                waitingAtText: this.wcCombo.lastText,
                waitingCoord: this.wcCombo.coord
            });
            Views.ViewBase.currentView.apiPost("CheckinCity", data, function (r) {
            });
        };
        CheckinWin.prototype.refreshStat = function () {
            var status = new TravelB.Status();
            status.refresh();
            this.$html.fadeOut();
            this.$html.remove();
        };
        CheckinWin.prototype.registerTemplates = function () {
            this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");
            this.dlgNow = Views.ViewBase.currentView.registerTemplate("dlgNow-template");
            this.dlgCity = Views.ViewBase.currentView.registerTemplate("dlgCity-template");
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
        return CheckinWin;
    }());
    TravelB.CheckinWin = CheckinWin;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinWin.js.map