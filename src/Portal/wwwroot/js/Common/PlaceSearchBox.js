var PlaceSearchBox = (function () {
    function PlaceSearchBox(config) {
        var _this = this;
        this.config = config;
        this.$root = $("#" + config.elementId);
        this.$input = this.$root.find("input");
        this.owner = config.owner;
        var source = $("#placeItem-template").html();
        this.template = Handlebars.compile(source);
        this.delayedCallback = new DelayedCallback(this.$input);
        this.delayedCallback.callback = function (placeName) { return _this.searchPlaces(placeName); };
    }
    PlaceSearchBox.prototype.searchPlaces = function (placeName) {
        var _this = this;
        if (placeName.length < this.config.minCharsToSearch) {
            return;
        }
        var params = [["placeName", placeName], ["types", this.config.providers]];
        this.owner.apiGet("place", params, function (places) { _this.fillPlacesSearchBoxHtml(places); });
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
        this.onPlaceSelected(newPlaceRequest, clickedPlaceObj);
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
        var context = {
            sourceId: item.SourceId,
            sourceType: item.SourceType,
            icoClass: this.getIconForSearch(item.SourceType),
            name: item.Name,
            countryCode: item.CountryCode
        };
        var html = this.template(context);
        return html;
    };
    return PlaceSearchBox;
})();
var PlaceSearchConfig = (function () {
    function PlaceSearchConfig() {
    }
    return PlaceSearchConfig;
})();
//# sourceMappingURL=PlaceSearchBox.js.map