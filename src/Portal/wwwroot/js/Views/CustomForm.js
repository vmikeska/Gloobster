var CustomForm = (function () {
    function CustomForm(data) {
        var _this = this;
        this.data = data;
        this.namesList = new NamesList(data.searches);
        this.namesList.onSearchChanged = function (search) { return _this.onSearchChanged(search); };
        this.registerDuration();
        this.initTimeTagger(this.namesList.currentSearch);
        this.fillForm(this.namesList.currentSearch);
    }
    CustomForm.prototype.onSearchChanged = function (search) {
        this.fillForm(search);
    };
    CustomForm.prototype.fillForm = function (search) {
        var timeSelectedItems = this.getTimeTaggerSelectedItems(search);
        this.timeTagger.setSelectedItems(timeSelectedItems);
        this.initDuration(search.roughlyDays);
    };
    CustomForm.prototype.initTimeTagger = function (search) {
        var _this = this;
        var itemsRange = [
            { text: "January", value: 1, kind: "month" },
            { text: "February", value: 2, kind: "month" },
            { text: "March", value: 3, kind: "month" },
            { text: "April", value: 4, kind: "month" },
            { text: "May", value: 5, kind: "month" },
            { text: "June", value: 6, kind: "month" },
            { text: "July", value: 7, kind: "month" },
            { text: "August", value: 8, kind: "month" },
            { text: "September", value: 9, kind: "month" },
            { text: "October", value: 10, kind: "month" },
            { text: "November", value: 11, kind: "month" },
            { text: "December", value: 12, kind: "month" },
            { text: "year 2015", value: 2015, kind: "year" },
            { text: "year 2016", value: 2016, kind: "year" }
        ];
        this.timeTagger = new TaggingField(search.id, "timeTagger", itemsRange);
        this.timeTagger.onItemClickedCustom = function ($target, callback) {
            var val = $target.data("vl");
            var kind = $target.data("kd");
            var text = $target.text();
            var data = PlanningSender.createRequest(PlanningType.Custom, "time", {
                kind: kind,
                value: val,
                id: _this.namesList.currentSearch.id
            });
            PlanningSender.pushProp(data, function (res) {
                callback(res);
            });
        };
    };
    CustomForm.prototype.getTimeTaggerSelectedItems = function (search) {
        var selectedItems = [];
        search.months.forEach(function (month) {
            selectedItems.push({ value: month, kind: "month" });
        });
        search.years.forEach(function (year) {
            selectedItems.push({ value: year, kind: "year" });
        });
        return selectedItems;
    };
    CustomForm.prototype.initDuration = function (days) {
        if (days === 0) {
            this.setRadio(1, true);
        }
        else if (days === 3) {
            this.setRadio(2, true);
        }
        else if (days === 7) {
            this.setRadio(3, true);
        }
        else if (days === 14) {
            this.setRadio(4, true);
        }
        else {
            this.setRadio(5, true);
            $("#customLength").show();
            $("#customLength").val(days);
        }
    };
    CustomForm.prototype.setRadio = function (no, val) {
        $("#radio" + no).prop("checked", val);
    };
    CustomForm.prototype.registerDuration = function () {
        var _this = this;
        var dc = new DelayedCallback("customLength");
        dc.callback = function (val) {
            var intVal = parseInt(val);
            if (intVal) {
                _this.callUpdateMinLength(intVal);
            }
        };
        var $lengthRadio = $("input[type=radio][name=radio]");
        var $customLength = $("#customLength");
        $lengthRadio.change(function (e) {
            var $target = $(e.target);
            var val = $target.data("vl");
            if (val === "custom") {
                $customLength.show();
            }
            else {
                $customLength.hide();
                _this.callUpdateMinLength(parseInt(val));
            }
        });
    };
    CustomForm.prototype.callUpdateMinLength = function (roughlyDays) {
        var data = PlanningSender.createRequest(PlanningType.Custom, "roughlyDays", {
            id: this.namesList.currentSearch.id,
            days: roughlyDays
        });
        PlanningSender.updateProp(data, function (res) {
        });
    };
    return CustomForm;
})();
//# sourceMappingURL=CustomForm.js.map