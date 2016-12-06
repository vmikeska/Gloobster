module Views {
	export class LocationSettingsDialog {

		private airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");

		private $airportsCont;
		private $airContS;

		private kmRangeSelected = 200;

		constructor() {
				AirLoc.registerLocationCombo($("#currentCity"), (place) => {
					$(".home-location-name").html(`${place.City}, (${place.CountryCode})`);
			});

			this.regRangeCombo();

			this.$airportsCont = $("#airportsCont");
			this.$airContS = $(".top-ribbon .airports");

			this.initAirports();
			this.loadMgmtAirports();

			$(".top-ribbon .edit").click((e) => {
				e.preventDefault();
				$(".location-dialog").toggle();
			});
		}

		private loadMgmtAirports() {
			Views.ViewBase.currentView.apiGet("airportRange", null, (as) => {
				this.generateAirports(as);
			});
		}

		private initAirports() {				
			var ac = new Trip.AirportCombo("airportCombo", { clearAfterSelection: true });
			ac.onSelected = (e) => {

				var data = { airportId: e.id };
				Views.ViewBase.currentView.apiPost("airportRange", data, (a) => {
						this.genAirport(a);
						this.genAirportS(a.airCode);
				});

			}
		}
			
		private regRangeCombo() {
			var $dd = $("#airportsRange");
			$dd.change((e) => {
				var kms = parseInt($dd.find("input").val());
				this.kmRangeSelected = kms;
				this.callAirportsByRange();
			});

		}

		private callAirportsByRange() {
			var data = { distance: this.kmRangeSelected };
			Views.ViewBase.currentView.apiPut("AirportRange", data, (airports) => {
				this.generateAirports(airports);
			});
		}

		private generateAirports(airports) {
			this.$airportsCont.find(".airport").remove();
			this.$airContS.empty();

			airports.forEach((a) => {
					this.genAirport(a);
					this.genAirportS(a.airCode);
			});
		}

		private genAirportS(code) {
				var $h = $(`<span id="s_${code}" class="airport">${code}</span>`);
			this.$airContS.append($h);
		}

		private genAirport(a) {
			var context = {
				id: a.origId,
				city: a.city,
				airCode: a.airCode,
				airName: a.airName
			};

			var $html = $(this.airTemplate(context));
			
			$html.find(".delete").click((e) => {
				var $c = $(e.target).parent();
				var id = $c.attr("id");
				var code = $c.data("code");
				var data = [["id", id]];
				Views.ViewBase.currentView.apiDelete("AirportRange", data, (as) => {
						$(`#${id}`).remove();
						$(`#s_${code}`).remove();
				});
			});

			this.$airportsCont.prepend($html);
		}

	}
}