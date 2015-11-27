class CustomForm {

	public namesList: NamesList;
	private timeTagger: TaggingField;

	public data: any;

	constructor(data) {
		this.data = data;
		this.namesList = new NamesList(data.searches);
		this.namesList.onSearchChanged = (search) => this.onSearchChanged(search);
	 
		this.registerDuration();
		this.initTimeTagger(this.namesList.currentSearch);

		this.fillForm(this.namesList.currentSearch);
	}

	private onSearchChanged(search) {
		this.fillForm(search);
	}

	private fillForm(search) {
		var timeSelectedItems = this.getTimeTaggerSelectedItems(search);
		this.timeTagger.setSelectedItems(timeSelectedItems);
		this.initDuration(search.roughlyDays);	
	}
 
	private initTimeTagger(search) {
		var itemsRange = [
			{ text: "January", value: 1, kind: "month" },
			{ text: "February", value: 2, kind: "month" },
			{ text: "March", value: 3, kind: "month" },
			{ text: "April", value: 4, kind: "month" },
			{ text: "May", value: 5, kind: "month" },
			{ text: "June", value: 6, kind: "month" },
			{ text: "July", value: 7, kind: "month" },
			{ text: "August", value: 8, kind: "month" },
			{ text: "September", value: 9, kind: "month" },
			{ text: "October", value: 10, kind: "month" },
			{ text: "November", value: 11, kind: "month" },
			{ text: "December", value: 12, kind: "month" },
			{ text: "year 2015", value: 2015, kind: "year" },
			{ text: "year 2016", value: 2016, kind: "year" }
		];
	
		this.timeTagger = new TaggingField(search.id, "timeTagger", itemsRange);
		this.timeTagger.onItemClickedCustom = ($target, callback) => {
			var val = $target.data("vl");
			var kind = $target.data("kd");
			var text = $target.text();

			var data = PlanningSender.createRequest(PlanningType.Custom, "time", {
				kind: kind,
				value: val,
				id: this.namesList.currentSearch.id
			});

			PlanningSender.pushProp(data, (res) => {
				callback(res);
			});
		}
	}

	private getTimeTaggerSelectedItems(search) {
		var selectedItems = [];
		search.months.forEach((month) => {
			selectedItems.push({ value: month, kind: "month" });
		});
		search.years.forEach((year) => {
			selectedItems.push({ value: year, kind: "year" });
		});
		return selectedItems;
	}

	private initDuration(days) {

		if (days === 0) {
			this.setRadio(1, true);
		} else if (days === 3) {
			this.setRadio(2, true);
		} else if (days === 7) {
			this.setRadio(3, true);
		} else if (days === 14) {
			this.setRadio(4, true);
		} else {
			this.setRadio(5, true);
			$("#customLength").show();
			$("#customLength").val(days);
		}

	}

	private setRadio(no, val) {
		$("#radio" + no).prop("checked", val);	
	}

	private registerDuration() {

		var dc = new DelayedCallback("customLength");
		dc.callback = (val) => {
			var intVal = parseInt(val);
			if (intVal) {
				this.callUpdateMinLength(intVal);
			}
		}

		var $lengthRadio = $("input[type=radio][name=radio]");
		var $customLength = $("#customLength");
		$lengthRadio.change((e) => {

			var $target = $(e.target);
			var val = $target.data("vl");
			if (val === "custom") {
				$customLength.show();
			} else {
				$customLength.hide();
				this.callUpdateMinLength(parseInt(val));
			}

		});
	}

	private callUpdateMinLength(roughlyDays) {
		var data = PlanningSender.createRequest(PlanningType.Custom, "roughlyDays", {
			id: this.namesList.currentSearch.id,
			days: roughlyDays
		});

		PlanningSender.updateProp(data, (res) => {

		});
	}


}