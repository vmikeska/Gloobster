var Trip;
(function (Trip) {
    var AirportComboConfig = (function () {
        function AirportComboConfig() {
            this.clearAfterSelection = false;
        }
        return AirportComboConfig;
    }());
    Trip.AirportComboConfig = AirportComboConfig;
    var AirportCombo = (function () {
        function AirportCombo(comboId, config) {
            if (config === void 0) { config = new AirportComboConfig; }
            this.limit = 10;
            this.config = config;
            this.$combo = $("#" + comboId);
            this.$cont = this.$combo.find("ul");
            this.$input = this.$combo.find("input");
            this.registerInput();
            this.registerInOut();
        }
        AirportCombo.prototype.setText = function (text) {
            this.lastText = text;
            this.$input.val(text);
        };
        AirportCombo.prototype.registerInOut = function () {
            var _this = this;
            this.$input.focus(function (e) {
                $(e.target).val("");
            });
            this.$input.focusout(function () {
                _this.setText(_this.lastText);
            });
        };
        AirportCombo.prototype.registerInput = function () {
            var _this = this;
            var d = new Common.DelayedCallback(this.$input);
            d.callback = function (str) {
                var data = [["query", str], ["limit", _this.limit]];
                Views.ViewBase.currentView.apiGet("airport", data, function (items) { return _this.onResult(items); });
            };
        };
        AirportCombo.prototype.onResult = function (items) {
            this.displayResults(items);
        };
        AirportCombo.prototype.displayResults = function (items) {
            var _this = this;
            if (!items) {
                return;
            }
            this.$cont.html("");
            items.forEach(function (item) {
                var itemHtml = _this.getItemHtml(item);
                _this.$cont.append(itemHtml);
            });
            this.registerClick();
        };
        AirportCombo.prototype.registerClick = function () {
            var _this = this;
            this.$cont.find("li").click(function (evnt) {
                var $t = $(evnt.target);
                _this.onClick($t);
            });
        };
        AirportCombo.prototype.onClick = function ($item) {
            var selName = $item.data("value");
            var selId = $item.data("id");
            if (this.config.clearAfterSelection) {
                this.$input.val("");
            }
            else {
                this.$input.val(selName);
            }
            this.$cont.html("");
            var data = { id: selId, name: selName };
            this.onSelected(data);
        };
        AirportCombo.prototype.getItemHtml = function (item) {
            var code = item.iataFaa;
            if (code === "") {
                code = item.icao;
            }
            var displayName = item.name + " (" + item.city + ")";
            var displayNameSel = item.city + " (" + code + ")";
            return "<li data-value=\"" + displayNameSel + "\" data-id=\"" + item.id + "\">" + displayName + "<span class=\"color2\">\uFFFD " + code + "</span></li>";
        };
        return AirportCombo;
    }());
    Trip.AirportCombo = AirportCombo;
})(Trip || (Trip = {}));
//# sourceMappingURL=AirportCombo.js.map