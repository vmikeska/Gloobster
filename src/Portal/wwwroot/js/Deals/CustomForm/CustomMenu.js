var Planning;
(function (Planning) {
    var CustomMenu = (function () {
        function CustomMenu($cont) {
            this.actCls = "state-active";
            this.dataLoader = new Planning.SearchDataLoader();
            this.$cont = $cont;
        }
        CustomMenu.prototype.addItem = function (id, name) {
            this.headers.push({ id: id, name: name });
            this.init(this.headers, id);
        };
        CustomMenu.prototype.init = function (headers, initId) {
            var _this = this;
            if (initId === void 0) { initId = null; }
            this.headers = headers;
            this.$cont.find(".item").remove();
            var activeId = "";
            if (this.headers.length > 0) {
                activeId = this.headers[0].id;
            }
            if (initId) {
                activeId = initId;
            }
            var lg = Common.ListGenerator.init(this.$cont.find(".adder"), "custom-menu-btn-template");
            lg.appendStyle = "before";
            lg.activeItem = function (item) {
                var obj = {
                    isActive: item.id === activeId,
                    cls: _this.actCls
                };
                return obj;
            };
            lg.evnt(null, function (e, $item, $target, item) {
                _this.itemClicked($item);
            });
            lg.evnt(".delete", function (e, $item, $target, item) {
                _this.delClicked(item.id);
            });
            lg.evnt(".edit", function (e, $item, $target, item) {
                _this.editClicked($item);
            });
            lg.evnt(".edit-save", function (e, $item, $target, item) {
                _this.saveClicked($item);
            });
            lg.evnt(".name-edit", function (e, $item, $target, item) {
                _this.keyPressed(e, $item);
            })
                .setEvent("keyup");
            lg.generateList(headers);
        };
        CustomMenu.prototype.keyPressed = function (e, $item) {
            if (e.keyCode === 13) {
                this.saveClicked($item);
            }
        };
        CustomMenu.prototype.saveClicked = function ($item) {
            var id = $item.data("id");
            var name = $item.find(".name-edit").val();
            var header = _.find(this.headers, function (h) { return h.id === id; });
            header.name = name;
            var pdu = new Planning.PropsDataUpload(id, "name");
            pdu.setVal(name);
            pdu.send(function () {
                $item.find(".name-txt").html(name);
                $item.removeClass("state-editing");
                $item.addClass("state-active");
            });
        };
        CustomMenu.prototype.editClicked = function ($item) {
            $item.removeClass("state-active");
            $item.addClass("state-editing");
        };
        CustomMenu.prototype.delClicked = function (id) {
            var _this = this;
            var cd = new Common.ConfirmDialog();
            var v = Views.ViewBase.currentView;
            cd.create(v.t("SearchRemovalDlgTitle", "jsDeals"), v.t("SearchRemovalDlgBody", "jsDeals"), v.t("Cancel", "jsLayout"), v.t("Delete", "jsLayout"), function () {
                _this.dataLoader.deleteSearch(id, function () {
                    $("#" + id).remove();
                });
            });
        };
        CustomMenu.prototype.itemClicked = function ($item) {
            var id = $item.data("id");
            var $items = this.$cont.find(".item");
            $items.removeClass(this.actCls);
            $item.addClass(this.actCls);
            if (this.onSearchChange) {
                this.onSearchChange(id);
            }
        };
        return CustomMenu;
    }());
    Planning.CustomMenu = CustomMenu;
})(Planning || (Planning = {}));
//# sourceMappingURL=CustomMenu.js.map