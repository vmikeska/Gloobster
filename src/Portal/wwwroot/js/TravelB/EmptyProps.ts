module TravelB {
	export class EmptyProps {

		private formTemp;
		private setTemp;
		private $table;
		private $cont;
		private interests;

		constructor() {
			this.formTemp = Views.ViewBase.currentView.registerTemplate("settings-template");
			this.setTemp = Views.ViewBase.currentView.registerTemplate("settingsStat-template");
		}

		public generateProps(props) {

			this.$cont = $("#reqPropCont");
				
			var $form = $(this.formTemp());

			this.$table = $form.find("table");

			this.appSignals(this.$table);

			this.$cont.html($form);

			if (props.length > 0) {
				this.$cont.show();
			}

			props.forEach((prop) => {
				this.visible(prop, $form);

				if (prop === "HasProfileImage") {
					Views.SettingsUtils.registerAvatarFileUpload("avatarFile", () => {
						this.validate(true, "HasProfileImage");
					});
				}

				if (prop === "FirstName") {
						Views.SettingsUtils.registerEdit("firstName", "FirstName",
					(value) => {
						this.validate((value.length > 0), "FirstName");

						return { name: value };
					});
				}

				if (prop === "LastName") {
						Views.SettingsUtils.registerEdit("lastName", "LastName",
					(value) => {
						this.validate((value.length > 0), "LastName");

						return { name: value };
					});
				}

				if (prop === "BirthYear") {
						Views.SettingsUtils.registerEdit("birthYear", "BirthYear",
					(value) => {
						this.validate((value.length === 4), "BirthYear");

						return { year: value };
					});
				}

				if (prop === "Gender") {
						Views.SettingsUtils.registerCombo("gender", (val) => {
						this.validate((val !== Gender.N), "Gender");

						return { propertyName: "Gender", values: { gender: val } };
					});
					Common.DropDown.registerDropDown($("#gender"));
				}

				if (prop === "FamilyStatus") {
						Views.SettingsUtils.registerCombo("familyStatus", (val) => {
						this.validate((val !== 0), "FamilyStatus");

						return { propertyName: "FamilyStatus", values: { status: val } };
					});
					Common.DropDown.registerDropDown($("#familyStatus"));
				}

				if (prop === "HomeLocation") {
						Views.SettingsUtils.registerLocationCombo("homeCity", "HomeLocation", () => {
						this.validate(true, "HomeLocation");
					});
				}

				if (prop === "Languages") {
						var tl = Views.SettingsUtils.initLangsTagger([]);
					tl.onChange = (items) => {
						this.validate(items.length > 0, "Languages");
					}
				}

				if (prop === "Interests") {
					this.initInterests();
						//var ti = Views.SettingsUtils.initInterestsTagger([]);
					//ti.onChange = (items) => {
					//	this.validate(items.length > 0, "Interests");
					//}
				}

			});
		}

		private initInterests() {
				var $c = $("#intersTagging");

				this.interests = new CategoryTagger();				
				this.interests.onFilterChange = ((addedOrDeleted, id) => {
						var action = addedOrDeleted ? "ADD" : "DEL";
						Views.SettingsUtils.callServer("Inters", { value: id, action: action }, () => {
								var cnt = this.interests.getSelectedIds().length;
								this.validate(cnt > 0, "Interests");
						});
				});

				var data = TravelBUtils.getInterestsTaggerData();
				this.interests.create($c, "required", data);

				//this.interests.initData([]);
		}

		private validate(res, name) {
			if (res) {
				this.okStat(name);
			} else {
				this.koStat(name);
			}
		}

		private okStat(name) {
			var $tr = $(`#tr${name}`);
			var $stat = $tr.find(".stat");
			$stat.attr("src", "../images/tb/ok.png");
			$tr.find(".close").show();

			if (this.$table.find("tr").length === 0) {
				this.$cont.hide();
			}
		}

		private koStat(name) {
			var $tr = $(`#tr${name}`);
			var $stat = $tr.find(".stat");
			$stat.attr("src", "../images/tb/ko.png");
			$tr.find(".close").hide();
		}

		private appSignals($table) {
			var trs = $table.find("tr").toArray();
			trs.forEach((tr) => {

				var $tr = $(tr);
				var $stat = $(this.setTemp());
				$tr.append($stat);
				$tr.find(".close").click((e) => {
					e.preventDefault();
					$tr.remove();
				});

			});
		}

		private visible(name, $form) {
			var tr = $form.find(`#tr${name}`);
			tr.show();
		}
	}
}