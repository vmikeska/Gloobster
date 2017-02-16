var Planning;
(function (Planning) {
    var DealsLevelFilter = (function () {
        function DealsLevelFilter() {
            this.currentStarsCnt = 5;
            this.currentLevel = ScoreLevel.Excellent;
            this.$root = $(".levels");
            this.$levels = this.$root.find(".level");
            this.$l5 = this.$root.find(".lev5");
            this.$l3 = this.$root.find(".lev3");
            this.$l1 = this.$root.find(".lev1");
            this.init();
        }
        DealsLevelFilter.prototype.init = function () {
            var _this = this;
            this.$levels.mouseenter(function (e) {
                _this.$levels.removeClass("active");
                var $t = $(e.delegateTarget);
                if ($t.hasClass("lev5")) {
                    _this.levelsHover(5);
                }
                if ($t.hasClass("lev3")) {
                    _this.levelsHover(3);
                }
                if ($t.hasClass("lev1")) {
                    _this.levelsHover(1);
                }
            });
            this.$levels.mouseleave(function (e) {
                _this.$levels.removeClass("active");
                _this.levelsHover(_this.currentStarsCnt);
            });
            this.$levels.click(function (e) {
                var $t = $(e.delegateTarget);
                var val = $t.data("s");
                _this.currentStarsCnt = val;
                if (val === 5) {
                    _this.currentLevel = ScoreLevel.Excellent;
                }
                if (val === 3) {
                    _this.currentLevel = ScoreLevel.Good;
                }
                if (val === 1) {
                    _this.currentLevel = ScoreLevel.Standard;
                }
            });
        };
        DealsLevelFilter.prototype.levelsHover = function (stars) {
            this.$l5.addClass("active");
            if (stars <= 3) {
                this.$l3.addClass("active");
            }
            if (stars <= 1) {
                this.$l1.addClass("active");
            }
        };
        return DealsLevelFilter;
    }());
    Planning.DealsLevelFilter = DealsLevelFilter;
})(Planning || (Planning = {}));
//# sourceMappingURL=DealsLevelFilter.js.map