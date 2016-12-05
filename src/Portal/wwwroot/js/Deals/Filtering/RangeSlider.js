var Planning;
(function (Planning) {
    var RangeSlider = (function () {
        function RangeSlider($cont, id) {
            this.delayedReturn = new Common.DelayedReturn();
            this.$cont = $cont;
            this.id = id;
        }
        RangeSlider.prototype.getRange = function () {
            return {
                from: parseInt(this.$from.val()),
                to: parseInt(this.$to.val())
            };
        };
        RangeSlider.prototype.rangeChanged = function (from, to) {
            var _this = this;
            if (this.onRangeChanged) {
                this.delayedReturn.receive(function () {
                    _this.onRangeChanged(from, to);
                });
            }
        };
        RangeSlider.prototype.setVals = function (from, to) {
            this.slider.set([from, to]);
            this.$from.val(from);
            this.$to.val(to);
        };
        RangeSlider.prototype.genSlider = function (min, max) {
            var _this = this;
            var t = Views.ViewBase.currentView.registerTemplate("range-slider-template");
            var context = {
                id: this.id
            };
            var $t = $(t(context));
            this.$cont.html($t);
            var slider = $t.find("#" + this.id)[0];
            this.$from = $("#" + this.id + "_from");
            this.$to = $("#" + this.id + "_to");
            this.$from.val(min);
            this.$to.val(max);
            this.slider = noUiSlider.create(slider, {
                start: [min + 1, max - 1],
                connect: true,
                step: 1,
                range: {
                    "min": min,
                    "max": max
                }
            });
            var fromCall = new Common.DelayedCallback(this.$from);
            fromCall.delay = 500;
            fromCall.callback = function (val) {
                var fixedVal = val;
                if (val < min) {
                    fixedVal = min;
                    _this.$from.val(fixedVal);
                }
                _this.slider.set([fixedVal, null]);
                _this.rangeChanged(fixedVal, _this.$to.val());
            };
            var toCall = new Common.DelayedCallback(this.$to);
            toCall.delay = 500;
            toCall.callback = function (val) {
                var fixedVal = val;
                if (val > max) {
                    fixedVal = max;
                    _this.$to.val(fixedVal);
                }
                _this.slider.set([null, fixedVal]);
                _this.rangeChanged(_this.$from.val(), fixedVal);
            };
            this.slider.on("slide", function (range) {
                var from = parseInt(range[0]);
                var to = parseInt(range[1]);
                _this.$from.val(from);
                _this.$to.val(to);
                _this.rangeChanged(from, to);
            });
        };
        return RangeSlider;
    }());
    Planning.RangeSlider = RangeSlider;
})(Planning || (Planning = {}));
//# sourceMappingURL=RangeSlider.js.map