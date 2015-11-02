var DelayedCallback = (function () {
    function DelayedCallback(inputId) {
        var _this = this;
        this.delay = 1000;
        this.timeoutId = null;
        this.$input = $("#" + inputId);
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
})();
//# sourceMappingURL=DelayedCallback.js.map