module Views {
	export class WikiAdminView extends ViewBase {

		private selectedCity;

		constructor() {
			super();
			this.regActionButtons();
			this.regSearchBox();

			$("#AddCity").click((e) => {
				e.preventDefault();
				$("#addCityForm").toggle();
			});

			$("#SendCity").click((e) => {
				e.preventDefault();
				this.createCity();
			});

		}

		private regSearchBox() {
			var searchBox = new Common.GNOnlineSearchBox("gnCombo");
			searchBox.onSelected = (city) => this.onCitySelected(city);
		}

		private onCitySelected(city) {
			$("#txtGID").val(city.geonameId);
			$("#txtPopulation").val(city.population);
			$("#txtTitle").val(city.name);

			this.selectedCity = city;
		}

		private createCity() {
		 if ($("#txtGID").val() === "") {
			 return;
		 }

			var dialog = new Common.ConfirmDialog();
			dialog.create("Add city", "Do you want to add the city ?", "Cancel", "Create", () => {
				var data = {
					gid: this.selectedCity.geonameId,
					population: $("#txtPopulation").val(),
					title: $("#txtTitle").val(),
					countryCode: this.selectedCity.countryCode
				};

				this.apiPost("WikiCity", data, (r) => {
					$("#addCityForm").hide();
				});
			});
		}

		private regActionButtons() {
			$(".actionButton").click((e) => {
				e.preventDefault();
				var $target = $(e.target);
				var name = $target.data("action");

				var $cont = $target.closest(".task");
				var id = $cont.attr("id");

				var data = {
					action: name,
					id: id
				};

				this.apiPost("AdminAction", data, (r) => {
					if (r) {
						$(`#${id}`).remove();
					}
				});

			});
		}

	}
}