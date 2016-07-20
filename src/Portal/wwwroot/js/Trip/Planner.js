var Trip;
(function (Trip) {
    var Planner = (function () {
        function Planner(trip, editable) {
            this.$currentContainer = $("#plannerCont1");
            this.lastRowNo = 1;
            this.placesPerRow = 3;
            this.contBaseName = "plannerCont";
            this.emptyName = Views.ViewBase.currentView.t("Unnamed", "jsTrip");
            this.inverseColor = false;
            var thisParticipant = _.find(trip.participants, function (p) {
                return p.userId === Views.ViewBase.currentUserId;
            });
            this.isInvited = (thisParticipant != null);
            this.isOwner = trip.ownerId === Views.ViewBase.currentUserId;
            this.editable = editable;
            this.dialogManager = new Trip.DialogManager(this);
            this.placeDialog = new Trip.PlaceDialog(this.dialogManager);
            this.travelDialog = new Trip.TravelDialog(this.dialogManager);
            this.trip = trip;
            this.registerTemplates();
            this.placesMgr = new Trip.PlacesManager(trip.id);
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
            if (this.editable) {
                this.addAdder();
            }
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
            var data = { selectorId: lastPlace.id, position: Trip.NewPlacePosition.ToRight, tripId: this.trip.tripId };
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
                case Trip.TravelType.Bus:
                    return "icon-car";
                case Trip.TravelType.Car:
                    return "icon-car";
                case Trip.TravelType.Plane:
                    return "icon-plane";
                case Trip.TravelType.Ship:
                    return "icon-boat";
                case Trip.TravelType.Walk:
                    return "icon-walk";
                case Trip.TravelType.Bike:
                    return "icon-bike";
                case Trip.TravelType.Train:
                    return "icon-train";
                default:
                    return "";
            }
        };
        Planner.prototype.regDateLinks = function ($root) {
            var _this = this;
            $root.find(".dateLink").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var pid = $t.data("pid");
                var $elem = $("#" + pid).find(".transport");
                _this.setActiveTravel($elem);
            });
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
            var name = this.emptyName;
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
                colorClassLeaving: "",
                arrivingId: "",
                leavingId: ""
            };
            if (place.arriving != null) {
                var da = place.arriving.arrivingDateTime;
                context.arrivingDate = this.formatShortDateTime(da);
                context.arrivalDateLong = this.formatShortDateTime(da) + ("" + da.getUTCFullYear());
                context.arrivingId = place.arriving.id;
            }
            if (place.leaving != null) {
                var dl = place.leaving.leavingDateTime;
                context.leavingDate = this.formatShortDateTime(dl);
                context.leavingId = place.leaving.id;
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
            this.regDateLinks($html);
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
            var d = moment.utc(dt).format("l");
            var v = d.replace(dt.getUTCFullYear(), "");
            return v;
        };
        return Planner;
    }());
    Trip.Planner = Planner;
})(Trip || (Trip = {}));
//# sourceMappingURL=Planner.js.map