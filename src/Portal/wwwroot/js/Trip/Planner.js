var Planner = (function () {
    function Planner(owner) {
        this.$currentContainer = $("#plannerCont1");
        this.owner = owner;
        this.registerTemplates();
        this.loadData();
    }
    Planner.prototype.loadData = function () {
        this.addAdder();
    };
    Planner.prototype.displayPlaceDetail = function () {
        var _this = this;
        var html = this.placeDetailTemplate();
        this.$currentContainer.after(html);
        var searchConfig = new PlaceSearchConfig();
        searchConfig.owner = this.owner;
        searchConfig.providers = "0,1,2,3";
        searchConfig.elementId = "cities";
        searchConfig.minCharsToSearch = 1;
        searchConfig.clearAfterSearch = false;
        this.placeSearch = new PlaceSearchBox(searchConfig);
        this.placeSearch.onPlaceSelected = function (req, place) { return _this.placeSelected(req, place); };
    };
    Planner.prototype.placeSelected = function (req, place) {
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
            _this.addPlace();
        });
    };
    Planner.prototype.registerTemplates = function () {
        this.addPlaceTemplate = this.owner.registerTemplate("addPlace-template");
        this.travelTemplate = this.owner.registerTemplate("travel-template");
        this.placeTemplate = this.owner.registerTemplate("place-template");
        this.placeDetailTemplate = this.owner.registerTemplate("placeDetail-template");
    };
    Planner.prototype.addPlace = function () {
        var context = {
            isActive: true,
            name: "Empty",
            arrivalDateLong: "1.1.2000"
        };
        var html = this.placeTemplate(context);
        this.$lastCell.before(html);
        this.displayPlaceDetail();
    };
    return Planner;
})();
//# sourceMappingURL=Planner.js.map