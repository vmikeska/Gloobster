module Trip {
	

		export class TripResizer {
			public onBeforeResize: Function;
			public onAfterResize: Function;

			private rootCont = ".scheduler";
			private itemCont = ".block";
			
			private timeout;
			
			constructor() {					
					this.initResize();
			}

			public getLast(blockNo) {
					
					var $lastBlock;

					var can = true;
					var curBlockNo = blockNo;
					
					while (can) {
							var nextBlockNo = curBlockNo + 1;
							
							var $i = $(`${this.rootCont} ${this.itemCont}[data-no="${curBlockNo}"]`);
							var $ni = $(`${this.rootCont} ${this.itemCont}[data-no="${(nextBlockNo)}"]`);

							var hasNext = $ni.length > 0;
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
				
			private initResize() {

					$(window).resize(() => {
						if (this.onBeforeResize) {
							this.onBeforeResize();
						}

						if (this.timeout) {
							window.clearTimeout(this.timeout);
						}

						this.timeout = setTimeout(() => {
							if (this.onAfterResize) {
								this.onAfterResize();
							}
						}, 300);
							
					});
			}
	}

}