module Planning {
	
	export class CityDetail {

		public flightDetails: FlightDetails;
		private v = Views.ViewBase.currentView;

		public codeFrom;
		public codeTo;
		private cityName;
		private gid;

		public scoreLevel;

		private slider: RangeSlider;
		private monthsSel: MonthsSelector;

		private classicSearch: CityClassicSearch;

		public $layout;

		constructor(scoreLevel, codeFrom, codeTo, cityName, gid) {
			this.flightDetails = new FlightDetails();

			this.scoreLevel = scoreLevel;

			this.codeFrom = codeFrom;
			this.codeTo = codeTo;
			this.cityName = cityName;
			this.gid = gid;				
		}

		public init(flights) {
			flights = _.sortBy(flights, "Price");

			this.flightDetails.genFlights(this.$layout.find(".flights"), flights);

			this.genMonthFlights();
		}

		public destroyLayout() {
			$(".city-deal").remove();
		}

		private initTabs($cont, callback) {
			var $tabs = $cont.find(".tab");

			$cont.find(".tab")
				.click((e) => {
					e.preventDefault();
					var $t = $(e.delegateTarget);

					$tabs.removeClass("active");
					$t.addClass("active");

					var t = $t.data("t");
					callback(t);
				});

		}

		public createLayout($lastBox) {
			this.destroyLayout();

			var cityDealLayout = this.v.registerTemplate("city-deals-template");
			var context = {
				gid: this.gid,
				cityName: this.cityName,
				codeFrom: this.codeFrom,
				codeTo: this.codeTo
			};
			this.$layout = $(cityDealLayout(context));

			$lastBox.after(this.$layout);

			this.initDeals();


			this.initTabs(this.$layout.find(".search-tabs"),
				(t) => {
					this.$layout.find(".tabs-cont").empty();
					this.$layout.find(".other-flights-cont").empty();

					if (t === "deals") {
						this.initDeals();
					}

					if (t === "classic") {
						this.classicSearch = new CityClassicSearch(this);
						this.classicSearch.init();
					}
				});

			this.$layout.find(".close").click((e) => {
					e.preventDefault();
					this.destroyLayout();
				});
		}
			
		public filterLayout(tmpName) {
			var t = this.v.registerTemplate(tmpName);
			var $tmp = $(t());
			this.$layout.find(".tabs-cont").html($tmp);
			return $tmp;
		}

		private initDeals() {
			var $tmp = this.filterLayout("deals-srch-template");

			this.slider = new RangeSlider($tmp.find(".days-range"), "daysRange");
			this.slider.genSlider(1, 21);
			this.slider.onRangeChanged = () => {
				this.genMonthFlights();
			}

			this.monthsSel = new MonthsSelector($tmp.find(".months"));
			this.monthsSel.gen(12);
			this.monthsSel.onChange = () => {
				this.genMonthFlights();
			}
		}

		private preloader(show: boolean) {
			var $p = this.$layout.find(".other-flights-preloader");

			if (show) {
				$p.show();
			} else {
				$p.hide();
			}
		}


		private genMonthFlights() {
			var days = this.slider.getRange();

			var prms = [
				["ss", "0"],
				["codeFrom", this.codeFrom],
				["codeTo", this.codeTo],
				["daysFrom", days.from.toString()],
				["daysTo", days.to.toString()],
				["monthNo", this.monthsSel.month.toString()],
				["yearNo", this.monthsSel.year.toString()],
				["scoreLevel", this.scoreLevel.toString()]
			];

			this.genFlights(prms);
		}

		public genFlights(prms, callback: Function = null) {
			var $ofCont = this.$layout.find(".other-flights-cont");
			$ofCont.empty();

			this.preloader(true);

			this.v.apiGet("SkypickerCity", prms, (fs) => {

					if (callback) {
						callback(fs);
					}

					//fs = _(fs).chain()
					//		.sortBy("FlightScore").reverse()
					//		.sortBy("Price")
					//		.value();		

					fs = _(fs)
						.chain()
						.sortBy("Price")
						.reverse()
						.sortBy("FlightScore")
						.reverse()
						.value();

					this.flightDetails.genFlights($ofCont, fs);

					this.preloader(false);
				});

		}

	}

}