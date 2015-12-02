module Common {

	export class DelayedCallback {

		public callback: Function;

		public delay = 1000;

		private timeoutId = null;
		private $input: any;

		constructor(input: string) {
			var isId = (typeof input === "string");
			if (isId) {
				this.$input = $("#" + input);
			} else {
				this.$input = input;
			}


			this.$input.keydown(() => { this.keyPressed() });
		}

		private keyPressed() {

			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
			this.timeoutId = setTimeout(() => {
				this.timeoutId = null;
				var val = this.$input.val();
				this.callback(val);

			}, this.delay);
		}
	}
}