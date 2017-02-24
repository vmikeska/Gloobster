module Planning {
		export class DealsLevelFilter {

			public stateChanged: Function;

			public static currentStars = 5;

			public static currentLevel = ScoreLevel.Excellent;
			public static currentScore = 0.8;

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
				this.levelsHover(DealsLevelFilter.currentStars);
			});

			this.$levels.click((e) => {
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

				this.stateChanged();
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