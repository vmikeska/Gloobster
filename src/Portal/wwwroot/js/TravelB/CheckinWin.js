var TravelB;
(function (TravelB) {
    var CheckinWin = (function () {
        function CheckinWin() {
            this.nowTabConst = "nowTab";
            this.futureTabConst = "futureTab";
            this.registerTemplates();
            this.$win = $(".checkin-win");
        }
        CheckinWin.prototype.showCityCheckin = function (editId) {
            var isEdit = (editId != null);
            if (isEdit) {
            }
            this.createWin(isEdit, CheckinType.City);
            this.createWinCity();
        };
        CheckinWin.prototype.showNowCheckin = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], function (r) {
                var hasStatus = r !== null;
                _this.createWin(hasStatus, CheckinType.Now);
                _this.createWinNow();
                if (hasStatus) {
                    _this.wantDos.initData(r.wantDo);
                    _this.selectRadio("wantMeet", r.wantMeet);
                    $("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);
                    var diffMins = TravelB.TravelBUtils.waitingMins(r.waitingUntil);
                    _this.$html.find("#minsWaiting").val(diffMins);
                    _this.setCombo(_this.$html.find("#fromAge"), r.fromAge);
                    _this.setCombo(_this.$html.find("#toAge"), r.toAge);
                    _this.wpCombo.initValues({
                        sourceId: r.waitingAtId,
                        sourceType: r.waitingAtType,
                        lastText: r.waitingAtText,
                        coord: r.waitingCoord
                    });
                    _this.$html.find("#chckMsg").val(r.message);
                }
                if (callback) {
                    callback();
                }
            });
        };
        CheckinWin.prototype.initWantDo = function () {
            var $c = this.$html.find("#wantDoCont");
            this.wantDos = new TravelB.CategoryTagger();
            var data = TravelB.TravelBUtils.getWantDoTaggerData();
            this.wantDos.create($c, "checkin", data, "Pick activities you'd like to do");
        };
        CheckinWin.prototype.createWin = function (edit, type) {
            var _this = this;
            var btnTxt = edit ? "Update checkin" : "Checkin";
            var context = { sumbitText: btnTxt };
            this.$html = $(this.checkinWindowDialog(context));
            this.$win.html(this.$html);
            this.$win.slideDown();
            this.initWantDo();
            Common.DropDown.registerDropDown(this.$html.find("#fromAge"));
            Common.DropDown.registerDropDown(this.$html.find("#toAge"));
            this.$html.find("#submitCheckin").click(function (e) {
                e.preventDefault();
                if (type === CheckinType.Now) {
                    _this.callNow();
                }
                if (type === CheckinType.City) {
                    _this.callCity();
                }
            });
            this.$html.find(".cancel").click(function (e) {
                e.preventDefault();
                _this.$win.slideUp(function () {
                    _this.$win.empty();
                });
            });
        };
        CheckinWin.prototype.createWinNow = function () {
            var $d = $(this.dlgNow());
            this.$html.find("#dlgSpec").html($d);
            this.wpCombo = this.initPlaceDD("1,4", this.$html.find("#waitingPlace"));
            Common.DropDown.registerDropDown(this.$html.find("#minsWaiting"));
        };
        CheckinWin.prototype.createWinCity = function () {
            var $d = $(this.dlgCity());
            this.$html.find("#dlgSpec").html($d);
            this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));
            var fromDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 2));
            var toDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 5));
            TravelB.DateUtils.initDatePicker(this.$html.find("#fromDate"), fromDate);
            TravelB.DateUtils.initDatePicker(this.$html.find("#toDate"), toDate);
        };
        CheckinWin.prototype.setCombo = function ($combo, value) {
            $combo.find("input").val(value);
            $combo.find("span").html(value);
        };
        CheckinWin.prototype.selectRadio = function (group, val) {
            this.$html.find("input[name=" + group + "][value=" + val + "]").prop("checked", true);
        };
        CheckinWin.prototype.getRequestObj = function () {
            var data = {
                wantDo: this.getWantDos(),
                wantMeet: $('input[name=wantMeet]:checked').val(),
                multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
                fromAge: $("#fromAge input").val(),
                toAge: $("#toAge input").val(),
                message: $("#chckMsg").val()
            };
            return data;
        };
        CheckinWin.prototype.getWantDos = function () {
            var res = this.wantDos.getSelectedIds();
            return res;
        };
        CheckinWin.prototype.callNow = function () {
            var _this = this;
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.wpCombo.sourceId,
                waitingAtType: this.wpCombo.sourceType,
                waitingAtText: this.wpCombo.lastText,
                waitingCoord: this.wpCombo.coord,
                minsWaiting: $("#minsWaiting input").val(),
                checkinType: CheckinType.Now
            });
            Views.ViewBase.currentView.apiPost("CheckinNow", data, function (r) {
                _this.refreshStat();
                _this.closeWin();
            });
        };
        CheckinWin.prototype.callCity = function () {
            var _this = this;
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.wcCombo.sourceId,
                waitingAtType: this.wcCombo.sourceType,
                waitingAtText: this.wcCombo.lastText,
                waitingCoord: this.wcCombo.coord,
                fromDate: $("#fromDate").data("myDate"),
                toDate: $("#toDate").data("myDate"),
                checkinType: CheckinType.City
            });
            Views.ViewBase.currentView.apiPost("CheckinCity", data, function (r) {
                _this.closeWin();
            });
        };
        CheckinWin.prototype.refreshStat = function () {
            var status = new TravelB.Status();
            status.refresh();
        };
        CheckinWin.prototype.closeWin = function () {
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
            var loc = TravelB.UserLocation.currentLocation;
            if (loc) {
                combo.setCoordinates(loc.lat, loc.lng);
            }
            return combo;
        };
        return CheckinWin;
    }());
    TravelB.CheckinWin = CheckinWin;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinWin.js.map