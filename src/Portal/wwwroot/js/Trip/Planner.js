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
    return DialogManager;
})();
var PlaceDialog = (function () {
    function PlaceDialog(dialogManager) {
        this.dialogManager = dialogManager;
    }
    PlaceDialog.prototype.display = function () {
        var _this = this;
        this.dialogManager.closeDialog();
        var prms = [["dialogType", "place"], ["tripId", this.dialogManager.planner.trip.tripId], ["id", this.dialogManager.selectedId]];
        this.dialogManager.owner.apiGet("TripPlannerProperty", prms, function (response) {
            _this.create(response);
        });
    };
    PlaceDialog.prototype.create = function (data) {
        var _this = this;
        var $rowCont = $("#" + data.id).parent();
        this.buildTemplate($rowCont);
        this.createNameSearch(data);
        $("#stayAddress").val(data.addressText);
        this.createAddressSearch(data);
        this.createPlaceToVisitSearch(data);
        this.initDescription(data.description);
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
        var data = {
            propertyName: "placeToVisit",
            values: {
                tripId: this.dialogManager.planner.trip.tripId,
                placeId: this.dialogManager.selectedId,
                sourceId: req.SourceId,
                sourceType: req.SourceType,
                selectedName: place.Name
            }
        };
        this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) {
            var id = response.Result;
            _this.addPlaceToVisit(id, place.Name, req.SourceType);
        });
    };
    PlaceDialog.prototype.onAddressSelected = function (req, place) {
        $("#stayAddress").val(place.Address);
        var data = {
            propertyName: "address",
            values: {
                tripId: this.dialogManager.planner.trip.tripId,
                placeId: this.dialogManager.selectedId,
                sourceId: req.SourceId,
                sourceType: req.SourceType,
                selectedName: place.Name,
                address: place.Address,
                lat: place.Coordinates.Lat,
                lng: place.Coordinates.Lng
            }
        };
        this.dialogManager.owner.apiPut("tripPlannerProperty", data, function (response) {
        });
    };
    PlaceDialog.prototype.onPlaceSelected = function (req, place) {
        this.addressSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);
        this.placeToVisitSearch.setCoordinates(place.Coordinates.Lat, place.Coordinates.Lng);
        var name = place.City + ", " + place.CountryCode;
        $(".active .name").text(name);
        var data = {
            propertyName: "place",
            values: {
                tripId: this.dialogManager.planner.trip.tripId,
                placeId: this.dialogManager.selectedId,
                sourceId: req.SourceId,
                sourceType: req.SourceType,
                selectedName: name,
                lat: place.Coordinates.Lat,
                lng: place.Coordinates.Lng
            }
        };
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
            var data = {
                propertyName: "placeToVisitRemove",
                values: {
                    tripId: _this.dialogManager.planner.trip.tripId,
                    placeId: _this.dialogManager.selectedId,
                    id: $item.parent().data("id")
                }
            };
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
    PlaceDialog.prototype.initDescription = function (text) {
        var _this = this;
        $("#dialogDescription").val(text);
        var d = new DelayedCallback("dialogDescription");
        d.callback = function (description) {
            var data = { propertyName: "description", values: {
                    dialogType: "place",
                    placeId: _this.dialogManager.selectedId,
                    tripId: _this.dialogManager.planner.trip.tripId,
                    description: description
                } };
            _this.dialogManager.owner.apiPut("TripPlannerProperty", data, function () {
            });
        };
    };
    return PlaceDialog;
})();
var TravelDialog = (function () {
    function TravelDialog() {
    }
    TravelDialog.prototype.displayTravelDetail = function () {
        this.dialogUtils.closeDialog();
        var html = this.dialogUtils.travelDetailTemplate();
        var $html = $(html);
        this.dialogUtils.regClose($html);
        //this.dialogUtils.$currentContainer.after($html);
    };
    return TravelDialog;
})();
var Planner = (function () {
    function Planner(owner, trip) {
        this.$currentContainer = $("#plannerCont1");
        this.lastRowNo = 1;
        this.placesPerRow = 4;
        this.contBaseName = "plannerCont";
        this.owner = owner;
        this.dialogManager = new DialogManager(owner, this);
        this.placeDialog = new PlaceDialog(this.dialogManager);
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
            var name = "Empty";
            if (place.place) {
                name = place.place.selectedName;
            }
            var placeContext = {
                id: place.id,
                isActive: false,
                name: name,
                arrivalDateLong: "1.1.2000",
                rowNo: _this.lastRowNo
            };
            _this.manageRows(placeCount);
            _this.addPlace(placeContext);
            if (place.leaving) {
                var travel = place.leaving;
                _this.addTravel(travel.id, travel.type);
            }
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
            var t = new Travel();
            _this.placesMgr.travels.push(t);
            t.id = response.travel.id;
            t.type = response.travel.type;
            lastPlace.leaving = t;
            t.from = lastPlace;
            var p = new Place();
            _this.placesMgr.places.push(p);
            p.id = response.place.id;
            p.arriving = t;
            p.leaving = null;
            p.orderNo = response.place.orderNo;
            t.to = p;
            _this.manageRows(_this.placesMgr.places.length);
            _this.addTravel(t.id, t.type);
            var placeContext = {
                id: p.id,
                isActive: true,
                name: "Empty",
                arrivalDateLong: "1.1.2000",
                rowNo: _this.lastRowNo
            };
            _this.addPlace(placeContext);
            _this.dialogManager.selectedId = response.place.id;
            //this.placeDialog.display();
        });
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
    Planner.prototype.addTravel = function (id, travelType) {
        var _this = this;
        var context = {
            id: id,
            icon: this.getTravelIcon(travelType)
        };
        var html = this.travelTemplate(context);
        var $html = $(html);
        $html.find(".transport").click("*", function (e) {
            var $elem = $(e.target);
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
        this.placeDialog.display();
    };
    Planner.prototype.addPlace = function (context) {
        var self = this;
        var html = this.placeTemplate(context);
        var $html = $(html);
        //$html.find(".destination").on("click", "*", (e) => {
        $html.find(".destination").click("*", function (e) {
            self.dialogManager.deactivate();
            var $elem = $(e.delegateTarget);
            $elem.addClass("active");
            self.dialogManager.selectedId = $elem.parent().attr("id");
            self.placeDialog.display();
        });
        this.appendToTimeline($html);
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
    PlacesManager.prototype.setData = function (travels, places) {
        var _this = this;
        places.forEach(function (place) {
            var placeObj = new Place();
            placeObj.id = place.id;
            placeObj.orderNo = place.orderNo;
            placeObj.place = place.place;
            if (place.arrivingId) {
                placeObj.arriving = _this.getOrCreateTravelById(place.arrivingId, travels);
                placeObj.arriving.to = placeObj;
            }
            if (place.leavingId) {
                placeObj.leaving = _this.getOrCreateTravelById(place.leavingId, travels);
                placeObj.leaving.from = placeObj;
            }
            _this.places.push(placeObj);
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
        var newTravelObj = new Travel();
        newTravelObj.id = newTravel.id;
        newTravelObj.type = newTravel.type;
        this.travels.push(newTravelObj);
        return newTravel;
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