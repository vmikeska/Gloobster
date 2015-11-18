var Planner = (function () {
    function Planner(trip) {
        this.$currentContainer = $("#plannerCont1");
        this.lastRowNo = 1;
        this.placesPerRow = 4;
        this.contBaseName = "plannerCont";
        this.inverseColor = false;
        this.dialogManager = new DialogManager(this);
        this.placeDialog = new PlaceDialog(this.dialogManager);
        this.travelDialog = new TravelDialog(this.dialogManager);
        this.trip = trip;
        this.registerTemplates();
        this.placesMgr = new PlacesManager(trip.id);
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
        this.addPlaceTemplate = Views.ViewBase.currentView.registerTemplate("addPlace-template");
        this.travelTemplate = Views.ViewBase.currentView.registerTemplate("travel-template");
        this.placeTemplate = Views.ViewBase.currentView.registerTemplate("place-template");
    };
    Planner.prototype.addEnd = function () {
        var _this = this;
        this.dialogManager.closeDialog();
        this.dialogManager.deactivate();
        var lastPlace = this.placesMgr.getLastPlace();
        var data = { selectorId: lastPlace.id, position: NewPlacePosition.ToRight, tripId: this.trip.tripId };
        Views.ViewBase.currentView.apiPost("tripPlanner", data, function (response) {
            var t = _this.placesMgr.mapTravel(response.travel, lastPlace, null);
            lastPlace.leaving = t;
            _this.placesMgr.travels.push(t);
            var p = _this.placesMgr.mapPlace(response.place, t, null);
            t.to = p;
            _this.placesMgr.places.push(p);
            _this.manageRows(_this.placesMgr.places.length);
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
//# sourceMappingURL=Planner.js.map