module Planning {


	export class TimeSlider {

		public onRangeChanged: Function;

		private $cont;
		private id;

		private $from;
		private $to;

		constructor($cont, id) {
			this.$cont = $cont;
			this.id = id;
		}

		public genSlider() {
			var t = Views.ViewBase.currentView.registerTemplate("time-slider-template");

			var min = 0;
			var max = 96;

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

			this.display(min, max);

			var si = noUiSlider.create(slider,
			{
				start: [min, max],
				connect: true,
				step: 1,
				range: {
					"min": min,
					"max": max
				}
			});

			si.on("slide", (range) => {
					var from = parseInt(range[0]);
					var to = parseInt(range[1]);
					this.display(from, to);

					this.rangeChanged(from * 15, to * 15);
				});
		}

		private display(from, to) {
			this.$from.html(this.toTime(from));
			this.$to.html(this.toTime(to));
		}

		private toTime(val) {
			var mins = val * 15;

			var h = Math.floor(mins / 60);
			var m = mins % 60;
			var res = `${this.zero(h)}:${this.zero(m)}`;
			return res;
		}

		private zero(val) {
			if (val.toString().length === 1) {
				return `0${val}`;
			}
			return val;
		}

		private delayedReturn = new Common.DelayedReturn();

		private rangeChanged(from, to) {

			if (this.onRangeChanged) {
				this.delayedReturn.receive(() => {
					this.onRangeChanged(from, to);					
				});
			}

		}

	}
		

	
}