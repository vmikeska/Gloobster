var Common;
(function (Common) {
    var CustomCheckbox = (function () {
        function CustomCheckbox($root, checked) {
            var _this = this;
            if (checked === void 0) { checked = false; }
            this.$root = $root;
            this.$checker = this.$root.find(".checker");
            this.setChecker(checked);
            this.$root.click(function (e) {
                var newState = !_this.isChecked();
                _this.setChecker(newState);
                if (_this.onChange) {
                    _this.onChange($root.attr("id"), newState);
                }
            });
        }
        CustomCheckbox.prototype.isChecked = function () {
            return this.$checker.hasClass("icon-checkmark");
        };
        CustomCheckbox.prototype.setChecker = function (checked) {
            this.$checker.removeClass("icon-checkmark");
            this.$checker.removeClass("icon-checkmark2");
            if (checked) {
                this.$checker.addClass("icon-checkmark");
            }
            else {
                this.$checker.addClass("icon-checkmark2");
            }
        };
        return CustomCheckbox;
    }());
    Common.CustomCheckbox = CustomCheckbox;
})(Common || (Common = {}));
//# sourceMappingURL=CustomCheckbox.js.map