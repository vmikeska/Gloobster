var TravelB;
(function (TravelB) {
    (function (CheckinType) {
        CheckinType[CheckinType["Now"] = 0] = "Now";
        CheckinType[CheckinType["City"] = 1] = "City";
    })(TravelB.CheckinType || (TravelB.CheckinType = {}));
    var CheckinType = TravelB.CheckinType;
    var CheckinWin = (function () {
        function CheckinWin() {
            this.nowTabConst = "nowTab";
            this.futureTabConst = "futureTab";
            this.registerTemplates();
        }
        CheckinWin.prototype.showCityCheckin = function (editId) {
            var isEdit = (editId != null);
            if (isEdit) {
            }
            this.createWin(isEdit, CheckinType.City);
            this.createWinCity();
        };
        CheckinWin.prototype.showNowCheckin = function () {
            var _this = this;
            Views.ViewBase.currentView.apiGet("CheckinNow", [["me", "true"]], function (r) {
                var hasStatus = r !== null;
                _this.createWin(hasStatus, CheckinType.Now);
                _this.createWinNow();
                if (hasStatus) {
                    _this.selectRadio("wantDo", r.wantDo);
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
                }
            });
        };
        CheckinWin.prototype.initWantDo = function () {
            var items = TravelB.TravelBUtils.wantDoDB();
            var $c = this.$html.find("#wantDoCont");
            items.forEach(function (i) {
                var $h = $("<input id=\"wd_" + i.id + "\" type=\"checkbox\" /><label for=\"wd_" + i.id + "\">" + i.text + "</label>");
                $c.append($h);
            });
        };
        CheckinWin.prototype.createWin = function (edit, type) {
            var _this = this;
            $(".popup").remove();
            var btnTxt = edit ? "Update checkin" : "Checkin";
            var context = { sumbitText: btnTxt };
            this.$html = $(this.checkinWindowDialog(context));
            $("body").append(this.$html);
            this.$html.fadeIn();
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
                _this.$html.fadeOut();
                _this.$html.remove();
            });
            this.fillAgeCombo("fromAge");
            this.fillAgeCombo("toAge");
        };
        CheckinWin.prototype.createWinNow = function () {
            var $d = $(this.dlgNow());
            this.$html.find("#dlgSpec").html($d);
            this.wpCombo = this.initPlaceDD("1,4", this.$html.find("#waitingPlace"));
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
            $("input[name=" + group + "][value=" + val + "]").prop("checked", true);
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
                wantDo: this.getWantDos(),
                wantMeet: $('input[name=wantMeet]:checked').val(),
                multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
                fromAge: $("#fromAge input").val(),
                toAge: $("#toAge input").val()
            };
            return data;
        };
        CheckinWin.prototype.getWantDos = function () {
            var res = [];
            var items = $("#wantDoCont").children().toArray();
            items.forEach(function (i) {
                var $i = $(i);
                if ($i.prop("checked")) {
                    var id = $i.attr("id");
                    var val = id.split("_")[1];
                    res.push(val);
                }
            });
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
                minsWaiting: $("#minsWaiting").val()
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
                waitingCoord: this.wcCombo.coord,
                fromDate: $("#fromDate").data("myDate"),
                toDate: $("#toDate").data("myDate")
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