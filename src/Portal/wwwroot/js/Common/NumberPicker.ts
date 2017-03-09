module Common {
		
		export class NumberPicker {

				public onChange;
				
				private $cont;
				private isNative;
				private min;
				private max;

				private $control;

			constructor($cont, min, max) {
				this.$cont = $cont;
				this.min = min;
				this.max = max;

				this.$cont.change(() => {
					if (this.onChange) {
						this.onChange();
					}
				});

				this.init();
			}

			public enabled(state: any = null) {
				if (state === null) {
					return !this.$cont.hasClass("disabled");
				}

				this.$cont.toggleClass("disabled", !state);
			}

			public val(v: any = null) {
				if (v) {
					this.$control.val(v);
				} else {
					return this.$control.val();
				}
			}

			private init() {
				var os = Views.ViewBase.getMobileOS();

				this.isNative = os !== OS.Other;

				if (this.isNative) {
					this.$control = $(`<input type="number" min="${this.min}" max="${this.max}" value="${this.min}" />`);
					this.$cont.html(this.$control);
				} else {
					this.$control = $(`<select></select>`);

					for (var act = this.min; act <= this.max; act++) {
						this.$control.append(`<option value="${act}">${act}</option>`);
					}
					this.$cont.html(this.$control);
				}
			}
		}
		
}