module Planning {
		
	export class RangeSlider {

		public onRangeChanged: Function;

		private $from;
		private $to;

		private $cont;
		private id;

		private slider;

		constructor($cont, id) {
			this.$cont = $cont;
			this.id = id;
		}

		public getRange() {
			return {
				from: parseInt(this.$from.val()),
				to: parseInt(this.$to.val())
			};
		}

		private delayedReturn = new Common.DelayedReturn();

		private rangeChanged(from, to) {

				if (this.onRangeChanged) {
						this.delayedReturn.receive(() => {
								this.onRangeChanged(from, to);
						});
				}
		}

		public setVals(from, to) {
			this.slider.set([from, to]);
			this.$from.val(from);
			this.$to.val(to);
		}

		public genSlider(min, max) {
			var t = Views.ViewBase.currentView.registerTemplate("range-slider-template");

			var context = {
				id: this.id
			};

			var $t = $(t(context));

			this.$cont.html($t);

			var slider = $t.find(`#${this.id}`)[0];

			this.$from = $(`#${this.id}_from`);
			this.$to = $(`#${this.id}_to`);

			this.$from.val(min);
			this.$to.val(max);
	
			this.slider = noUiSlider.create(slider,
			{
				start: [min +1, max -1],
				connect: true,
				step: 1,
				range: {
					"min": min,
					"max": max
				}
			});

			var fromCall = new Common.DelayedCallback(this.$from);
			fromCall.delay = 500;
			fromCall.callback = (val) => {

				var fixedVal = val;
				if (val < min) {
					fixedVal = min;
					this.$from.val(fixedVal);
				}

				this.slider.set([fixedVal, null]);

				this.rangeChanged(fixedVal, this.$to.val());
			}

			var toCall = new Common.DelayedCallback(this.$to);
			toCall.delay = 500;
			toCall.callback = (val) => {

				var fixedVal = val;
				if (val > max) {
					fixedVal = max;
					this.$to.val(fixedVal);
				}

				this.slider.set([null, fixedVal]);

				this.rangeChanged(this.$from.val(), fixedVal);
			}
				
			this.slider.on("slide", (range) => {
					var from = parseInt(range[0]);
					var to = parseInt(range[1]);
					this.$from.val(from);
					this.$to.val(to);

					this.rangeChanged(from, to);
				});
		}


	}

	
}