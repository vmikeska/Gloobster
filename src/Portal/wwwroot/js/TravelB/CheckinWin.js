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
                    _this.initDatePickers(r.fromDate, r.toDate);
                    var $msg = _this.$html.find("#chckMsg");
                    $msg.val(r.message);
                    _this.createValidations(CheckinType.City);
                });
            }
            else {
                this.createValidations(CheckinType.City);
            }
            if (!isEdit) {
                this.initDatePickers();
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
            this.wantDos.create($c, "checkin", data, "Pick activities you'd like to do");
        };
        CheckinWin.prototype.createWin = function (isEdit, type) {
            var _this = this;
            var btnTxt = isEdit ? "Update checkin" : "Checkin";
            var context = { sumbitText: btnTxt };
            this.$html = $(this.checkinWindowDialog(context));
            this.initWantDo();
            Common.DropDown.registerDropDown(this.$html.find("#fromAge"));
            Common.DropDown.registerDropDown(this.$html.find("#toAge"));
            this.$html.find("#submitCheckin").click(function (e) {
                e.preventDefault();
                if (type === CheckinType.Now) {
                    _this.callNow(isEdit);
                }
                if (type === CheckinType.City) {
                    _this.callCity(isEdit);
                }
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
                fromDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 2));
            }
            if (!toDate) {
                toDate = TravelB.DateUtils.jsDateToMyDate(TravelB.DateUtils.addDays(Date.now(), 5));
            }
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
        CheckinWin.prototype.callNow = function (isEdit) {
            var _this = this;
            if (!this.valids.isAllValid(CheckinType.Now)) {
                var id = new Common.InfoDialog();
                id.create("Validation message", "Some required fields are not filled out.");
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
                });
            }
            else {
                Views.ViewBase.currentView.apiPost("CheckinNow", data, function (r) {
                    _this.refreshStat();
                    _this.view.checkinMenu.hideWin();
                });
            }
        };
        CheckinWin.prototype.callCity = function (isEdit) {
            var _this = this;
            if (!this.valids.isAllValid(CheckinType.City)) {
                var id = new Common.InfoDialog();
                id.create("Validation message", "Some required fields are not filled out.");
                return;
            }
            var data = this.getRequestObj();
            data = $.extend(data, {
                waitingAtId: this.placeCombo.sourceId,
                waitingAtType: this.placeCombo.sourceType,
                waitingAtText: this.placeCombo.lastText,
                waitingCoord: this.placeCombo.coord,
                fromDate: $("#fromDate").data("myDate"),
                toDate: $("#toDate").data("myDate"),
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
        CheckinWin.prototype.createValidations = function (type) {
            var $msg = this.$html.find("#chckMsg");
            this.valids = new CheckinValidations();
            this.valids.valMessage($msg, $msg);
            this.valids.valWantDo(this.wantDos, this.$html.find("#wantDoCont .wantDosMain"));
            this.valids.valPlace(this.placeCombo, this.$html.find("#placeCombo input"));
            if (type === CheckinType.City) {
                this.valids.valCalendar($("#fromDate"), $("#toDate"), $("#fromDate"), $("#toDate"));
            }
        };
        return CheckinWin;
    }());
    TravelB.CheckinWin = CheckinWin;
    var CheckinValidations = (function () {
        function CheckinValidations() {
            this.isValid = false;
            this.ic = "invalid";
            this.messageValid = false;
            this.wantDoValid = false;
            this.placeValid = false;
            this.dateValid = false;
        }
        CheckinValidations.prototype.isAllValid = function (type) {
            var baseValid = this.messageValid && this.wantDoValid && this.placeValid;
            if (type === CheckinType.Now) {
                return baseValid;
            }
            return this.dateValid;
        };
        CheckinValidations.prototype.valCalendar = function ($fromDate, $toDate, $fromFrame, $toFrame) {
            var _this = this;
            this.valCalendarBody($fromDate, $toDate, $fromFrame, $toFrame);
            $fromDate.change(function (e) {
                _this.valCalendarBody($fromDate, $toDate, $fromFrame, $toFrame);
            });
        };
        CheckinValidations.prototype.valCalendarBody = function ($fromDate, $toDate, $fromFrame, $toFrame) {
            var fromDate = $fromDate.datepicker("getDate");
            var toDate = $toDate.datepicker("getDate");
            var rangeOk = toDate >= fromDate;
            this.visual(rangeOk, $fromFrame);
            this.visual(rangeOk, $toFrame);
            this.dateValid = rangeOk;
        };
        CheckinValidations.prototype.valPlace = function (box, $frame) {
            var _this = this;
            this.valPlaceBody(box, $frame);
            box.onPlaceSelected = function () {
                _this.valPlaceBody(box, $frame);
            };
        };
        CheckinValidations.prototype.valPlaceBody = function (box, $frame) {
            var isSelected = box.sourceId != undefined;
            this.visual(isSelected, $frame);
            this.placeValid = isSelected;
        };
        CheckinValidations.prototype.valWantDo = function (tagger, $frame) {
            var _this = this;
            this.valWantDoBody(tagger, $frame);
            tagger.onFilterChange = function () {
                _this.valWantDoBody(tagger, $frame);
            };
        };
        CheckinValidations.prototype.valWantDoBody = function (tagger, $frame) {
            var anySelected = tagger.getSelectedIds().length > 0;
            this.visual(anySelected, $frame);
            this.wantDoValid = anySelected;
        };
        CheckinValidations.prototype.valMessage = function ($txt, $frame) {
            var _this = this;
            this.valMessageBody($txt, $frame);
            var dc = new Common.DelayedCallback($txt);
            dc.callback = function (val) {
                _this.valMessageBody($txt, $frame);
            };
        };
        CheckinValidations.prototype.valMessageBody = function ($txt, $frame) {
            var val = $txt.val();
            var hasText = val.length > 0;
            this.visual(hasText, $frame);
            this.messageValid = hasText;
        };
        CheckinValidations.prototype.visual = function (isValid, $frame) {
            if (isValid) {
                $frame.removeClass(this.ic);
            }
            else {
                $frame.addClass(this.ic);
            }
        };
        return CheckinValidations;
    }());
    TravelB.CheckinValidations = CheckinValidations;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinWin.js.map