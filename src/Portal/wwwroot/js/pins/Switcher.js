var Views;
(function (Views) {
    var Switcher = (function () {
        function Switcher() {
            this.acls = "active";
            this.groups = [{ name: "data-type", act: 0 }];
        }
        Switcher.prototype.init = function () {
            var _this = this;
            this.groups.forEach(function (g) {
                var $g = $("." + g.name);
                var $aact = $g.find("a[data-gv=\"" + g.act + "\"]");
                $aact.addClass(_this.acls);
                $g.find("a").click(function (e) {
                    e.preventDefault();
                    var $a = $(e.target).closest("a");
                    var val = $a.data("gv");
                    $g.find("a").removeClass(_this.acls);
                    $a.addClass(_this.acls);
                    g.act = val;
                    _this.onChange(g.name, val);
                });
            });
        };
        Switcher.prototype.setGroupVal = function (name, val) {
            var g = this.getGroup(name);
            g.act = val;
            var $g = $("." + g.name);
            $g.find("a").removeClass("active");
            var $aact = $g.find("a[data-gv=\"" + g.act + "\"]");
            $aact.addClass("active");
            this.onChange(name, val);
        };
        Switcher.prototype.getGroup = function (name) {
            var g = _.find(this.groups, function (g) { return g.name === name; });
            return g;
        };
        Switcher.prototype.getGroupVal = function (name) {
            var g = this.getGroup(name);
            return g.act;
        };
        return Switcher;
    }());
    Views.Switcher = Switcher;
})(Views || (Views = {}));
//# sourceMappingURL=Switcher.js.map