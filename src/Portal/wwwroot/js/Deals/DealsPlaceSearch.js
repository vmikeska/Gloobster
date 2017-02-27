var Planning;
(function (Planning) {
    var DealsPlaceSearch = (function () {
        function DealsPlaceSearch($cont, placeholder) {
            this.selectedItem = null;
            this.$cont = $cont;
            this.$cont.addClass("city-airport-search");
            this.init(placeholder);
        }
        Object.defineProperty(DealsPlaceSearch.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        DealsPlaceSearch.prototype.hasSelected = function () {
            return (this.selectedItem != null);
        };
        DealsPlaceSearch.prototype.enabled = function (state) {
            if (state === null) {
                return !this.$cont.hasClass("disabled");
            }
            this.$cont.toggleClass("disabled", state);
        };
        DealsPlaceSearch.prototype.init = function (placeholder) {
            var tmp = this.v.registerTemplate("city-air-search-template");
            var $t = $(tmp({ placeholder: placeholder }));
            this.$cont.html($t);
            this.$input = this.$cont.find(".input-txt");
            this.$results = this.$cont.find(".results");
            this.$ico = this.$cont.find(".ico");
            this.$close = this.$cont.find(".close");
            this.$preload = this.$cont.find(".preload-wheel");
            this.regCall();
        };
        DealsPlaceSearch.prototype.regCall = function () {
            var _this = this;
            this.$input.on("input", function (e) {
                var txt = _this.$input.val();
                var data = [["txt", txt], ["max", "10"]];
                _this.preloader(true);
                _this.v.apiGet("DealsPlace", data, function (items) {
                    _this.preloader(false);
                    _this.genItems(items);
                });
            });
            this.$input.on("focusin", function (e) {
                _this.$input.val("");
            });
            this.$input.on("focusout", function (e) {
                _this.$input.val("");
                if (_this.selectedItem) {
                    var itxt = "" + _this.selectedItem.name + _this.codeStrForItem(_this.selectedItem);
                    _this.$input.val(itxt);
                }
            });
            this.$close.click(function (e) {
                _this.selectedItem = null;
                _this.$input.val("");
                _this.$ico.attr("class", "icon-logo-pin ico");
            });
        };
        DealsPlaceSearch.prototype.itemClicked = function (item) {
            var itxt = "" + item.name + this.codeStrForItem(item);
            this.$input.val(itxt);
            this.$ico.attr("class", "icon-" + this.iconForItem(item.type) + " ico");
            this.selectedItem = item;
            this.showRes(false);
        };
        DealsPlaceSearch.prototype.preloader = function (show) {
            if (show) {
                this.$close.addClass("hidden");
                this.$preload.removeClass("hidden");
            }
            else {
                this.$close.removeClass("hidden");
                this.$preload.addClass("hidden");
            }
        };
        DealsPlaceSearch.prototype.showRes = function (show) {
            if (show) {
                this.$results.removeClass("hidden");
            }
            else {
                this.$results.addClass("hidden");
            }
        };
        DealsPlaceSearch.prototype.codeStrForItem = function (item) {
            if (item.type === 0) {
                return ", " + item.cc;
            }
            if (item.type === 1) {
                var hasSubCities = (item.type === 1) && any(item.childern);
                var ac = hasSubCities ? "All" : item.air;
                return ", " + (item.cc ? item.cc : "") + " (" + ac + ")";
            }
            if (item.type === 2) {
                return ", (" + item.air + ")";
            }
            return "";
        };
        DealsPlaceSearch.prototype.iconForItem = function (type) {
            if (type === 0) {
                return "country";
            }
            if (type === 1) {
                return "logo-pin";
            }
            if (type === 2) {
                return "airplane";
            }
            return "";
        };
        DealsPlaceSearch.prototype.itemMapping = function (i) {
            var r = {
                icon: this.iconForItem(i.type),
                txt: i.name,
                code: this.codeStrForItem(i),
                cls: i.type === 2 ? "sub" : ""
            };
            return r;
        };
        DealsPlaceSearch.prototype.genItems = function (items) {
            var _this = this;
            this.showRes(any(items));
            var lg = Common.ListGenerator.init(this.$results, "city-air-item-template");
            lg.clearCont = true;
            lg.appendStyle = "append";
            lg.evnt(null, function (e, $item, $target, item) { _this.itemClicked(item); });
            lg.customMapping = function (i) { return _this.itemMapping(i); };
            lg.onItemAppended = function ($item, item) {
                var hasSubCities = (item.type === 1) && any(item.childern);
                if (hasSubCities) {
                    var lgt = Common.ListGenerator.init(_this.$results, "city-air-item-template");
                    lgt.appendStyle = "append";
                    lgt.evnt(null, function (e, $item, $target, item) { _this.itemClicked(item); });
                    lgt.customMapping = function (i) { return _this.itemMapping(i); };
                    lgt.generateList(item.childern);
                }
            };
            lg.generateList(items);
        };
        return DealsPlaceSearch;
    }());
    Planning.DealsPlaceSearch = DealsPlaceSearch;
})(Planning || (Planning = {}));
//# sourceMappingURL=DealsPlaceSearch.js.map