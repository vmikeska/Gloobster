var Planning;
(function (Planning) {
    var NamesList = (function () {
        function NamesList(searches) {
            var _this = this;
            this.searches = [];
            this.isEditMode = false;
            this.searches = searches;
            NamesList.selectedSearch = this.searches[0];
            this.$nameInput = $("#nameInput");
            this.$nameSaveBtn = $("#nameSaveBtn");
            this.$nameEditBtn = $("#nameEditBtn");
            this.$selectedSpan = $("#selectedSpan");
            this.$searchesList = $("#searchesList");
            this.$addNewItem = $("#addNewItem");
            this.$nameEditBtn.click(function () { return _this.editClick(); });
            this.$nameSaveBtn.click(function () { return _this.saveClick(); });
            this.$nameInput.focusout(function () {
                _this.saveNewName();
            });
            this.$addNewItem.click(function () {
                var data = Planning.PlanningSender.createRequest(PlanningType.Custom, "createNewSearch", {
                    searchName: 'new search'
                });
                Planning.PlanningSender.pushProp(data, function (newSearch) {
                    searches.push(newSearch);
                    NamesList.selectedSearch = newSearch;
                    _this.addItem(newSearch);
                    _this.setToEditMode();
                    _this.onSearchChanged(newSearch);
                });
            });
            this.fillList();
        }
        NamesList.prototype.fillList = function () {
            var _this = this;
            this.$searchesList.html("");
            this.searches.forEach(function (search) {
                _this.addItem(search);
            });
            NamesList.selectedSearch = this.searches[0];
            this.$selectedSpan.text(NamesList.selectedSearch.searchName);
        };
        NamesList.prototype.addItem = function (search) {
            var _this = this;
            var itemHtml = "<li data-si=\"" + search.id + "\">" + search.searchName + "</li>";
            var $item = $(itemHtml);
            this.$searchesList.append($item);
            $item.click(function (e) {
                _this.itemClick($item);
            });
        };
        NamesList.prototype.itemClick = function ($item) {
            var searchId = $item.data("si");
            var search = _.find(this.searches, function (search) { return search.id === searchId; });
            NamesList.selectedSearch = search;
            this.onSearchChanged(search);
        };
        NamesList.prototype.saveClick = function () {
            this.saveNewName();
        };
        NamesList.prototype.editClick = function () {
            this.setToEditMode();
        };
        NamesList.prototype.saveNewName = function () {
            var _this = this;
            var newName = this.$nameInput.val();
            var data = Planning.PlanningSender.createRequest(PlanningType.Custom, "renameSearch", {
                id: NamesList.selectedSearch.id,
                searchName: newName
            });
            Planning.PlanningSender.updateProp(data, function (res) {
                NamesList.selectedSearch.searchName = newName;
                _this.$nameInput.hide();
                _this.$selectedSpan.show();
                _this.$nameEditBtn.show();
                _this.$nameSaveBtn.hide();
                _this.isEditMode = false;
                _this.$selectedSpan.text(newName);
                _this.$searchesList.find("li[data-si='" + NamesList.selectedSearch.id + "']").text(newName);
            });
        };
        NamesList.prototype.setToEditMode = function () {
            this.$nameInput.show();
            this.$nameInput.val(NamesList.selectedSearch.searchName);
            this.$selectedSpan.hide();
            this.$nameEditBtn.hide();
            this.$nameSaveBtn.show();
            this.isEditMode = true;
            this.$nameInput.focus();
            this.$nameInput.select();
        };
        return NamesList;
    }());
    Planning.NamesList = NamesList;
})(Planning || (Planning = {}));
//# sourceMappingURL=NamesList.js.map