var Trip;
(function (Trip) {
    var PlaceTravelTime = (function () {
        function PlaceTravelTime(dialogManager, data) {
            this.mainTmp = Views.ViewBase.currentView.registerTemplate("placeTravelTime-template");
            this.dialogManager = dialogManager;
            this.data = data;
        }
        PlaceTravelTime.prototype.create = function (type) {
            var _this = this;
            var context = {};
            var v = Views.ViewBase.currentView;
            if (type === TripEntityType.Travel) {
                context = {
                    infoTxt: v.t("HowLongTakesTravel", "jsTrip"),
                    dir1: "leaving",
                    dir2: "arriving",
                    showLeft: true,
                    showMiddle: true,
                    showRight: true
                };
                this.$html = $(this.mainTmp(context));
                var travel = this.dialogManager.planner.placesMgr.getTravelById(this.data.id);
                this.initDatePicker("leavingDate", this.data.leavingDateTime, function (datePrms, date) {
                    _this.updateDateTime(datePrms, null, "leavingDateTime");
                    var placeId = travel.from.id;
                    _this.ribbonUpdate(placeId, date, "leavingDate");
                });
                this.initDatePicker("arrivingDate", this.data.arrivingDateTime, function (datePrms, date) {
                    _this.updateDateTime(datePrms, null, "arrivingDateTime");
                    var placeId = travel.to.id;
                    _this.ribbonUpdate(placeId, date, "arrivingDate");
                });
                this.initTimePicker("arrivingHours", "arrivingMinutes", "arrivingDateTime", this.data.arrivingDateTime);
                this.initTimePicker("leavingHours", "leavingMinutes", "leavingDateTime", this.data.leavingDateTime);
            }
            if (type === TripEntityType.Place) {
                var showLeft = (this.data.arrivingDateTime != null);
                var showRight = (this.data.leavingDateTime != null);
                var isComplete = showLeft && showRight;
                var infoTxt = this.getInfoText(isComplete, showLeft, showRight);
                context = {
                    infoTxt: infoTxt,
                    dir1: "arriving",
                    dir2: "leaving",
                    showLeft: showLeft,
                    showMiddle: isComplete,
                    showRight: showRight
                };
                this.$html = $(this.mainTmp(context));
                if (showRight) {
                    this.initDatePicker("leavingDate", this.data.leavingDateTime, function (datePrms, date) {
                        _this.updateDateTime(datePrms, null, "leavingDateTime", _this.data.leavingId);
                        _this.ribbonUpdate(_this.data.id, date, "leavingDate");
                    });
                    this.initTimePicker("leavingHours", "leavingMinutes", "leavingDateTime", this.data.leavingDateTime, this.data.leavingId);
                }
                if (showLeft) {
                    this.initDatePicker("arrivingDate", this.data.arrivingDateTime, function (datePrms, date) {
                        _this.updateDateTime(datePrms, null, "arrivingDateTime", _this.data.arrivingId);
                        _this.ribbonUpdate(_this.data.id, date, "arrivingDate");
                    });
                    this.initTimePicker("arrivingHours", "arrivingMinutes", "arrivingDateTime", this.data.arrivingDateTime, this.data.arrivingId);
                }
            }
            this.setUseTime(type);
            return this.$html;
        };
        PlaceTravelTime.prototype.setUseTime = function (type) {
            var _this = this;
            var $tv = this.$html.find("#timeVis");
            $tv.prop("checked", this.data.useTime);
            this.visibilityTime(this.data.useTime);
            $tv.change(function (e) {
                var state = $tv.prop("checked");
                var data = _this.dialogManager.getPropRequest("useTime", { state: state, entityType: type });
                _this.dialogManager.updateProp(data, function (response) {
                });
                _this.visibilityTime(state);
            });
        };
        PlaceTravelTime.prototype.getInfoText = function (isComplete, showLeft, showRight) {
            var v = Views.ViewBase.currentView;
            var infoTxt = "";
            if (isComplete) {
                infoTxt = v.t("HowLongStaying", "jsTrip");
            }
            else if (showLeft) {
                infoTxt = v.t("WhenArrive", "jsTrip");
            }
            else if (showRight) {
                infoTxt = v.t("WhenStartJourney", "jsTrip");
            }
            return infoTxt;
        };
        PlaceTravelTime.prototype.visibilityTime = function (visible) {
            var $t = this.$html.find(".time");
            if (visible) {
                $t.show();
            }
            else {
                $t.hide();
            }
        };
        PlaceTravelTime.prototype.initTimePicker = function (hrsElementId, minElementId, propName, curDateStr, customEntityId) {
            var _this = this;
            if (customEntityId === void 0) { customEntityId = null; }
            var $hrs = this.$html.find("#" + hrsElementId);
            var $min = this.$html.find("#" + minElementId);
            if (curDateStr) {
                var utcTime = Trip.Utils.dateStringToUtcDate(curDateStr);
                $hrs.val(utcTime.getHours());
                $min.val(utcTime.getMinutes());
            }
            var dHrs = new Common.DelayedCallback($hrs);
            dHrs.callback = function () { _this.onTimeChanged($hrs, $min, propName, customEntityId); };
            $hrs.change(function () { _this.onTimeChanged($hrs, $min, propName, customEntityId); });
            var mHrs = new Common.DelayedCallback($min);
            mHrs.callback = function () { _this.onTimeChanged($hrs, $min, propName, customEntityId); };
            $min.change(function () { _this.onTimeChanged($hrs, $min, propName, customEntityId); });
        };
        PlaceTravelTime.prototype.initDatePicker = function (elementId, curDateStr, onChange) {
            var _this = this;
            var utc = curDateStr ? moment.utc(curDateStr) : moment.utc();
            var $dpCont = this.$html.find("#" + elementId);
            var dp = new Common.MyCalendar($dpCont, utc);
            dp.onChange = function (date) {
                var datePrms = _this.getDatePrms(date);
                onChange(datePrms, date);
            };
        };
        PlaceTravelTime.prototype.ribbonUpdate = function (placeId, date, cssClass) {
            this.dialogManager.planner.updateRibbonDate(placeId, cssClass, date);
        };
        PlaceTravelTime.prototype.getDatePrms = function (date) {
            var datePrms = {
                year: date.year(),
                month: date.month() + 1,
                day: date.date()
            };
            return datePrms;
        };
        PlaceTravelTime.prototype.updateDateTime = function (date, time, propName, customEntityId) {
            if (customEntityId === void 0) { customEntityId = null; }
            var fullDateTime = {};
            if (date) {
                fullDateTime = $.extend(fullDateTime, date);
            }
            if (time) {
                fullDateTime = $.extend(fullDateTime, time);
            }
            var data = this.dialogManager.getPropRequest(propName, fullDateTime);
            if (customEntityId != null) {
                data.values.entityId = customEntityId;
            }
            this.dialogManager.updateProp(data, function (response) { });
        };
        PlaceTravelTime.prototype.onTimeChanged = function ($hrs, $min, propName, customEntityId) {
            if (customEntityId === void 0) { customEntityId = null; }
            var hrs = $hrs.val();
            if (hrs === "") {
                hrs = "0";
            }
            var min = $min.val();
            if (min === "") {
                min = "0";
            }
            var time = { hour: hrs, minute: min };
            this.updateDateTime(null, time, propName, customEntityId);
        };
        return PlaceTravelTime;
    }());
    Trip.PlaceTravelTime = PlaceTravelTime;
})(Trip || (Trip = {}));
//# sourceMappingURL=PlaceTravelTime.js.map