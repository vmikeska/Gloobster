module Common {
	export class LastItem {
		public static getLast($rootCont, itemClass, blockNo) {

			var $lastBlock;

			var can = true;
			var curBlockNo = blockNo;

			while (can) {
				var nextBlockNo = curBlockNo + 1;

				var $i = this.findByNo($rootCont, itemClass, curBlockNo);
				var $ni = this.findByNo($rootCont, itemClass, nextBlockNo);

				var hasNext = $ni != null;
				if (hasNext) {
					var currentTop = $i.offset().top;
					var nextTop = $ni.offset().top;

					if (currentTop < nextTop) {
						$lastBlock = $i;
						can = false;
					}
				} else {
					$lastBlock = $i;
					can = false;
				}

				curBlockNo++;
			}

			return $lastBlock;
		}

		private static findByNo($rootCont, itemClass, no) {
			var $found = null;
			$rootCont.find(`.${itemClass}`).toArray().forEach((i) => {
				var $i = $(i);
				if (parseInt($i.data("no")) === no) {
					$found = $i;
				}
			});

			return $found;
		}
	}
}