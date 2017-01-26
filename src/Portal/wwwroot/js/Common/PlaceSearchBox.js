var Common;
(function (Common) {
    var PlaceSearchBox = (function () {
        function PlaceSearchBox(config) {
            var _this = this;
            this.config = config;
            this.$root = this.config.selOjb;
            this.$input = this.$root.find("input");
            this.$input.change(function (e) {
                e.stopPropagation();
            });
            this.template = Views.ViewBase.currentView.registerTemplate("placeItem-template");
            this.$input.focus(function (e) {
                $(e.target).val("");
            });
            this.$input.focusout(function () {
                _this.setText(_this.lastText);
            });
            this.delayedCallback = new Common.DelayedCallback(this.$input);
            this.delayedCallback.callback = function (placeName) {
                _this.$root.find("ul").hide();
                if (placeName) {
                    _this.loader(true);
                }
                _this.searchPlaces(placeName);
            };
        }
        PlaceSearchBox.prototype.initValues = function (vals) {
            this.sourceId = vals.sourceId;
            this.sourceType = vals.sourceType;
            this.lastText = vals.lastText;
            this.coord = vals.coord;
            this.$input.val(vals.lastText);
        };
        PlaceSearchBox.prototype.loader = function (state) {
            if (state) {
                this.$root.find(".loader").show();
            }
            else {
                this.$root.find(".loader").hide();
            }
        };
        PlaceSearchBox.prototype.setText = function (text) {
            this.lastText = text;
            this.$root.find("input").val(text);
        };
        PlaceSearchBox.prototype.setCoordinates = function (lat, lng) {
            this.coordinates = { lat: lat, lng: lng };
        };
        PlaceSearchBox.prototype.searchPlaces = function (placeName) {
            var _this = this;
            if (placeName.length < this.config.minCharsToSearch) {
                return;
            }
            var params = [["placeName", placeName], ["types", this.config.providers]];
            if (this.coordinates) {
                params.push(["lat", this.coordinates.lat]);
                params.push(["lng", this.coordinates.lng]);
            }
            if (Views.ViewBase.fbt) {
                params.push(["fbt", Views.ViewBase.fbt]);
            }
            Views.ViewBase.currentView.apiGet("place", params, function (places) {
                _this.fillPlacesSearchBoxHtml(places);
                _this.loader(false);
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
            var _this = this;
            this.sourceId = $(clickedPlace.currentTarget).data("value");
            var sourceTypeStr = $(clickedPlace.currentTarget).data("type");
            this.sourceType = parseInt(sourceTypeStr);
            var clickedPlaceObj = _.find(places, function (place) { return (place.SourceId === _this.sourceId.toString() && place.SourceType === _this.sourceType); });
            this.coord = clickedPlaceObj.Coordinates;
            var newPlaceRequest = {
                "SourceId": this.sourceId,
                "SourceType": this.sourceType
            };
            this.$root.find("ul").hide();
            if (this.config.clearAfterSearch) {
                this.setText("");
            }
            else {
                var selectedCaption = this.getCaption(clickedPlaceObj);
                if (this.config.customSelectedFormat) {
                    selectedCaption = this.config.customSelectedFormat(clickedPlaceObj);
                }
                this.setText(selectedCaption);
            }
            this.$root.trigger("change", [newPlaceRequest, clickedPlaceObj]);
        };
        PlaceSearchBox.prototype.getCaption = function (place) {
            var name = "";
            var isSocNetworkPlace = _.contains([SourceType.FB, SourceType.S4, SourceType.Yelp], place.SourceType);
            if (isSocNetworkPlace) {
                name = place.Name + ", " + place.City;
            }
            if (place.SourceType === SourceType.Country) {
                name = place.Name;
            }
            if (place.SourceType === SourceType.City) {
                name = place.City + ", " + place.CountryCode;
            }
            return name;
        };
        PlaceSearchBox.prototype.getIconForSearch = function (sourceType) {
            switch (sourceType) {
                case SourceType.FB:
                    return "icon-facebook2";
                case SourceType.City:
                    return "icon-city";
                case SourceType.Country:
                    return "icon-country";
                case SourceType.S4:
                    return "icon-foursquare";
                case SourceType.Yelp:
                    return "icon-yelp";
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
    }());
    Common.PlaceSearchBox = PlaceSearchBox;
    var PlaceSearchConfig = (function () {
        function PlaceSearchConfig() {
        }
        return PlaceSearchConfig;
    }());
    Common.PlaceSearchConfig = PlaceSearchConfig;
})(Common || (Common = {}));
//# sourceMappingURL=PlaceSearchBox.js.map