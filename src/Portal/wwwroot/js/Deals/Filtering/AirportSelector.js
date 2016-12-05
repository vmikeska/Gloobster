var Planning;
(function (Planning) {
    var AirportSelector = (function () {
        function AirportSelector($cont, pairs) {
            this.pairs = pairs;
            this.$cont = $cont;
        }
        AirportSelector.prototype.init = function () {
            var _this = this;
            var lg = Common.ListGenerator.init(this.$cont, "air-pair-item-template");
            lg.activeItem = function (item) {
                return { isActive: true, cls: "active" };
            };
            lg.evnt(null, function (e, $item, $target, item) {
                $item.toggleClass("active");
                if (_this.onChange) {
                    _this.onChange();
                }
            });
            lg.generateList(this.pairs);
        };
        AirportSelector.prototype.getActive = function () {
            var sel = [];
            var pairs = this.$cont.find(".pair").toArray();
            pairs.forEach(function (p) {
                var $p = $(p);
                if ($p.hasClass("active")) {
                    sel.push({ from: $p.data("f"), to: $p.data("t") });
                }
            });
            return sel;
        };
        AirportSelector.toString = function (pair) {
            return pair.from + "-" + pair.to;
        };
        return AirportSelector;
    }());
    Planning.AirportSelector = AirportSelector;
})(Planning || (Planning = {}));
//# sourceMappingURL=AirportSelector.js.map