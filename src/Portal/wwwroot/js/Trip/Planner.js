var DialogManager = (function () {
    function DialogManager(owner, planner) {
        this.owner = owner;
        this.planner = planner;
        this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");
        this.travelDetailTemplate = this.owner.registerTemplate("travelDetail-template");
        this.visitedItemTemplate = this.owner.registerTemplate("visitItem-template");
    }
    DialogManager.prototype.createFilesInstance = function (entityId, entityType) {
        var filesConfig = new FilesConfig();
        filesConfig.containerId = "entityDocs";
        filesConfig.inputId = "entityFileInput";
        filesConfig.templateId = "fileItem-template";
        filesConfig.editable = true;
        filesConfig.addAdder = true;
        filesConfig.entityId = entityId;
        var customData = new TripFileCustom();
        customData.tripId = this.planner.trip.tripId;
        customData.entityId = entityId;
        customData.entityType = entityType;
        var files = new Files(this.owner, filesConfig);
        files.fileUpload.customConfig = customData;
        return files;
    };
    DialogManager.prototype.initDescription = function (text, entityType) {
        var _this = this;
        $("#dialogDescription").val(text);
        var d = new DelayedCallback("dialogDescription");
        d.callback = function (description) {
            var data = _this.getPropRequest("description", {
                entityType: entityType,
                description: description
            });
            _this.owner.apiPut("TripPlannerProperty", data, function () {
            });
        };
    };
    DialogManager.prototype.getDialogData = function (dialogType, callback) {
        var prms = [["dialogType", dialogType], ["tripId", this.planner.trip.tripId], ["id", this.selectedId]];
        this.owner.apiGet("TripPlannerProperty", prms, function (response) {
            callback(response);
        });
    };
    DialogManager.prototype.closeDialog = function () {
        $(".daybyday-form").remove();
    };
    DialogManager.prototype.regClose = function ($html) {
        var _this = this;
        $html.find(".close").click(function (e) {
            e.preventDefault();
            _this.closeDialog();
            _this.deactivate();
        });
    };
    DialogManager.prototype.deactivate = function () {
        $(".destination.active").removeClass("active");
        var $trans = $(".transport.active");
        $trans.removeClass("active");
        $trans.find(".tab").remove();
    };
    DialogManager.prototype.getPropRequest = function (propName, customValues) {
        var data = {
            propertyName: propName,
            values: {
                tripId: this.planner.trip.tripId,
                entityId: this.selectedId
            }
        };
        data.values = $.extend(data.values, customValues);
        return data;
    };
    return DialogManager;
})();
var PlaceDialog = (function () {
    function PlaceDialog(dialogManager) {
        this.dialogManager = dialogManager;
    }
    PlaceDialog.prototype.display = function () {
        var _this = this;
        this.dialogManager.closeDialog();
        this.dialogManager.getDialogData(TripEntityType.Place, function (response) { return _this.create(response); });
    };
    PlaceDialog.prototype.create = function (data) {
        var _this = this;
        var $rowCont = $("#" + data.id).parent();
        this.buildTemplate($rowCont);
        this.createNameSearch(data);
        $("#stayAddress").val(data.addressText);
        this.createAddressSearch(data);
        this.createPlaceToVisitSearch(data);
        this.dialogManager.initDescription(data.description, TripEntityType.Place);
        if (data.wantVisit) {
            data.wantVisit.forEach(function (place) {
                _this.addPlaceToVisit(place.id, place.selectedName, place.sourceType);
            });
        }
        this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Place);
        this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId);
    };
    PlaceDialog.prototype.createNameSearch = function (data) {
        var _this = this;
        var c = new PlaceSearchConfig();
        c.owner = this.dialogManager.owner;
        c.providers = "0,1,2,3";
        c.elementId = "cities";
        c.minCharsToSearch = 1;
        c.clearAfterSearch = false;
        this.placeSearch = new PlaceSearchBox(c);
        this.placeSearch.onPlaceSelected = function (req, place) { return _this.onPlaceSelected(req, place); };
        if (data.place) {
            this.placeSearch.setText(data.place.selectedName);
        }
    };
    PlaceDialog.prototype.createPlaceToVisitSearch = function (data) {
        var _this = this;
        var c = new PlaceSearchConfig();
        c.owner = this.dialogManager.owner;
        c.providers = "1,0";
        c.elementId = "placeToVisit";
        c.minCharsToSearch = 1;
        c.clearAfterSearch = true;
        this.placeToVisitSearch = new PlaceSearchBox(c);
        this.placeToVisitSearch.onPlaceSelected = function (req, place) { return _this.onPlaceToVisitSelected(req, place); };
        if (data.place && data.place.coordinates) {
            this.placeToVisitSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
        }
    };
    PlaceDialog.prototype.createAddressSearch = function (data) {
        var _this = this;
        var c = new PlaceSearchConfig();
        c.owner = this.dialogManager.owner;
        c.providers = "1,0";
        c.elementId = "stayPlace";
        c.minCharsToSearch = 1;
        c.clearAfterSearch = false;
        c.customSelectedFormat = function (place) {
            return place.Name;
        };
        this.addressSearch = new PlaceSearchBox(c);
        this.addressSearch.onPlaceSelected = function (req, place) { return _this.onAddressSelected(req, place); };
        var addressName = "";
        if (data.address) {
            addressName = data.address.selectedName;
        }
        this.addressSearch.setText(addressName);
        if (data.place && data.place.coordinates) {
            this.addressSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
        }
    };
    PlaceDialog.prototype.buildTemplate = function ($row) {
        var html = this.dialogManager.placeDetailTemplate();
        var $html = $(html);
        this.dialogManager.regClose($html);
        $row.after($html);
    };
    PlaceDialog.prototype.onPlaceToVisitSelected = function (req, place) {
        var _this = this;
        var data = this.dialogManager.getPropRequest("placeToVisit", {
            sourceId: req.SourceId,
            sourceType: req.SourceType,
            selectedName: place.Name
        });
        this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) {
            var id = response.Result;
            _this.addPlaceToVisit(id, place.Name, req.SourceType);
        });
    };
    PlaceDialog.prototype.onAddressSelected = function (req, place) {
        $("#stayAddress").val(place.Address);
        var data = this.dialogManager.getPropRequest("address", {
            sourceId: req.SourceId,
            sourceType: req.SourceType,
            selectedName: place.Name,
            address: place.Address,
            lat: place.Coordinates.Lat,
            lng: place.Coordinates.Lng
        });
        this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) {
        });
    };
    PlaceDialog.prototype.onPlaceSelected = function (req, place) {
        this.addressSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);
        this.placeToVisitSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);
        var name = place.City + ", " + place.CountryCode;
        $(".active .name").text(name);
        var data = this.dialogManager.getPropRequest("place", {
            sourceId: req.SourceId,
            sourceType: req.SourceType,
            selectedName: name,
            lat: place.Coordinates.Lat,
            lng: place.Coordinates.Lng
        });
        this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) {
        });
    };
    PlaceDialog.prototype.addPlaceToVisit = function (id, name, sourceType) {
        var _this = this;
        var self = this;
        var iconClass = this.getIcon(sourceType);
        var context = { id: id, icon: iconClass, name: name };
        var html = this.dialogManager.visitedItemTemplate(context);
        var $html = $(html);
        $html.find(".delete").click(function (e) {
            e.preventDefault();
            var $item = $(e.target);
            var data = _this.dialogManager.getPropRequest("placeToVisitRemove", {
                id: $item.parent().data("id")
            });
            self.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) { });
            $html.remove();
        });
        $("#placeToVisit").before($html);
    };
    PlaceDialog.prototype.getIcon = function (sourceType) {
        switch (sourceType) {
            case SourceType.FB:
                return "icon-facebook";
            //case SourceType.City:
            // return "icon-city";
            //case SourceType.Country:
            // return "icon-country";
            case SourceType.S4:
                return "icon-foursquare";
        }
        return "";
    };
    return PlaceDialog;
})();
var AirportCombo = (function () {
    function AirportCombo(comboId) {
        this.limit = 10;
        this.$combo = $("#" + comboId);
        this.$cont = this.$combo.find("ul");
        this.$input = this.$combo.find("input");
        this.registerInput();
        this.registerInOut();
    }
    AirportCombo.prototype.setText = function (text) {
        this.lastText = text;
        this.$input.val(text);
    };
    AirportCombo.prototype.registerInOut = function () {
        var _this = this;
        this.$input.focus(function (e) {
            $(e.target).val("");
        });
        this.$input.focusout(function () {
            _this.setText(_this.lastText);
        });
    };
    AirportCombo.prototype.registerInput = function () {
        var _this = this;
        var d = new DelayedCallback(this.$input);
        d.callback = function (str) {
            var data = [["query", str], ["limit", _this.limit]];
            Views.ViewBase.currentView.apiGet("airport", data, function (items) { return _this.onResult(items); });
        };
    };
    AirportCombo.prototype.onResult = function (items) {
        this.displayResults(items);
    };
    AirportCombo.prototype.displayResults = function (items) {
        var _this = this;
        if (!items) {
            return;
        }
        this.$cont.html("");
        items.forEach(function (item) {
            var itemHtml = _this.getItemHtml(item);
            _this.$cont.append(itemHtml);
        });
        this.registerClick();
    };
    AirportCombo.prototype.registerClick = function () {
        var _this = this;
        this.$cont.find("li").click(function (evnt) {
            var $t = $(evnt.target);
            _this.onClick($t);
        });
    };
    AirportCombo.prototype.onClick = function ($item) {
        var selName = $item.data("value");
        var selId = $item.data("id");
        this.$input.val(selName);
        this.$cont.html("");
        var data = { id: selId, name: selName };
        this.onSelected(data);
    };
    AirportCombo.prototype.getItemHtml = function (item) {
        var code = item.iataFaa;
        if (code === "") {
            code = item.icao;
        }
        var displayName = item.name + " (" + item.city + ")";
        var displayNameSel = item.city + " (" + code + ")";
        return "<li data-value=\"" + displayNameSel + "\" data-id=\"" + item.id + "\">" + displayName + "<span class=\"color2\">\u2022 " + code + "</span></li>";
    };
    return AirportCombo;
})();
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
        Views.ViewBase.currentView.apiPut("tripPlannerProperty", data, function (response) {
        });
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
            _this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) { });
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
            _this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) {
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
var Utils = (function () {
    function Utils() {
    }
    Utils.dateStringToUtcDate = function (dateStr) {
        var dateLocal = new Date(Date.parse(dateStr));
        var userOffset = dateLocal.getTimezoneOffset() * 60000;
        var utcTime = new Date(dateLocal.getTime() + userOffset);
        return utcTime;
    };
    Utils.dateToUtcDate = function (dateLocal) {
        var userOffset = dateLocal.getTimezoneOffset() * 60000;
        var localUtcTime = new Date(dateLocal.getTime() - userOffset);
        var utcDate = new Date(Date.UTC(localUtcTime.getUTCFullYear(), localUtcTime.getUTCMonth(), localUtcTime.getUTCDate()));
        return utcDate;
    };
    return Utils;
})();
var Planner = (function () {
    function Planner(owner, trip) {
        this.$currentContainer = $("#plannerCont1");
        this.lastRowNo = 1;
        this.placesPerRow = 4;
        this.contBaseName = "plannerCont";
        this.inverseColor = false;
        this.owner = owner;
        this.dialogManager = new DialogManager(owner, this);
        this.placeDialog = new PlaceDialog(this.dialogManager);
        this.travelDialog = new TravelDialog(this.dialogManager);
        this.trip = trip;
        this.registerTemplates();
        this.placesMgr = new PlacesManager(trip.id, owner);
        this.placesMgr.setData(trip.travels, trip.places);
        this.redrawAll();
    }
    Planner.prototype.redrawAll = function () {
        var _this = this;
        var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");
        var placeCount = 0;
        orderedPlaces.forEach(function (place) {
            placeCount++;
            _this.manageRows(placeCount);
            _this.addPlace(place, _this.inverseColor);
            if (place.leaving) {
                var travel = place.leaving;
                _this.addTravel(travel, _this.inverseColor);
            }
            _this.inverseColor = !_this.inverseColor;
        });
        this.addAdder();
    };
    Planner.prototype.manageRows = function (placeCount) {
        var currentRow = Math.floor(placeCount / this.placesPerRow);
        var rest = placeCount % this.placesPerRow;
        if (rest > 0) {
            currentRow++;
        }
        if (currentRow > this.lastRowNo) {
            this.addRowContainer();
            if (this.$lastCell) {
                this.$lastCell.appendTo(this.$currentContainer);
            }
        }
    };
    Planner.prototype.addRowContainer = function () {
        var newRowNo = this.lastRowNo + 1;
        var newRowId = this.contBaseName + newRowNo;
        var html = "<div id=\"" + newRowId + "\" class=\"daybyday table margin\"></div>";
        var $html = $(html);
        this.$currentContainer.after($html);
        this.$currentContainer = $html;
        this.lastRowNo = newRowNo;
    };
    Planner.prototype.addAdder = function () {
        var _this = this;
        var html = this.addPlaceTemplate();
        this.$currentContainer.append(html);
        this.$adder = $("#addPlace");
        this.$lastCell = $("#lastCell");
        this.$adder.click(function (e) {
            e.preventDefault();
            _this.addEnd();
        });
    };
    Planner.prototype.registerTemplates = function () {
        this.addPlaceTemplate = this.owner.registerTemplate("addPlace-template");
        this.travelTemplate = this.owner.registerTemplate("travel-template");
        this.placeTemplate = this.owner.registerTemplate("place-template");
    };
    Planner.prototype.addEnd = function () {
        var _this = this;
        this.dialogManager.closeDialog();
        this.dialogManager.deactivate();
        var lastPlace = this.placesMgr.getLastPlace();
        var data = { selectorId: lastPlace.id, position: NewPlacePosition.ToRight, tripId: this.trip.tripId };
        this.owner.apiPost("tripPlanner", data, function (response) {
            var t = _this.placesMgr.mapTravel(response.travel, lastPlace, null);
            lastPlace.leaving = t;
            _this.placesMgr.travels.push(t);
            var p = _this.placesMgr.mapPlace(response.place, t, null);
            t.to = p;
            _this.placesMgr.places.push(p);
            _this.manageRows(_this.placesMgr.places.length);
            //$("#" + lastPlace.id).find(".leaving").text(this.formatShortDateTime(t.leavingDateTime));
            _this.updateRibbonDate(lastPlace.id, "leavingDate", t.leavingDateTime);
            _this.addTravel(t, !_this.inverseColor);
            _this.addPlace(p, _this.inverseColor);
            _this.inverseColor = !_this.inverseColor;
            _this.dialogManager.selectedId = response.place.id;
        });
    };
    Planner.prototype.updateRibbonDate = function (placeId, livingArriving, date) {
        $("#" + placeId).find("." + livingArriving).text(this.formatShortDateTime(date));
    };
    Planner.prototype.getTravelIcon = function (travelType) {
        switch (travelType) {
            case TravelType.Bus:
                return "icon-car";
            case TravelType.Car:
                return "icon-car";
            case TravelType.Plane:
                return "icon-plane";
            case TravelType.Ship:
                return "icon-boat";
            case TravelType.Walk:
                return "icon-walk";
            case TravelType.Bike:
                return "icon-bike";
            case TravelType.Train:
                return "icon-train";
            default:
                return "";
        }
    };
    Planner.prototype.addTravel = function (travel, inverseColor) {
        var _this = this;
        var context = {
            id: travel.id,
            icon: this.getTravelIcon(travel.type),
            colorClass: ""
        };
        if (inverseColor) {
            context.colorClass = "";
        }
        else {
            context.colorClass = "green";
        }
        var html = this.travelTemplate(context);
        var $html = $(html);
        $html.find(".transport").click("*", function (e) {
            var $elem = $(e.delegateTarget);
            _this.setActiveTravel($elem);
        });
        this.appendToTimeline($html);
    };
    Planner.prototype.appendToTimeline = function ($html) {
        if (this.$adder) {
            this.$lastCell.before($html);
        }
        else {
            this.$currentContainer.append($html);
        }
    };
    Planner.prototype.setActiveTravel = function ($elem) {
        this.dialogManager.deactivate();
        $elem.addClass("active");
        $elem.append($('<span class="tab"></span>'));
        this.dialogManager.selectedId = $elem.parent().attr("id");
        this.travelDialog.display();
    };
    Planner.prototype.addPlace = function (place, inverseColor) {
        var self = this;
        var name = "Empty";
        if (place.place) {
            name = place.place.selectedName;
        }
        var context = {
            id: place.id,
            isActive: false,
            name: name,
            arrivingDate: "",
            leavingDate: "",
            arrivalDateLong: "",
            rowNo: this.lastRowNo,
            isFirstDay: (place.arriving == null),
            colorClassArriving: "",
            colorClassLeaving: ""
        };
        if (place.arriving != null) {
            var da = place.arriving.arrivingDateTime;
            context.arrivingDate = this.formatShortDateTime(da);
            context.arrivalDateLong = this.formatShortDateTime(da) + ("" + da.getUTCFullYear());
        }
        if (place.leaving != null) {
            var dl = place.leaving.leavingDateTime;
            context.leavingDate = this.formatShortDateTime(dl);
        }
        if (inverseColor) {
            context.colorClassArriving = "green";
            context.colorClassLeaving = "";
        }
        else {
            context.colorClassArriving = "";
            context.colorClassLeaving = "green";
        }
        var html = this.placeTemplate(context);
        var $html = $(html);
        $html.find(".destination").click("*", function (e) {
            self.dialogManager.deactivate();
            var $elem = $(e.delegateTarget);
            $elem.addClass("active");
            self.dialogManager.selectedId = $elem.parent().attr("id");
            self.placeDialog.display();
        });
        this.appendToTimeline($html);
    };
    Planner.prototype.formatShortDateTime = function (dt) {
        return dt.getUTCDate() + "." + (dt.getUTCMonth() + 1) + ".";
    };
    return Planner;
})();
var PlacesManager = (function () {
    function PlacesManager(tripId, owner) {
        this.places = [];
        this.travels = [];
        this.owner = owner;
        this.tripId = tripId;
    }
    PlacesManager.prototype.mapTravel = function (resp, from, to) {
        var t = new Travel();
        t.id = resp.id;
        t.type = resp.type;
        t.arrivingDateTime = Utils.dateStringToUtcDate(resp.arrivingDateTime);
        t.leavingDateTime = Utils.dateStringToUtcDate(resp.leavingDateTime);
        t.from = from;
        t.to = to;
        return t;
    };
    PlacesManager.prototype.mapPlace = function (resp, arriving, leaving) {
        var p = new Place();
        p.id = resp.id;
        p.orderNo = resp.orderNo;
        p.place = resp.place;
        p.arriving = arriving;
        p.leaving = leaving;
        return p;
    };
    PlacesManager.prototype.setData = function (travels, places) {
        var _this = this;
        places.forEach(function (place) {
            var p = _this.mapPlace(place, null, null);
            if (place.arrivingId) {
                p.arriving = _this.getOrCreateTravelById(place.arrivingId, travels);
                p.arriving.to = p;
            }
            if (place.leavingId) {
                p.leaving = _this.getOrCreateTravelById(place.leavingId, travels);
                p.leaving.from = p;
            }
            _this.places.push(p);
        });
    };
    PlacesManager.prototype.getOrCreateTravelById = function (travelId, travelsInput) {
        var cachedTravel = _.find(this.travels, function (travel) {
            return travel.id === travelId;
        });
        if (cachedTravel) {
            return cachedTravel;
        }
        var newTravel = _.find(travelsInput, function (travel) {
            return travel.id === travelId;
        });
        var newTravelObj = this.mapTravel(newTravel, null, null);
        this.travels.push(newTravelObj);
        return newTravelObj;
    };
    PlacesManager.prototype.getTravelById = function (id) {
        return _.find(this.travels, function (travel) { return travel.id === id; });
    };
    PlacesManager.prototype.getLastPlace = function () {
        var lastPlace = _.max(this.places, function (place) { return place.orderNo; });
        return lastPlace;
    };
    return PlacesManager;
})();
var NewPlacePosition;
(function (NewPlacePosition) {
    NewPlacePosition[NewPlacePosition["ToLeft"] = 0] = "ToLeft";
    NewPlacePosition[NewPlacePosition["ToRight"] = 1] = "ToRight";
})(NewPlacePosition || (NewPlacePosition = {}));
var TravelType;
(function (TravelType) {
    TravelType[TravelType["Walk"] = 0] = "Walk";
    TravelType[TravelType["Plane"] = 1] = "Plane";
    TravelType[TravelType["Car"] = 2] = "Car";
    TravelType[TravelType["Bus"] = 3] = "Bus";
    TravelType[TravelType["Train"] = 4] = "Train";
    TravelType[TravelType["Ship"] = 5] = "Ship";
    TravelType[TravelType["Bike"] = 6] = "Bike";
})(TravelType || (TravelType = {}));
var Place = (function () {
    function Place() {
    }
    return Place;
})();
var PlaceLocation = (function () {
    function PlaceLocation() {
    }
    return PlaceLocation;
})();
var Travel = (function () {
    function Travel() {
    }
    return Travel;
})();
//# sourceMappingURL=Planner.js.map