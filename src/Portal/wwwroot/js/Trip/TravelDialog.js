var Trip;
(function (Trip) {
    var TravelDialog = (function () {
        function TravelDialog(dialogManager) {
            this.dialogManager = dialogManager;
        }
        TravelDialog.prototype.display = function () {
            var _this = this;
            this.dialogManager.closeDialog();
            this.dialogManager.getDialogData(TripEntityType.Travel, function (data) {
                _this.data = data;
                if (_this.dialogManager.planner.editable) {
                    _this.createEdit(data);
                }
                else {
                    _this.createView(data);
                }
            });
        };
        TravelDialog.prototype.createView = function (data) {
            this.buildTemplateView(data);
            this.files = this.dialogManager.createFilesInstanceView(data.id, TripEntityType.Travel);
            this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);
        };
        TravelDialog.prototype.extendContextForFlight = function (context, data) {
            context.isFlight = true;
            var contextFlight = {
                from: "",
                to: "",
                flightDetails: "-"
            };
            if (data.flightFrom) {
                contextFlight.from = data.flightFrom.selectedName;
            }
            if (data.flightTo) {
                contextFlight.to = data.flightTo.selectedName;
            }
            var newContext = $.extend(context, contextFlight);
            return newContext;
        };
        TravelDialog.prototype.formatDate = function (d, useTime) {
            var fs = useTime ? "LLL" : "LL";
            var v = moment.utc(d).format(fs);
            return v;
        };
        TravelDialog.prototype.buildTemplateView = function (data) {
            var html = "";
            var lDate = new Date(data.leavingDateTime);
            var aDate = new Date(data.arrivingDateTime);
            if (this.dialogManager.planner.isInvited || this.dialogManager.planner.isOwner) {
                var contextInvited = {
                    arrivingDateTime: this.formatDate(lDate, data.useTime),
                    leavingDateTime: this.formatDate(aDate, data.useTime),
                    description: data.description,
                    isFlight: false
                };
                if (data.type === TravelType.Plane) {
                    contextInvited = this.extendContextForFlight(contextInvited, data);
                }
                html = this.dialogManager.travelDetailViewTemplate(contextInvited);
            }
            else {
                var contextNonInvited = {
                    arrivingDateTime: this.formatDate(lDate, data.useTime),
                    leavingDateTime: this.formatDate(aDate, data.useTime),
                    isFlight: false
                };
                if (data.type === TravelType.Plane) {
                    contextNonInvited = this.extendContextForFlight(contextNonInvited, data);
                }
                html = this.dialogManager.travelDetailViewFriends(contextNonInvited);
            }
            var $html = $(html);
            this.dialogManager.regClose($html);
            this.$lastBlockOnRow.after($html);
        };
        TravelDialog.prototype.createEdit = function (data) {
            this.buildTemplateEdit(data);
            this.initTravelType(data.type);
            this.dialogManager.initDescription(data.description, TripEntityType.Travel);
            this.files = this.dialogManager.createFilesInstance(data.id, TripEntityType.Travel);
            this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);
            this.initAirport(data.flightFrom, "airportFrom", "flightFrom");
            this.initAirport(data.flightTo, "airportTo", "flightTo");
        };
        TravelDialog.prototype.initAirport = function (flight, comboId, propName) {
            var _this = this;
            var airportFrom = new Trip.AirportCombo(comboId);
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
            $combo.find(".selected").html("<span class=\"ticon " + cls + " black\"></span>    " + cap);
            $input.change(function (e) {
                var travelType = parseInt($input.val());
                _this.showHideTravelDetails(travelType);
                var data = _this.dialogManager.getPropRequest("travelType", { travelType: travelType });
                _this.dialogManager.updateProp(data, function (r) {
                    var $currentIcon = $combo.find("li[data-value='" + travelType + "']");
                    var currentCls = $currentIcon.data("cls");
                    $(".active").find(".ticon").attr("class", "ticon " + currentCls);
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
        TravelDialog.prototype.buildTemplateEdit = function (data) {
            var $html = $(this.dialogManager.travelDetailTemplate());
            var ptt = new Trip.PlaceTravelTime(this.dialogManager, data);
            var $time = ptt.create(TripEntityType.Travel);
            $html.find(".the-first").after($time);
            Common.DropDown.registerDropDown($html.find(".dropdown"));
            this.dialogManager.regClose($html);
            this.$lastBlockOnRow.after($html);
        };
        return TravelDialog;
    }());
    Trip.TravelDialog = TravelDialog;
})(Trip || (Trip = {}));
//# sourceMappingURL=TravelDialog.js.map