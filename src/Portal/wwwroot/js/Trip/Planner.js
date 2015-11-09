var Planner = (function () {
    function Planner(owner, trip) {
        this.$currentContainer = $("#plannerCont1");
        this.owner = owner;
        this.trip = trip;
        this.registerTemplates();
        this.addAdder();
        this.placesMgr = new PlacesManager(trip.id, owner);
        this.placesMgr.setData(trip.travels, trip.places);
        this.redrawAll();
    }
    Planner.prototype.redrawAll = function () {
        var _this = this;
        var orderedPlaces = _.sortBy(this.placesMgr.places, "orderNo");
        orderedPlaces.forEach(function (place) {
            var name = "Empty";
            if (place.selectedName) {
                name = place.selectedName;
            }
            var placeContext = {
                isActive: false,
                name: name,
                arrivalDateLong: "1.1.2000"
            };
            _this.addPlace(placeContext);
            if (place.leaving) {
                var travel = place.leaving;
                _this.addTravel(travel.id, travel.type);
            }
        });
    };
    Planner.prototype.closeDialog = function () {
        $(".daybyday-form").remove();
    };
    Planner.prototype.deactivate = function () {
        $(".destination.active").removeClass("active");
        var $trans = $(".transport.active");
        $trans.removeClass("active");
        $trans.find(".tab").remove();
    };
    Planner.prototype.regClose = function ($html) {
        var _this = this;
        $html.find(".close").click(function () {
            _this.closeDialog();
            _this.deactivate();
        });
    };
    Planner.prototype.displayPlaceDetail = function () {
        var _this = this;
        this.closeDialog();
        var html = this.placeDetailTemplate();
        var $html = $(html);
        this.regClose($html);
        this.$currentContainer.after($html);
        var searchConfig = new PlaceSearchConfig();
        searchConfig.owner = this.owner;
        searchConfig.providers = "0,1,2,3";
        searchConfig.elementId = "cities";
        searchConfig.minCharsToSearch = 1;
        searchConfig.clearAfterSearch = false;
        this.placeSearch = new PlaceSearchBox(searchConfig);
        this.placeSearch.onPlaceSelected = function (req, place) { return _this.onPlaceSelected(req, place); };
    };
    Planner.prototype.displayTravelDetail = function () {
        this.closeDialog();
        var html = this.travelDetailTemplate();
        var $html = $(html);
        this.regClose($html);
        this.$currentContainer.after($html);
    };
    Planner.prototype.onPlaceSelected = function (req, place) {
        var name = place.City + ", " + place.CountryCode;
        $(".active .name").text(name);
    };
    Planner.prototype.addAdder = function () {
        var _this = this;
        var html = this.addPlaceTemplate();
        this.$currentContainer.append(html);
        this.$adder = $("#addPlace");
        this.$lastCell = $("#lastCell");
        this.$adder.click(function () {
            _this.addEnd();
        });
    };
    Planner.prototype.registerTemplates = function () {
        this.addPlaceTemplate = this.owner.registerTemplate("addPlace-template");
        this.travelTemplate = this.owner.registerTemplate("travel-template");
        this.placeTemplate = this.owner.registerTemplate("place-template");
        this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");
        this.travelDetailTemplate = this.owner.registerTemplate("travelDetail-template");
    };
    Planner.prototype.addEnd = function () {
        var _this = this;
        this.closeDialog();
        this.deactivate();
        var lastPlace = this.placesMgr.getLastPlace();
        var data = { selectorId: lastPlace.id, position: NewPlacePosition.ToRight, tripId: this.trip.tripId };
        this.owner.apiPost("tripPlanner", data, function (response) {
            var t = new Travel();
            _this.placesMgr.travels.push(t);
            t.id = response.travel.id;
            t.type = response.travel.id;
            lastPlace.leaving = t;
            t.from = lastPlace;
            var p = new Place();
            _this.placesMgr.places.push(p);
            p.id = response.place.id;
            p.arriving = t;
            p.leaving = null;
            p.orderNo = response.place.orderNo;
            t.to = p;
            _this.addTravel(t.id, t.type);
            var placeContext = {
                isActive: true,
                name: "Empty",
                arrivalDateLong: "1.1.2000"
            };
            _this.addPlace(placeContext);
            _this.displayPlaceDetail();
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
        $html.find(".transport").click(function (e) {
            var $elem = $(e.target);
            _this.setActiveTravel($elem);
        });
        this.$lastCell.before($html);
    };
    Planner.prototype.addPlace = function (context) {
        var _this = this;
        var html = this.placeTemplate(context);
        var $html = $(html);
        $html.find(".destination").click(function (e) {
            _this.deactivate();
            $(e.target).addClass("active");
            _this.displayPlaceDetail();
        });
        this.$lastCell.before($html);
        //this.displayPlaceDetail();	 
    };
    Planner.prototype.setActiveTravel = function ($elem) {
        this.deactivate();
        $elem.addClass("active");
        $elem.append($('<span class="tab"></span>'));
        this.displayTravelDetail();
    };
    return Planner;
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
            placeObj.selectedName = place.selectedName;
            placeObj.sourceId = place.sourceId;
            placeObj.sourceType = place.sourceType;
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
    //public addNewPlaceEnd() {
    //	var lastPlace = this.getLastPlace();
    //	this.callAddPlace(lastPlace.id, NewPlacePosition.ToRight, (response) => {
    //		var t = new Travel();
    //		t.id = response.travel.id;
    //		t.from = lastPlace;
    //		var p = new Place();
    //		p.id = response.place.id;
    //		p.arriving = t;
    //		p.leaving = null;
    //		t.to = p;
    //	});
    //}
    PlacesManager.prototype.getTravelById = function (id) {
        return _.find(this.travels, function (travel) { return travel.id === id; });
    };
    PlacesManager.prototype.getLastPlace = function () {
        var lastPlace = _.max(this.places, function (place) { return place.orderNo; });
        return lastPlace;
    };
    return PlacesManager;
})();
var Place = (function () {
    function Place() {
    }
    return Place;
})();
var Travel = (function () {
    function Travel() {
    }
    return Travel;
})();
//# sourceMappingURL=Planner.js.map