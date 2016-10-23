var TravelB;
(function (TravelB) {
    var CityCheckinsMgmt = (function () {
        function CityCheckinsMgmt(view) {
            this.itemTmp = Views.ViewBase.currentView.registerTemplate("city-checkin-mgmt-item-template");
            this.$wcont = $(".checkin-win .cont");
            this.view = view;
        }
        CityCheckinsMgmt.prototype.genCheckins = function (callback) {
            var _this = this;
            this.$wcont.empty();
            Views.ViewBase.currentView.apiGet("CheckinCity", [["type", "my"]], function (cs) {
                cs.forEach(function (c) {
                    var context = TravelB.CheckinMapping.map(c, CheckinType.City);
                    var $item = $(_this.itemTmp(context));
                    $item.find(".edit").click(function (e) {
                        e.preventDefault();
                        var id = _this.getId(e);
                        _this.edit(id);
                    });
                    $item.find(".delete").click(function (e) {
                        e.preventDefault();
                        var id = _this.getId(e);
                        _this.delete(id, $item);
                    });
                    _this.$wcont.append($item);
                });
                callback();
            });
        };
        CityCheckinsMgmt.prototype.edit = function (id) {
            this.view.checkinMenu.activateTab("check", id);
        };
        CityCheckinsMgmt.prototype.delete = function (id, $item) {
            var cd = new Common.ConfirmDialog();
            cd.create(this.view.t("CheckinDelTitle", "jsTravelB"), this.view.t("CheckinDelBody", "jsTravelB"), this.view.t("Cancel", "jsLayout"), this.view.t("Delete", "jsLayout"), function () {
                Views.ViewBase.currentView.apiDelete("CheckinCity", [["id", id]], function () {
                    $item.remove();
                    cd.hide();
                });
            });
        };
        CityCheckinsMgmt.prototype.getId = function (e) {
            var $t = $(e.target);
            var $r = $t.closest(".checkin-mgmt-item");
            var id = $r.data("id");
            return id;
        };
        return CityCheckinsMgmt;
    }());
    TravelB.CityCheckinsMgmt = CityCheckinsMgmt;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CityCheckinsMgmt.js.map