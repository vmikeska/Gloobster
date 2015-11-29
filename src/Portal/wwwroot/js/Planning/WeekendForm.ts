class WeekendForm {
	private $plus1: any;
	private $plus2: any;

	constructor(data) {
		this.$plus1 = $("#plus1");
		this.$plus2 = $("#plus2");

		this.setDaysCheckboxes(data.extraDaysLength);

		this.$plus1.click((e) => {
			var checked = this.$plus1.prop("checked");
			if (checked) {
				this.extraDaysClicked(1);
			} else {
				this.extraDaysClicked(0);
			}
		});
		this.$plus2.click((e) => {
			var checked = this.$plus2.prop("checked");
			if (checked) {
				this.extraDaysClicked(2);
			} else {
				this.extraDaysClicked(1);
			}
		});
	}

	private setDaysCheckboxes(length) {
		if (length === 0) {
			this.$plus1.prop("checked", false);
			this.$plus2.prop("checked", false);
		}
		if (length === 1) {
			this.$plus1.prop("checked", true);
			this.$plus2.prop("checked", false);
		}
		if (length === 2) {
			this.$plus1.prop("checked", true);
			this.$plus2.prop("checked", true);
		}
	}

	private extraDaysClicked(length) {
		var data = PlanningSender.createRequest(PlanningType.Weekend, "ExtraDaysLength", { length: length });
		PlanningSender.updateProp(data, (response) => {
			this.setDaysCheckboxes(length);
		});
	}
	
}