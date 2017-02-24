var Planning;
(function (Planning) {
    var DealsLevelFilter = (function () {
        function DealsLevelFilter() {
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
                _this.levelsHover(DealsLevelFilter.currentStars);
            });
            this.$levels.click(function (e) {
                var $t = $(e.delegateTarget);
                var val = $t.data("s");
                DealsLevelFilter.currentStars = val;
                if (val === 5) {
                    DealsLevelFilter.currentLevel = ScoreLevel.Excellent;
                    DealsLevelFilter.currentScore = 0.8;
                }
                if (val === 3) {
                    DealsLevelFilter.currentLevel = ScoreLevel.Good;
                    DealsLevelFilter.currentScore = 0.66;
                }
                if (val === 1) {
                    DealsLevelFilter.currentLevel = ScoreLevel.Standard;
                    DealsLevelFilter.currentScore = 0.5;
                }
                _this.stateChanged();
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
        DealsLevelFilter.currentStars = 5;
        DealsLevelFilter.currentLevel = ScoreLevel.Excellent;
        DealsLevelFilter.currentScore = 0.8;
        return DealsLevelFilter;
    }());
    Planning.DealsLevelFilter = DealsLevelFilter;
})(Planning || (Planning = {}));
//# sourceMappingURL=DealsLevelFilter.js.map