module Common {
	export class CustomCheckbox {
		public onChange: Function;

		private $root;
		private $checker;

		constructor($root, checked = false) {
			this.$root = $root;
			this.$checker = this.$root.find(".checker");
			this.setChecker(checked);

			this.$root.click((e) => {
				var newState = !this.isChecked();
				this.setChecker(newState);
				if (this.onChange) {
					this.onChange($root.attr("id"), newState);
				}
			});
		}

		public isChecked() {
			return this.$checker.hasClass("icon-checkmark");
		}

		public setChecker(checked) {
			this.$checker.removeClass("icon-checkmark");
			this.$checker.removeClass("icon-checkmark2");

			if (checked) {
				this.$checker.addClass("icon-checkmark");
			} else {
				this.$checker.addClass("icon-checkmark2");
			}

		}

	}
}