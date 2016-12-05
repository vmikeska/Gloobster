var Planning;
(function (Planning) {
    var TimeSlider = (function () {
        function TimeSlider($cont, id) {
            this.delayedReturn = new Common.DelayedReturn();
            this.$cont = $cont;
            this.id = id;
        }
        TimeSlider.prototype.genSlider = function () {
            var _this = this;
            var t = Views.ViewBase.currentView.registerTemplate("time-slider-template");
            var min = 0;
            var max = 96;
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
            this.display(min, max);
            var si = noUiSlider.create(slider, {
                start: [min, max],
                connect: true,
                step: 1,
                range: {
                    "min": min,
                    "max": max
                }
            });
            si.on("slide", function (range) {
                var from = parseInt(range[0]);
                var to = parseInt(range[1]);
                _this.display(from, to);
                _this.rangeChanged(from * 15, to * 15);
            });
        };
        TimeSlider.prototype.display = function (from, to) {
            this.$from.html(this.toTime(from));
            this.$to.html(this.toTime(to));
        };
        TimeSlider.prototype.toTime = function (val) {
            var mins = val * 15;
            var h = Math.floor(mins / 60);
            var m = mins % 60;
            var res = this.zero(h) + ":" + this.zero(m);
            return res;
        };
        TimeSlider.prototype.zero = function (val) {
            if (val.toString().length === 1) {
                return "0" + val;
            }
            return val;
        };
        TimeSlider.prototype.rangeChanged = function (from, to) {
            var _this = this;
            if (this.onRangeChanged) {
                this.delayedReturn.receive(function () {
                    _this.onRangeChanged(from, to);
                });
            }
        };
        return TimeSlider;
    }());
    Planning.TimeSlider = TimeSlider;
})(Planning || (Planning = {}));
//# sourceMappingURL=TimeSlider.js.map