var Trip;
(function (Trip) {
    var Planner = (function () {
        function Planner(trip, editable) {
            this.$currentContainer = $("#dataCont");
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
            this.initResizer();
        }
        Planner.prototype.initResizer = function () {
            var _this = this;
            this.resizer = new Trip.TripResizer();
            this.resizer.onBeforeResize = function () {
                var $cd = $(".details");
                if ($cd.length > 0) {
                    $cd.hide();
                }
            };
            this.resizer.onAfterResize = function () {
                var $cd = $(".details");
                if ($cd.length > 0) {
                    _this.$lastBlockOnRow = _this.resizer.getLast(_this.$activeBlock.data("no"));
                    _this.$lastBlockOnRow.after($cd);
                    $cd.slideDown();
                }
            };
        };
        Planner.prototype.redrawAll = function () {
            var _this = this;
            var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");
            var placeCount = 0;
            orderedPlaces.forEach(function (place) {
                placeCount++;
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
        Planner.prototype.refreshAdder = function () {
            this.$lastCell.remove();
            this.addAdder();
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
                _this.updateRibbonDate(lastPlace.id, "leavingDate", t.leavingDateTime);
                _this.addTravel(t, !_this.inverseColor);
                _this.addPlace(p, _this.inverseColor);
                _this.inverseColor = !_this.inverseColor;
                _this.dialogManager.selectedId = response.place.id;
            });
        };
        Planner.prototype.updateRibbonDate = function (placeId, livingArriving, date) {
            $("#" + placeId).find("." + livingArriving).text(this.formatShortDateTimeMoment(date));
        };
        Planner.prototype.formatShortDateTimeMoment = function (dt) {
            var d = dt.format("l");
            var v = d.replace(dt.year(), "");
            return v;
        };
        Planner.prototype.formatShortDateTime = function (dt) {
            var d = moment.utc(dt).format("l");
            var v = d.replace(dt.getUTCFullYear(), "");
            return v;
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
        Planner.prototype.regDateLinks = function ($root) {
            var _this = this;
            $root.find(".dateLink").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $block = $t.closest(".placeCont");
                _this.setActivePlaceOrTravel($block);
            });
        };
        Planner.prototype.appendToTimeline = function ($html) {
            if (this.$adder) {
                this.$lastCell.before($html);
            }
            else {
                this.$currentContainer.append($html);
            }
        };
        Planner.prototype.activeBlockChanged = function ($block) {
            this.$activeBlock = $block;
            this.$lastBlockOnRow = this.resizer.getLast($block.data("no"));
            this.dialogManager.$lastBlockOnRow = this.$lastBlockOnRow;
        };
        Planner.prototype.setActivePlaceOrTravel = function ($block) {
            this.activeBlockChanged($block);
            var id = $block.attr("id");
            this.dialogManager.deactivate();
            var $cont = $("#" + id);
            var isPlace = $cont.hasClass("placeCont");
            var $actCont;
            var dialog;
            var tab = "<span class=\"tab\"></span>";
            if (isPlace) {
                dialog = this.placeDialog;
                $actCont = $cont.find(".destination");
                $cont.find(".tab-cont").html(tab);
            }
            else {
                dialog = this.travelDialog;
                $actCont = $cont.find(".transport");
                $actCont.append(tab);
            }
            $actCont.addClass("active");
            this.dialogManager.selectedId = id;
            dialog.display();
        };
        Planner.prototype.getHighestBlockNo = function () {
            var highest = 0;
            this.$currentContainer.find(".block").toArray().forEach(function (b) {
                var $b = $(b);
                var no = $b.data("no");
                if (no && no > highest) {
                    highest = no;
                }
            });
            return highest;
        };
        Planner.prototype.addPlace = function (place, inverseColor) {
            var _this = this;
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
                isFirstDay: (place.arriving == null),
                colorClassArriving: "",
                colorClassLeaving: "",
                arrivingId: "",
                leavingId: "",
                no: this.getHighestBlockNo() + 1
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
                var $t = $(e.delegateTarget);
                var $block = $t.closest(".block");
                _this.setActivePlaceOrTravel($block);
            });
            this.appendToTimeline($html);
            return $html;
        };
        Planner.prototype.addTravel = function (travel, inverseColor) {
            var _this = this;
            var context = {
                id: travel.id,
                icon: this.getTravelIcon(travel.type),
                colorClass: "",
                no: this.getHighestBlockNo() + 1
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
                var $t = $(e.delegateTarget);
                var $block = $t.closest(".block");
                _this.setActivePlaceOrTravel($block);
            });
            this.appendToTimeline($html);
            return $html;
        };
        return Planner;
    }());
    Trip.Planner = Planner;
})(Trip || (Trip = {}));
//# sourceMappingURL=Planner.js.map