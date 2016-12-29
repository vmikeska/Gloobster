var TravelB;
(function (TravelB) {
    var CheckinWin = (function () {
        function CheckinWin(view) {
            this.nowTabConst = "nowTab";
            this.futureTabConst = "futureTab";
            this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");
            this.dlgNow = Views.ViewBase.currentView.registerTemplate("dlgNow-template");
            this.dlgCity = Views.ViewBase.currentView.registerTemplate("dlgCity-template");
            this.view = view;
        }
        CheckinWin.prototype.showCityCheckin = function (editId, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            this.editId = editId;
            var isEdit = (editId != null);
            this.createWin(isEdit, CheckinType.City);
            this.createWinCity();
            if (isEdit) {
                var data = [["type", "id"], ["id", editId]];
                Views.ViewBase.currentView.apiGet("CheckinCity", data, function (r) {
                    _this.wantDos.initData(r.wantDo);
                    _this.selectRadio("wantMeet", r.wantMeet);
                    $("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);
                    _this.setCombo(_this.$html.find("#fromAge"), r.fromAge);
                    _this.setCombo(_this.$html.find("#toAge"), r.toAge);
                    _this.placeCombo.initValues({
                        sourceId: r.waitingAtId,
                        sourceType: r.waitingAtType,
                        lastText: r.waitingAtText,
                        coord: r.waitingCoord
                    });
                    _this.initDatePickers(TravelB.DateUtils.myDateToMomentDate(r.fromDate), TravelB.DateUtils.myDateToMomentDate(r.toDate));
                    var $msg = _this.$html.find("#chckMsg");
                    $msg.val(r.message);
                    _this.createValidations(CheckinType.City);
                });
            }
            else {
                this.initDatePickers();
                this.createValidations(CheckinType.City);
            }
            if (callback) {
                callback();
            }
        };
        CheckinWin.prototype.showNowCheckin = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], function (r) {
                var hasStatus = r !== null;
                _this.createWin(hasStatus, CheckinType.Now);
                _this.createWinNow();
                if (hasStatus) {
                    _this.editId = r.id;
                    _this.wantDos.initData(r.wantDo);
                    _this.selectRadio("wantMeet", r.wantMeet);
                    $("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);
                    var diffMins = TravelB.TravelBUtils.waitingMins(r.waitingUntil);
                    _this.$html.find("#minsWaiting").val(diffMins);
                    _this.setCombo(_this.$html.find("#fromAge"), r.fromAge);
                    _this.setCombo(_this.$html.find("#toAge"), r.toAge);
                    _this.placeCombo.initValues({
                        sourceId: r.waitingAtId,
                        sourceType: r.waitingAtType,
                        lastText: r.waitingAtText,
                        coord: r.waitingCoord
                    });
                    _this.$html.find("#chckMsg").val(r.message);
                }
                _this.createValidations(CheckinType.Now);
                if (callback) {
                    callback();
                }
            });
        };
        CheckinWin.prototype.initWantDo = function () {
            var $c = this.$html.find("#wantDoCont");
            this.wantDos = new TravelB.CategoryTagger();
            var data = TravelB.TravelBUtils.getWantDoTaggerData();
            this.wantDos.create($c, "checkin", data, this.view.t("ActivitesEmptyText", "jsTravelB"));
        };
        CheckinWin.prototype.createWin = function (isEdit, type) {
            var _this = this;
            var btnTxt = isEdit ? this.view.t("UpdateCheckin", "jsTravelB") : this.view.t("Checkin", "jsTravelB");
            var context = { sumbitText: btnTxt };
            this.$html = $(this.checkinWindowDialog(context));
            this.initWantDo();
            Common.DropDown.registerDropDown(this.$html.find("#fromAge"));
            Common.DropDown.registerDropDown(this.$html.find("#toAge"));
            this.$html.find("#submitCheckin").click(function (e) {
                e.preventDefault();
                _this.view.hasFullReg(function () {
                    if (type === CheckinType.Now) {
                        _this.callNow(isEdit);
                    }
                    if (type === CheckinType.City) {
                        _this.callCity(isEdit);
                    }
                });
            });
        };
        CheckinWin.prototype.createWinNow = function () {
            var $d = $(this.dlgNow());
            this.$html.find("#dlgSpec").html($d);
            this.placeCombo = this.initPlaceDD("1,4", this.$html.find("#placeCombo"));
            Common.DropDown.registerDropDown(this.$html.find("#minsWaiting"));
        };
        CheckinWin.prototype.createWinCity = function () {
            var $d = $(this.dlgCity());
            this.$html.find("#dlgSpec").html($d);
            this.placeCombo = this.initPlaceDD("2", this.$html.find("#placeCombo"));
        };
        CheckinWin.prototype.initDatePickers = function (fromDate, toDate) {
            if (fromDate === void 0) { fromDate = null; }
            if (toDate === void 0) { toDate = null; }
            if (!fromDate) {
                fromDate = moment().add(2, "days");
            }
            if (!toDate) {
                toDate = moment().add(5, "days");
            }
            this.fdCal = new Common.MyCalendar(this.$html.find("#fromDateCont"), fromDate);
            this.tdCal = new Common.MyCalendar(this.$html.find("#toDateCont"), toDate);
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
        CheckinWin.prototype.callNow = function (isEdit) {
            var _this = this;
            if (!this.valids.isAllValid()) {
                var id = new Common.InfoDialog();
                id.create(this.view.t("InvalidMsgTitle", "jsTravelB"), this.view.t("InvalidMsgBody", "jsTravelB"));
                return;
            }
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.placeCombo.sourceId,
                waitingAtType: this.placeCombo.sourceType,
                waitingAtText: this.placeCombo.lastText,
                waitingCoord: this.placeCombo.coord,
                minsWaiting: $("#minsWaiting input").val(),
                checkinType: CheckinType.Now,
                id: this.editId
            });
            if (isEdit) {
                Views.ViewBase.currentView.apiPut("CheckinNow", data, function (r) {
                    _this.view.checkinMenu.hideWin();
                    _this.view.status.refresh();
                    _this.view.refreshMap();
                });
            }
            else {
                Views.ViewBase.currentView.apiPost("CheckinNow", data, function (r) {
                    _this.refreshStat();
                    _this.view.checkinMenu.hideWin();
                    _this.view.refreshMap();
                });
            }
        };
        CheckinWin.prototype.callCity = function (isEdit) {
            var _this = this;
            if (!this.valids.isAllValid()) {
                var id = new Common.InfoDialog();
                id.create(this.view.t("InvalidMsgTitle", "jsTravelB"), this.view.t("InvalidMsgBody", "jsTravelB"));
                return;
            }
            var fromDateTrans = TravelB.DateUtils.momentDateToMyDate(this.fdCal.date);
            var toDateTrans = TravelB.DateUtils.momentDateToMyDate(this.tdCal.date);
            if (this.fdCal.date.isAfter(this.tdCal.date)) {
                fromDateTrans = TravelB.DateUtils.momentDateToMyDate(this.tdCal.date);
                toDateTrans = TravelB.DateUtils.momentDateToMyDate(this.fdCal.date);
            }
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.placeCombo.sourceId,
                waitingAtType: this.placeCombo.sourceType,
                waitingAtText: this.placeCombo.lastText,
                waitingCoord: this.placeCombo.coord,
                fromDate: fromDateTrans,
                toDate: toDateTrans,
                checkinType: CheckinType.City,
                id: this.editId
            });
            if (isEdit) {
                Views.ViewBase.currentView.apiPut("CheckinCity", data, function (r) {
                    _this.view.checkinMenu.hideWin();
                });
            }
            else {
                Views.ViewBase.currentView.apiPost("CheckinCity", data, function (r) {
                    _this.view.checkinMenu.hideWin();
                });
            }
        };
        CheckinWin.prototype.refreshStat = function () {
            this.view.status.refresh();
        };
        CheckinWin.prototype.initPlaceDD = function (providers, $selObj) {
            var c = new Common.PlaceSearchConfig();
            c.providers = providers;
            c.selOjb = $selObj;
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            var combo = new Common.PlaceSearchBox(c);
            var loc = TravelB.UserLocation.currentLocation;
            if (loc) {
                combo.setCoordinates(loc.lat, loc.lng);
            }
            return combo;
        };
        CheckinWin.prototype.createValidations = function (type) {
            var $msg = this.$html.find("#chckMsg");
            this.valids = new TravelB.FormValidations();
            this.valids.valMessage($msg, $msg);
            this.valids.valWantDo(this.wantDos, this.$html.find("#wantDoCont .wantDosMain"));
            this.valids.valPlace(this.placeCombo, this.$html.find("#placeCombo"), this.$html.find("#placeCombo input"));
        };
        return CheckinWin;
    }());
    TravelB.CheckinWin = CheckinWin;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinWin.js.map