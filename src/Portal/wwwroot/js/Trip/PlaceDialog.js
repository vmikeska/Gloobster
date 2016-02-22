var Trip;
(function (Trip) {
    var PlaceDialog = (function () {
        function PlaceDialog(dialogManager) {
            this.dialogManager = dialogManager;
        }
        PlaceDialog.prototype.display = function () {
            var _this = this;
            this.dialogManager.closeDialog();
            this.dialogManager.getDialogData(Common.TripEntityType.Place, function (data) {
                _this.$rowCont = $("#" + data.id).parent();
                if (_this.dialogManager.planner.editable) {
                    _this.createEdit(data);
                }
                else {
                    _this.createView(data);
                }
            });
        };
        PlaceDialog.prototype.createView = function (data) {
            this.buildTemplateView(this.$rowCont, data);
            this.files = this.dialogManager.createFilesInstanceView(data.id, Common.TripEntityType.Place);
            this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);
        };
        PlaceDialog.prototype.createEdit = function (data) {
            var _this = this;
            this.buildTemplateEdit(this.$rowCont);
            this.createNameSearch(data);
            $("#stayAddress").val(data.addressText);
            this.createAddressSearch(data);
            this.createPlaceToVisitSearch(data);
            this.dialogManager.initDescription(data.description, Common.TripEntityType.Place);
            if (data.wantVisit) {
                data.wantVisit.forEach(function (place) {
                    _this.addPlaceToVisit(place.id, place.selectedName, place.sourceType, place.sourceId);
                });
            }
            this.files = this.dialogManager.createFilesInstance(data.id, Common.TripEntityType.Place);
            this.files.setFiles(data.files, this.dialogManager.planner.trip.tripId, data.filesPublic);
        };
        PlaceDialog.prototype.createNameSearch = function (data) {
            var _this = this;
            var c = new Common.PlaceSearchConfig();
            c.providers = "0,1,2,3,4";
            c.elementId = "cities";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            this.placeSearch = new Common.PlaceSearchBox(c);
            this.placeSearch.onPlaceSelected = function (req, place) { return _this.onPlaceSelected(req, place); };
            if (data.place) {
                this.placeSearch.setText(data.place.selectedName);
            }
        };
        PlaceDialog.prototype.createPlaceToVisitSearch = function (data) {
            var _this = this;
            var c = new Common.PlaceSearchConfig();
            c.providers = "1,0,4";
            c.elementId = "placeToVisit";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = true;
            this.placeToVisitSearch = new Common.PlaceSearchBox(c);
            this.placeToVisitSearch.onPlaceSelected = function (req, place) { return _this.onPlaceToVisitSelected(req, place); };
            if (data.place && data.place.coordinates) {
                this.placeToVisitSearch.setCoordinates(data.place.coordinates.Lat, data.place.coordinates.Lng);
            }
        };
        PlaceDialog.prototype.createAddressSearch = function (data) {
            var _this = this;
            var c = new Common.PlaceSearchConfig();
            c.providers = "1,0,4";
            c.elementId = "stayPlace";
            c.minCharsToSearch = 1;
            c.clearAfterSearch = false;
            c.customSelectedFormat = function (place) {
                return place.Name;
            };
            this.addressSearch = new Common.PlaceSearchBox(c);
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
        PlaceDialog.prototype.buildTemplateView = function ($row, data) {
            var _this = this;
            var html = "";
            var context = {
                name: "Empty",
                wantVisit: [],
                hasNoWantVisit: true
            };
            context.wantVisit = _.map(data.wantVisit, function (item) {
                return {
                    name: item.selectedName,
                    icon: _this.getIcon(item.sourceType),
                    link: _this.getSocLink(item.sourceType, item.sourceId)
                };
            });
            context.hasNoWantVisit = (context.wantVisit.length === 0);
            if (data.place) {
                context.name = data.place.selectedName;
            }
            if (this.dialogManager.planner.isInvited || this.dialogManager.planner.isOwner) {
                var stayName = "";
                if (data.address) {
                    stayName = data.address.selectedName;
                }
                context = $.extend(context, {
                    stayAddress: data.addressText,
                    description: data.description,
                    stayName: stayName
                });
                if (data.address) {
                    context = $.extend(context, {
                        stayIco: this.getIcon(data.address.sourceType),
                        stayLink: this.getSocLink(data.address.sourceType, data.address.sourceId),
                        hasAddress: true
                    });
                }
                html = this.dialogManager.placeDetailViewTemplate(context);
            }
            else {
                html = this.dialogManager.placeDetailViewFriends(context);
            }
            var $html = $(html);
            this.dialogManager.regClose($html);
            $row.after($html);
        };
        PlaceDialog.prototype.getSocLink = function (sourceType, sourceId) {
            var link = "";
            if (sourceType === SourceType.FB) {
                link = "http://facebook.com/" + sourceId;
            }
            if (sourceType === SourceType.S4) {
                link = "http://foursquare.com/v/" + sourceId;
            }
            return link;
        };
        PlaceDialog.prototype.buildTemplateEdit = function ($row) {
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
            this.dialogManager.updateProp(data, function (response) {
                var id = response.Result;
                _this.addPlaceToVisit(id, place.Name, req.SourceType, req.SourceId);
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
            this.dialogManager.updateProp(data, function (response) { });
        };
        PlaceDialog.prototype.onPlaceSelected = function (req, place) {
            $(".active .name").text(this.placeSearch.lastText);
            var data = this.dialogManager.getPropRequest("place", {
                sourceId: req.SourceId,
                sourceType: req.SourceType,
                selectedName: this.placeSearch.lastText
            });
            var coord = place.Coordinates;
            if (coord) {
                this.addressSearch.setCoordinates(coord.Lat, coord.Lng);
                this.placeToVisitSearch.setCoordinates(coord.Lat, coord.Lng);
                data.values["lat"] = coord.Lat;
                data.values["lng"] = coord.Lng;
            }
            this.dialogManager.updateProp(data, function (response) { });
        };
        PlaceDialog.prototype.addPlaceToVisit = function (id, name, sourceType, sourceId) {
            var _this = this;
            var iconClass = this.getIcon(sourceType);
            var context = {
                id: id,
                icon: iconClass,
                name: name,
                link: this.getSocLink(sourceType, sourceId)
            };
            var html = this.dialogManager.visitedItemTemplate(context);
            var $html = $(html);
            $html.find(".delete").click(function (e) {
                e.preventDefault();
                var $item = $(e.target);
                var data = _this.dialogManager.getPropRequest("placeToVisitRemove", {
                    id: $item.parent().data("id")
                });
                _this.dialogManager.updateProp(data, function (response) { });
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
    Trip.PlaceDialog = PlaceDialog;
})(Trip || (Trip = {}));
//# sourceMappingURL=PlaceDialog.js.map