module Common {
		
		export class NumberPicker {
				private $cont;
				private isNative;
				private min;
				private max;

				private $control;

				constructor($cont, min, max) {
						this.$cont = $cont;
						this.min = min;
						this.max = max;

						this.init();
				}

				public enabled(state) {
						if (state === null) {
								return !this.$cont.hasClass("disabled");
						}

						this.$cont.toggleClass("disabled", state);
				}

				public val() {
					return this.$control.val();
				}

				private init() {
						var os = Views.ViewBase.getMobileOS();

						this.isNative = os !== OS.Other;

						if (this.isNative) {
								this.$control = $(`<input type="number" min="${this.min}" max="${this.max}" />`);
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