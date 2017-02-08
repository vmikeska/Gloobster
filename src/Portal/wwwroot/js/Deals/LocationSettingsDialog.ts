module Planning {


	export class LocationSettingsDialog {

		private airTemplate = Views.ViewBase.currentView.registerTemplate("homeAirportItem-template");

		private $airportsCont;
		private $airContS;

		private kmRangeSelected = 200;

		private dealsSearch: DealsSearch;
		constructor(dealsSearch: DealsSearch) {
				this.dealsSearch = dealsSearch;
		
			Views.AirLoc.registerLocationCombo($("#currentCity"),
				(place) => {
					$("#rangeBlock").removeClass("hidden");
					$(".home-location-name").html(`${place.City}, (${place.CountryCode})`);
				});

			this.regRangeCombo();

			this.$airportsCont = $("#airportsCont");
			this.$airContS = $(".top-ribbon .airports");

			this.initAirports();
			this.loadMgmtAirports();

			$(".top-ribbon .edit").click((e) => {
					e.preventDefault();
					$(".location-dialog").toggleClass("hidden");
					this.hideRefresh();
				});

			$("#airClose").click((e) => {
					e.preventDefault();
					$(".location-dialog").addClass("hidden");
					this.hideRefresh();
				});

			$("#refreshResults").click((e) => {
					e.preventDefault();
					this.dealsSearch.resultsEngine.refresh();
				  this.hideRefresh();
			});
		}

		private hideRefresh() {
					$(".refresh-line").addClass("hidden");
			}

		private changed() {
			var sel = this.dealsSearch.planningMap.map.anySelected();
			if (sel) {
				$(".refresh-line").removeClass("hidden");
			}

				if (this.hasAirports()) {
					$(".no-airs-info").hide();
				}
		}

		private loadMgmtAirports() {
			this.dealsSearch.v.apiGet("airportRange", null, (as) => {
				this.generateAirports(as);
			});
		}

		private initAirports() {				
			var ac = new Trip.AirportCombo("airportCombo", { clearAfterSelection: true });
			ac.onSelected = (e) => {

				var data = { airportId: e.id };
				this.dealsSearch.v.apiPost("airportRange", data, (a) => {
						this.genAirport(a);
						this.genAirportS(a.airCode);
						this.changed();
				});

			}				
		}

			public hasAirports() {
				return $("#airportsCont").find(".airport").length > 0;
			}

		private regRangeCombo() {
			var $dd = $("#airportsRange");
			$dd.change((e) => {
				var kms = parseInt($dd.find("input").val());
				this.kmRangeSelected = kms;				
			});

			$("#addAirsRange").click((e) => {
				e.preventDefault();
				this.callAirportsByRange();
			});

		}

		private callAirportsByRange() {
			var data = { distance: this.kmRangeSelected };
			this.dealsSearch.v.apiPut("AirportRange", data, (airports) => {
					this.generateAirports(airports);
				  this.changed();
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
					this.changed();
				});
			});

			this.$airportsCont.prepend($html);
		}

	}
}