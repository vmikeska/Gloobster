var TravelDialog = (function () {
    function TravelDialog(dialogManager) {
        this.dialogManager = dialogManager;
    }
    TravelDialog.prototype.display = function () {
        var _this = this;
        this.dialogManager.closeDialog();
        this.dialogManager.getDialogData(TripEntityType.Travel, function (response) { return _this.create(response); });
    };
    TravelDialog.prototype.create = function (data) {
        this.data = data;
        var $rowCont = $("#" + data.id).parent();
        this.buildTemplate($rowCont);
        this.initTravelType(data.type);
        this.dialogManager.initDescription(data.description, TripEntityType.Travel);
        this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Travel);
        this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);
        this.initAirport(data.flightFrom, "airportFrom", "flightFrom");
        this.initAirport(data.flightTo, "airportTo", "flightTo");
        this.initDatePicker("leavingDate", "leavingDateTime", data.leavingDateTime);
        this.initDatePicker("arrivingDate", "arrivingDateTime", data.arrivingDateTime);
        this.initTimePicker("leavingHours", "leavingMinutes", "leavingDateTime", data.leavingDateTime);
        this.initTimePicker("arrivingHours", "arrivingMinutes", "arrivingDateTime", data.arrivingDateTime);
    };
    TravelDialog.prototype.initTimePicker = function (hrsElementId, minElementId, propName, curDateStr) {
        var _this = this;
        var $hrs = $("#" + hrsElementId);
        var $min = $("#" + minElementId);
        if (curDateStr) {
            var utcTime = Utils.dateStringToUtcDate(curDateStr);
            $hrs.val(utcTime.getUTCHours());
            $min.val(utcTime.getUTCMinutes());
        }
        var dHrs = new DelayedCallback($hrs);
        dHrs.callback = function () { _this.onTimeChanged($hrs, $min, propName); };
        $hrs.change(function () { _this.onTimeChanged($hrs, $min, propName); });
        var mHrs = new DelayedCallback($min);
        mHrs.callback = function () { _this.onTimeChanged($hrs, $min, propName); };
        $min.change(function () { _this.onTimeChanged($hrs, $min, propName); });
    };
    TravelDialog.prototype.onTimeChanged = function ($hrs, $min, propName) {
        var hrs = $hrs.val();
        if (hrs === "") {
            hrs = "0";
        }
        var min = $min.val();
        if (min === "") {
            min = "0";
        }
        var time = { hour: hrs, minute: min };
        this.updateDateTime(null, time, propName);
    };
    TravelDialog.prototype.initDatePicker = function (elementId, propertyName, curDateStr) {
        var _this = this;
        var dpConfig = this.datePickerConfig();
        var $datePicker = $("#" + elementId);
        $datePicker.datepicker(dpConfig);
        if (curDateStr) {
            var utcTime = Utils.dateStringToUtcDate(curDateStr);
            $datePicker.datepicker("setDate", utcTime);
        }
        $datePicker.change(function (e) {
            var $this = $(e.target);
            var date = $this.datepicker("getDate");
            var datePrms = _this.getDatePrms(date);
            _this.updateDateTime(datePrms, null, propertyName);
            var travel = _this.dialogManager.planner.placesMgr.getTravelById(_this.data.id);
            var placeId = elementId === "arrivingDate" ? travel.to.id : travel.from.id;
            var utcDate = Utils.dateToUtcDate(date);
            _this.dialogManager.planner.updateRibbonDate(placeId, elementId, utcDate);
        });
    };
    TravelDialog.prototype.getDatePrms = function (date) {
        var datePrms = {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate() + 1
        };
        if (datePrms.day === 32) {
            datePrms.day = 1;
            datePrms.month = datePrms.month + 1;
        }
        return datePrms;
    };
    TravelDialog.prototype.updateDateTime = function (date, time, propName) {
        var fullDateTime = {};
        if (date) {
            fullDateTime = $.extend(fullDateTime, date);
        }
        if (time) {
            fullDateTime = $.extend(fullDateTime, time);
        }
        var data = this.dialogManager.getPropRequest(propName, fullDateTime);
        this.dialogManager.updateProp(data, function (response) { });
    };
    TravelDialog.prototype.datePickerConfig = function () {
        return {
            dateFormat: "dd.mm.yy"
        };
    };
    TravelDialog.prototype.initAirport = function (flight, comboId, propName) {
        var _this = this;
        var airportFrom = new AirportCombo(comboId);
        airportFrom.onSelected = function (evntData) {
            var data = _this.dialogManager.getPropRequest(propName, {
                id: evntData.id,
                name: evntData.name
            });
            _this.dialogManager.updateProp(data, function (response) { });
        };
        if (flight) {
            airportFrom.setText(flight.selectedName);
        }
    };
    TravelDialog.prototype.initTravelType = function (initTravelType) {
        var _this = this;
        this.showHideTravelDetails(initTravelType);
        var $combo = $("#travelType");
        var $input = $combo.find("input");
        $input.val(initTravelType);
        var $initIcon = $combo.find("li[data-value='" + initTravelType + "']");
        var cls = $initIcon.data("cls");
        var cap = $initIcon.data("cap");
        $combo.find(".selected").html("<span class=\"" + cls + " black left mright5\"></span>" + cap);
        $combo.find("li").click(function (evnt) {
            var travelType = $(evnt.target).data("value");
            _this.showHideTravelDetails(travelType);
            var data = _this.dialogManager.getPropRequest("travelType", { travelType: travelType });
            _this.dialogManager.updateProp(data, function (response) {
                var $currentIcon = $combo.find("li[data-value='" + travelType + "']");
                var currentCls = $currentIcon.data("cls");
                $(".active").children().first().attr("class", currentCls);
            });
        });
    };
    TravelDialog.prototype.showHideTravelDetails = function (travelType) {
        var $flightDetails = $("#flightDetails");
        $flightDetails.hide();
        if (travelType === TravelType.Plane) {
            $flightDetails.show();
        }
    };
    TravelDialog.prototype.buildTemplate = function ($row) {
        var html = this.dialogManager.travelDetailTemplate();
        var $html = $(html);
        this.dialogManager.regClose($html);
        $row.after($html);
    };
    return TravelDialog;
})();
//# sourceMappingURL=TravelDialog.js.map