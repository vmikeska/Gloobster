module Planning {
	export class DealsLevelFilter {
		private currentStarsCnt = 5;
		private currentLevel = ScoreLevel.Excellent;

		private $root = $(".levels");
		private $levels = this.$root.find(".level");
		private $l5 = this.$root.find(".lev5");
		private $l3 = this.$root.find(".lev3");
		private $l1 = this.$root.find(".lev1");

		constructor() {
			this.init();
		}

		private init() {
						
			this.$levels.mouseenter((e) => {

				this.$levels.removeClass("active");

				var $t = $(e.delegateTarget);
				if ($t.hasClass("lev5")) {
					this.levelsHover(5);
				}
				if ($t.hasClass("lev3")) {
					this.levelsHover(3);
				}
				if ($t.hasClass("lev1")) {
					this.levelsHover(1);
				}

			});

			this.$levels.mouseleave((e) => {
				this.$levels.removeClass("active");
				this.levelsHover(this.currentStarsCnt);
			});

			this.$levels.click((e) => {
				var $t = $(e.delegateTarget);
				var val = $t.data("s");

				this.currentStarsCnt = val;

				if (val === 5) {
					this.currentLevel = ScoreLevel.Excellent;
				}
				if (val === 3) {
					this.currentLevel = ScoreLevel.Good;
				}
				if (val === 1) {
					this.currentLevel = ScoreLevel.Standard;
				}

				//this.stateChanged();
			});
		}

		private levelsHover(stars) {

			this.$l5.addClass("active");

			if (stars <= 3) {
				this.$l3.addClass("active");
			}

			if (stars <= 1) {
				this.$l1.addClass("active");
			}
		}
	}
}