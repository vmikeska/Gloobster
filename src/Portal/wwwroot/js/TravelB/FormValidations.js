var TravelB;
(function (TravelB) {
    var FormValidations = (function () {
        function FormValidations() {
            this.ic = "invalid";
            this.validatedItems = [];
        }
        FormValidations.prototype.isAllValid = function () {
            var allValid = true;
            this.validatedItems.forEach(function (i) {
                if (!i.state) {
                    allValid = false;
                }
            });
            return allValid;
        };
        FormValidations.prototype.addItemVal = function () {
            var i = { state: false };
            this.validatedItems.push(i);
            return i;
        };
        FormValidations.prototype.valDropDownVal = function ($combo, $frame, invalidVal) {
            var _this = this;
            var valItem = this.addItemVal();
            this.valDropDownValBody($combo, $frame, valItem, invalidVal);
            var $i = $combo.find("input");
            $i.change(function () {
                _this.valDropDownValBody($combo, $frame, valItem, invalidVal);
            });
        };
        FormValidations.prototype.valDropDownValBody = function ($combo, $frame, valItem, invalidVal) {
            var $i = $combo.find("input");
            var val = $i.val();
            var isValid = parseInt(val) !== invalidVal;
            valItem.state = isValid;
            this.changed();
            this.visual(isValid, $frame);
            return isValid;
        };
        FormValidations.prototype.valTagger = function (tagger, $frame) {
            var _this = this;
            var valItem = this.addItemVal();
            this.valTaggerBody(tagger, $frame, valItem);
            tagger.onChange = function () {
                _this.valTaggerBody(tagger, $frame, valItem);
            };
        };
        FormValidations.prototype.valTaggerBody = function (tagger, $frame, valItem) {
            var anyItems = tagger.selectedItems.length > 0;
            valItem.state = anyItems;
            this.changed();
            this.visual(anyItems, $frame);
            return anyItems;
        };
        FormValidations.prototype.valPlace = function (box, $combo, $frame) {
            var _this = this;
            var valItem = this.addItemVal();
            this.valPlaceBody(box, $combo, $frame, valItem);
            $combo.change(function () {
                _this.valPlaceBody(box, $combo, $frame, valItem);
            });
        };
        FormValidations.prototype.valPlaceBody = function (box, $combo, $frame, valItem) {
            var isSelected = (box.lastText != undefined) && (box.lastText.length > 0);
            valItem.state = isSelected;
            this.changed();
            this.visual(isSelected, $frame);
            return isSelected;
        };
        FormValidations.prototype.valWantDo = function (tagger, $frame) {
            var _this = this;
            var valItem = this.addItemVal();
            this.valWantDoBody(tagger, $frame, valItem);
            tagger.onFilterChange = function () {
                _this.valWantDoBody(tagger, $frame, valItem);
            };
        };
        FormValidations.prototype.valWantDoBody = function (tagger, $frame, valItem) {
            var anySelected = tagger.getSelectedIds().length > 0;
            valItem.state = anySelected;
            this.changed();
            this.visual(anySelected, $frame);
            return anySelected;
        };
        FormValidations.prototype.valMessage = function ($txt, $frame, customVal) {
            var _this = this;
            if (customVal === void 0) { customVal = null; }
            var valItem = this.addItemVal();
            this.valMessageBody($txt, $frame, valItem, customVal);
            var dc = new Common.DelayedCallback($txt);
            dc.callback = function (val) {
                _this.valMessageBody($txt, $frame, valItem, customVal);
            };
        };
        FormValidations.prototype.valMessageBody = function ($txt, $frame, valItem, customVal) {
            if (customVal === void 0) { customVal = null; }
            var val = $txt.val();
            var hasText = val.length > 0;
            var isValid = hasText;
            if (isValid && customVal) {
                isValid = customVal(val);
            }
            valItem.state = isValid;
            this.changed();
            this.visual(isValid, $frame);
            return isValid;
        };
        FormValidations.prototype.valAvatar = function ($input, $frame) {
            var valItem = this.addItemVal();
            this.valAvatarBody($input, $frame, valItem);
            return valItem;
        };
        FormValidations.prototype.valAvatarBody = function ($input, $frame, valItem) {
            var hasImg = Boolean($input.data("valid"));
            valItem.state = hasImg;
            this.changed();
            this.visual(hasImg, $frame);
            return hasImg;
        };
        FormValidations.prototype.changed = function () {
            if (this.onChange) {
                this.onChange();
            }
        };
        FormValidations.prototype.visual = function (isValid, $frame) {
            if (isValid) {
                $frame.removeClass(this.ic);
            }
            else {
                $frame.addClass(this.ic);
            }
        };
        return FormValidations;
    }());
    TravelB.FormValidations = FormValidations;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=FormValidations.js.map