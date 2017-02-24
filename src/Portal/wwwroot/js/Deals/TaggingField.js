var Planning;
(function (Planning) {
    var TaggingFieldConfig = (function () {
        function TaggingFieldConfig() {
            this.clientMatch = true;
        }
        return TaggingFieldConfig;
    }());
    Planning.TaggingFieldConfig = TaggingFieldConfig;
    var TaggingField = (function () {
        function TaggingField(config) {
            this.taggerTemplate = Views.ViewBase.currentView.registerTemplate("tagger-template");
            this.selectedItems = [];
            this.config = config;
            var v = Views.ViewBase.currentView;
            if (!this.config.placeholder) {
                this.config.placeholder = v.t("TaggingFieldPlacehoder", "jsLayout");
            }
            this.$cont = $("#" + this.config.containerId);
            this.$tagger = this.createTagger();
            this.$cont.prepend(this.$tagger);
        }
        TaggingField.prototype.setSelectedItems = function (selectedItems) {
            this.selectedItems = selectedItems;
            this.initTags(selectedItems);
        };
        TaggingField.prototype.initTags = function (selectedItems) {
            var _this = this;
            this.$cont.find(".tag").remove();
            selectedItems.forEach(function (selectedItem) {
                var item = null;
                if (_this.config.localValues) {
                    item = _.find(_this.config.itemsRange, function (i) { return i.kind === selectedItem.kind && i.value === selectedItem.value; });
                }
                else {
                    item = selectedItem;
                }
                if (item) {
                    var $html = _this.createTag(item.text, item.value, item.kind);
                    _this.$cont.prepend($html);
                }
            });
        };
        TaggingField.prototype.createTag = function (text, value, kind) {
            var _this = this;
            var $html = $("<span class=\"tag\" data-vl=\"" + value + "\" data-kd=\"" + kind + "\">" + text + "<a class=\"icon-cross-small\" href=\"#\"></a></span>");
            $html.find("a").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                _this.removeTag($target, $html);
            });
            return $html;
        };
        TaggingField.prototype.removeTag = function ($target, $html) {
            var _this = this;
            var val = $target.parent().data("vl");
            this.selectedItems = _.reject(this.selectedItems, function (i) {
                return i.value === val;
            });
            this.onDeleteCustom(val, function () {
                $html.remove();
                if (_this.onChange) {
                    _this.onChange(_this.selectedItems);
                }
            });
        };
        TaggingField.prototype.createTagger = function () {
            var _this = this;
            var context = {
                placeholder: this.config.placeholder
            };
            var html = this.taggerTemplate(context);
            var $html = $(html);
            var $input = $html.find("input");
            var $ul = $html.find("ul");
            $input.keyup(function (e) {
                _this.fillTagger($input, $ul);
            });
            $input.focus(function (e) {
                setTimeout(function () {
                    _this.fillTagger($input, $ul);
                    $ul.show();
                }, 250);
            });
            $input.focusout(function (e) {
                setTimeout(function () {
                    $input.val("");
                    $ul.hide();
                }, 250);
            });
            return $html;
        };
        TaggingField.prototype.fillTagger = function ($input, $ul) {
            var _this = this;
            $ul.html("");
            var inputVal = $input.val().toLowerCase();
            this.getItemsRange(inputVal, function (items) {
                items.forEach(function (item) {
                    var strMatch = true;
                    if (_this.config.clientMatch) {
                        strMatch = (inputVal === "") || (item.text.toLowerCase().startsWith(inputVal));
                    }
                    var alreadySelected = _.find(_this.selectedItems, function (i) {
                        return (i.value === item.value) && (i.kind === item.kind);
                    });
                    if (strMatch && !alreadySelected) {
                        var $item = _this.createTaggerItem(item.text, item.value, item.kind);
                        $ul.append($item);
                    }
                });
            });
        };
        TaggingField.prototype.getItemsRange = function (query, callback) {
            var itemsRange = null;
            if (this.config.localValues) {
                callback(this.config.itemsRange);
            }
            else {
                var prms = [["query", query]];
                Views.ViewBase.currentView.apiGet(this.config.listSource, prms, function (items) {
                    callback(items);
                });
            }
        };
        TaggingField.prototype.createTaggerItem = function (text, value, kind) {
            var _this = this;
            var $html = $("<li data-vl=\"" + value + "\" data-kd=\"" + kind + "\">" + text + "</li>");
            $html.click(function (e) {
                e.preventDefault();
                _this.onItemClicked($html);
            });
            return $html;
        };
        TaggingField.prototype.onItemClicked = function ($target) {
            var _this = this;
            var val = $target.data("vl");
            var kind = $target.data("kd");
            var text = $target.text();
            this.selectedItems.push({ value: val, kind: kind });
            this.onItemClickedCustom($target, function () {
                var $tag = _this.createTag(text, val, kind);
                _this.$tagger.before($tag);
            });
            if (this.onChange) {
                this.onChange(this.selectedItems);
            }
        };
        return TaggingField;
    }());
    Planning.TaggingField = TaggingField;
})(Planning || (Planning = {}));
//# sourceMappingURL=TaggingField.js.map