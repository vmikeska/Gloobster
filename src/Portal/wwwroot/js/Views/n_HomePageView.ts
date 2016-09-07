module Views {
	export class NHomePageView extends ViewBase {

		constructor() {
			super();

			SettingsUtils.registerLocationCombo("currentCity", "CurrentLocation", () => {
				window.location.href = "/Destination/planning";
			});

			this.markLasts();
			this.initResize();

		}

		private timeout;

		private markLasts(callback = null) {
			var $is = $(".mdiv > .i");
			$is.removeClass("last");
			$is.last().addClass("last");

			if (this.timeout) {
				window.clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {

				$is.each((index, i) => {
					var $i = $(i);
					if ($i.next().length && $i.offset().top < $i.next().offset().top) {

						$i.addClass("last");
					}

					});

				if (callback) {
					callback();
				}

			}, 100);
		}

			private printLast() {
					var dbg = _.map($(".last").toArray(), (i) => {
							return i.innerHTML + "";
					}).join();
					console.log(dbg);
			}

		private getLast($displayed) {

				var $lastInRow;

				if ($displayed.hasClass("last")) {
						$lastInRow = $displayed;
				} else {
						var $is = $(".mdiv > .i");

						var isArray = $is.toArray();
						isArray = _.sortBy(isArray, (index, item) => {
								var $i = $(item);
								return $i.data("no");
						});

						var $last = $(_.last(isArray));
						
						var clickedNo = $displayed.data("no");
						var foundStart = false;

						isArray.some((i) => {
								var $i = $(i);
								var txt = $i.html();
								
								var hasLast = $i.hasClass("last");

								if (foundStart && hasLast) {
										$lastInRow = $i;
										return true;
								}

								if ($last.data("no") === $i.data("no")) {
										return true;
								}

								if (clickedNo === $i.data("no")) {
										foundStart = true;
								}
						});						
				}

				return $lastInRow;
		}

		private $active;
		private $currentDetail;
		private initResize() {

			var $is = $(".mdiv > .i");
			$is.click((e) => {

					if (this.$currentDetail) {
							this.$currentDetail.remove();							
							this.$currentDetail = null;
					}

				var $t = $(e.target);
				this.$active = $t;
				var txt = $t.html();

				var $lastInRow = this.getLast($t);
				this.$currentDetail = $(`<div class="b">${txt}</div>`);
				$lastInRow.after(this.$currentDetail);
			});

			$(window).resize(() => {
					if (this.$currentDetail) {
							this.$currentDetail.hide();
					}

					this.markLasts(() => {
							if (this.$currentDetail && this.$active) {
									this.printLast();
									var $lastInRow = this.getLast(this.$active);
									$lastInRow.after(this.$currentDetail);
									this.$currentDetail.show();
							}	
					});
					
			});
		}


		public get pageType(): PageType { return PageType.HomePage; }

	}
}