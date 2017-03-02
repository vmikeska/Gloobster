var Common;
(function (Common) {
    var NumberPicker = (function () {
        function NumberPicker($cont, min, max) {
            var _this = this;
            this.$cont = $cont;
            this.min = min;
            this.max = max;
            this.$cont.change(function () {
                if (_this.onChange) {
                    _this.onChange();
                }
            });
            this.init();
        }
        NumberPicker.prototype.enabled = function (state) {
            if (state === void 0) { state = null; }
            if (state === null) {
                return !this.$cont.hasClass("disabled");
            }
            this.$cont.toggleClass("disabled", !state);
        };
        NumberPicker.prototype.val = function (v) {
            if (v === void 0) { v = null; }
            if (v) {
                this.$control.val(v);
            }
            else {
                return this.$control.val();
            }
        };
        NumberPicker.prototype.init = function () {
            var os = Views.ViewBase.getMobileOS();
            this.isNative = os !== OS.Other;
            if (this.isNative) {
                this.$control = $("<input type=\"number\" min=\"" + this.min + "\" max=\"" + this.max + "\" />");
                this.$cont.html(this.$control);
            }
            else {
                this.$control = $("<select></select>");
                for (var act = this.min; act <= this.max; act++) {
                    this.$control.append("<option value=\"" + act + "\">" + act + "</option>");
                }
                this.$cont.html(this.$control);
            }
        };
        return NumberPicker;
    }());
    Common.NumberPicker = NumberPicker;
})(Common || (Common = {}));
//# sourceMappingURL=NumberPicker.js.map