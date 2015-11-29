var WeekendForm = (function () {
    function WeekendForm(data) {
        var _this = this;
        this.$plus1 = $("#plus1");
        this.$plus2 = $("#plus2");
        this.setDaysCheckboxes(data.extraDaysLength);
        this.$plus1.click(function (e) {
            var checked = _this.$plus1.prop("checked");
            if (checked) {
                _this.extraDaysClicked(1);
            }
            else {
                _this.extraDaysClicked(0);
            }
        });
        this.$plus2.click(function (e) {
            var checked = _this.$plus2.prop("checked");
            if (checked) {
                _this.extraDaysClicked(2);
            }
            else {
                _this.extraDaysClicked(1);
            }
        });
    }
    WeekendForm.prototype.setDaysCheckboxes = function (length) {
        if (length === 0) {
            this.$plus1.prop("checked", false);
            this.$plus2.prop("checked", false);
        }
        if (length === 1) {
            this.$plus1.prop("checked", true);
            this.$plus2.prop("checked", false);
        }
        if (length === 2) {
            this.$plus1.prop("checked", true);
            this.$plus2.prop("checked", true);
        }
    };
    WeekendForm.prototype.extraDaysClicked = function (length) {
        var _this = this;
        var data = PlanningSender.createRequest(PlanningType.Weekend, "ExtraDaysLength", { length: length });
        PlanningSender.updateProp(data, function (response) {
            _this.setDaysCheckboxes(length);
        });
    };
    return WeekendForm;
})();
//# sourceMappingURL=WeekendForm.js.map