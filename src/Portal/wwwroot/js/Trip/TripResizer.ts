module Trip {
	

		export class TripResizer {
			public onBeforeResize: Function;
			public onAfterResize: Function;

			private rootCont = ".scheduler";
			private itemCont = ".block";
			private lastClass = "last-block";
			private itemsSelector = `${this.rootCont} > ${this.itemCont}`;

			private timeout;
			private $active;

			constructor() {
					this.markLasts();
					this.initResize();
			}

			private markLasts(callback = null) {
					var $is = $(this.itemsSelector);

					console.log("Removing lasts");

					$is.removeClass(this.lastClass);
					$is.last().addClass(this.lastClass);

					if (this.timeout) {
							window.clearTimeout(this.timeout);
					}

					this.timeout = setTimeout(() => {
							console.clear();
							$is.each((index, i) => {
									var $i = $(i);

									var txt = "travel";
									var placeName = $i.find(".name");
									if (placeName.length > 0) {
											txt = placeName.text();
									}

									var $nextItem = $i.next(this.itemCont);
									var hasNext = $nextItem.length > 0;
									if (hasNext) {
											var currentTop = $i.offset().top;
											var nextTop = $nextItem.offset().top;

											console.log(`${txt}: ${currentTop} - ${nextTop}`);

											if (currentTop < nextTop) {
													$i.addClass(this.lastClass);
											}
									}
							});

							if (callback) {
									callback();
							}

					}, 1000);
			}

			public getLast($displayed) {

					var $lastInRow;

					if ($displayed.hasClass(this.lastClass)) {
							$lastInRow = $displayed;
					} else {
							var $is = $(this.itemsSelector);

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

									var hasLast = $i.hasClass(this.lastClass);

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

			private initResize() {

					$(window).resize(() => {
							if (this.onBeforeResize) {
									this.onBeforeResize();
							}

							this.markLasts(() => {
									if (this.onAfterResize) {
											this.onAfterResize();
									}
							});

					});
			}
	}

}