var Common;
(function (Common) {
    var NumberPicker = (function () {
        function NumberPicker($cont, min, max) {
            this.$cont = $cont;
            this.min = min;
            this.max = max;
            this.init();
        }
        NumberPicker.prototype.val = function () {
            return this.$control.val();
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