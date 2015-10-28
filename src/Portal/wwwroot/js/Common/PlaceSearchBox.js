var PlaceSearchBox = (function () {
    function PlaceSearchBox(config) {
        this.config = config;
        this.$root = $("#" + config.elementId);
        this.owner = config.owner;
        this.registerHandler();
    }
    PlaceSearchBox.prototype.searchPlaces = function (placeName) {
        var _this = this;
        if (placeName.length < this.config.minCharsToSearch) {
            return;
        }
        var params = [["placeName", placeName], ["types", this.config.providers]];
        this.owner.apiGet("place", params, function (places) { _this.fillPlacesSearchBoxHtml(places); });
    };
    PlaceSearchBox.prototype.registerHandler = function () {
        var _this = this;
        this.$root.on("input", function () {
            var placeName = _this.$root.find("input").val();
            _this.searchPlaces(placeName);
        });
    };
    PlaceSearchBox.prototype.fillPlacesSearchBoxHtml = function (places) {
        var _this = this;
        this.$root.find("ul").show();
        var htmlContent = "";
        places.forEach(function (item) {
            htmlContent += _this.getItemHtml(item);
        });
        this.$root.find("li").unbind();
        this.$root.find("ul").html(htmlContent);
        this.$root.find("li").click(function (clickedPlace) {
            _this.selectPlace(clickedPlace, places);
        });
    };
    PlaceSearchBox.prototype.selectPlace = function (clickedPlace, places) {
        var sourceId = $(clickedPlace.currentTarget).data("value");
        var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
        var sourceType = parseInt(sourceTypeStr);
        var clickedPlaceObj = _.find(places, function (place) { return (place.SourceId === sourceId.toString() && place.SourceType === sourceType); });
        var newPlaceRequest = {
            "SourceId": sourceId,
            "SourceType": sourceType
        };
        this.$root.find("ul").hide();
        if (this.config.clearAfterSearch) {
            this.$root.find("input").val("");
        }
        else {
            var selectedCaption = clickedPlaceObj.City + ", " + clickedPlaceObj.CountryCode;
            this.$root.find("input").val(selectedCaption);
        }
        this.onPlaceSelected(newPlaceRequest);
    };
    PlaceSearchBox.prototype.getIconForSearch = function (sourceType) {
        switch (sourceType) {
            case SourceType.FB:
                return "icon-facebook";
            case SourceType.City:
                return "icon-city";
            case SourceType.Country:
                return "icon-country";
            case SourceType.S4:
                return "icon-foursquare";
        }
        return "";
    };
    PlaceSearchBox.prototype.getItemHtml = function (item) {
        var icoClass = this.getIconForSearch(item.SourceType);
        return '<li data-value="' + item.SourceId + '" data-type="' + item.SourceType + '"><span class="' + icoClass + ' left mright10"></span>' + item.Name + '<span class="color2">, ' + item.CountryCode + '</span></li>';
    };
    return PlaceSearchBox;
})();
var PlaceSearchConfig = (function () {
    function PlaceSearchConfig() {
    }
    return PlaceSearchConfig;
})();
//# sourceMappingURL=PlaceSearchBox.js.map