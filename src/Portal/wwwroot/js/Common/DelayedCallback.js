var Common;
(function (Common) {
    var DelayedCallback = (function () {
        function DelayedCallback(input) {
            var _this = this;
            this.delay = 1000;
            this.timeoutId = null;
            var isId = (typeof input === "string");
            if (isId) {
                this.$input = $("#" + input);
            }
            else {
                this.$input = input;
            }
            this.$input.keydown(function () { _this.keyPressed(); });
        }
        DelayedCallback.prototype.keyPressed = function () {
            var _this = this;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = null;
                var val = _this.$input.val();
                _this.callback(val);
            }, this.delay);
        };
        return DelayedCallback;
    }());
    Common.DelayedCallback = DelayedCallback;
})(Common || (Common = {}));
//# sourceMappingURL=DelayedCallback.js.map