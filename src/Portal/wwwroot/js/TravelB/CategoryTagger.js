var TravelB;
(function (TravelB) {
    var CategoryTagger = (function () {
        function CategoryTagger() {
        }
        CategoryTagger.prototype.layout = function () {
            var $l = $("<div class=\"wantDosMain\"><div class=\"selected\"></div><div class=\"tabsCont\"></div><div class=\"dataCont\"></div></div>");
            this.$cont.html($l);
        };
        CategoryTagger.prototype.initData = function (data) {
            var _this = this;
            if (data.length > 0) {
                this.hideEmptyText();
            }
            data.forEach(function (id) {
                var res = _this.findItemById(id);
                if (res) {
                    var $t = _this.tagItem(res.foundCat, id, res.foundItem.text);
                    _this.$selected.append($t);
                }
            });
        };
        CategoryTagger.prototype.create = function ($cont, instName, data, emptyText) {
            var _this = this;
            if (emptyText === void 0) { emptyText = null; }
            this.instName = instName;
            this.emptyText = emptyText;
            this.data = data;
            this.$cont = $cont;
            this.layout();
            this.$selected = $cont.find(".selected");
            var $tc = $cont.find(".tabsCont");
            this.$dataCont = this.$cont.find(".dataCont");
            this.tabs = new TravelB.Tabs($tc, "WantDo", 30);
            this.data.forEach(function (catData) {
                var groupName = catData.k;
                _this.tabs.addTab(_this.tabId(instName, catData.k), groupName, function () {
                    _this.tabClick(catData);
                });
            });
            this.tabs.create();
            this.showEmptyText();
        };
        CategoryTagger.prototype.showEmptyText = function () {
            if (this.emptyText) {
                this.$selected.html("<div class=\"empty\">" + this.emptyText + "</div>");
            }
        };
        CategoryTagger.prototype.hideEmptyText = function () {
            if (this.emptyText) {
                this.$selected.find(".empty").remove();
            }
        };
        CategoryTagger.prototype.findItemById = function (id) {
            var found = false;
            var foundItem;
            var foundCat;
            this.data.forEach(function (catData) {
                var item = _.find(catData.items, function (d) { return d.id === id; });
                if (item) {
                    foundItem = item;
                    foundCat = catData.k;
                    found = true;
                }
            });
            if (found) {
                return { foundItem: foundItem, foundCat: foundCat };
            }
            else {
                return null;
            }
        };
        CategoryTagger.prototype.tabId = function (instName, catName) {
            return "tab_" + instName + "_" + catName;
        };
        CategoryTagger.prototype.tabClick = function (catData) {
            var _this = this;
            var itms = catData.items;
            this.$dataCont.html("");
            var ids = this.getSelectedIds();
            itms = _.reject(itms, function (i) {
                return _.contains(ids, i.id);
            });
            itms.forEach(function (i) {
                var $i = _this.catItem(catData.k, i.id, i.text);
                _this.$dataCont.append($i);
            });
        };
        CategoryTagger.prototype.getSelectedIds = function () {
            var ids = [];
            var tags = this.$selected.find(".tag").toArray();
            tags.forEach(function (t) {
                var $t = $(t);
                ids.push($t.data("id"));
            });
            return ids;
        };
        CategoryTagger.prototype.catItem = function (catId, id, name) {
            var _this = this;
            var $i = $("<span class=\"tag\" data-catid=\"" + catId + "\" data-id=\"" + id + "\">" + name + "</span>");
            $i.click(function (e) {
                e.preventDefault();
                _this.addToSelected(catId, id, name);
                $i.remove();
            });
            return $i;
        };
        CategoryTagger.prototype.tagItem = function (catId, id, name) {
            var _this = this;
            var $i = $("<span class=\"tag\" data-catid=\"" + catId + "\" data-id=\"" + id + "\">" + name + "<a class=\"icon-cross-small\" href=\"#\"></a></span>");
            $i.find("a").click(function (e) {
                e.preventDefault();
                if (_this.tabs.activeTabId === _this.tabId(_this.instName, catId)) {
                    var $di = _this.catItem(catId, id, name);
                    _this.$dataCont.append($di);
                }
                $i.remove();
                if (_this.onFilterChange) {
                    _this.onFilterChange(false, id);
                }
                if (_this.$selected.find(".tag").length === 0) {
                    _this.showEmptyText();
                }
            });
            return $i;
        };
        CategoryTagger.prototype.addToSelected = function (catId, id, name) {
            this.hideEmptyText();
            var $t = this.tagItem(catId, id, name);
            this.$selected.append($t);
            if (this.onFilterChange) {
                this.onFilterChange(true, id);
            }
        };
        return CategoryTagger;
    }());
    TravelB.CategoryTagger = CategoryTagger;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CategoryTagger.js.map