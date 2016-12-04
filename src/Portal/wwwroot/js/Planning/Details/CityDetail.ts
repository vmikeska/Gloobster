module Planning {

		export interface CodePair {
				from: string;
				to: string;
		}


	export class WeekendDetail {
			private flightDetails: FlightDetails;
			private $layout;

			private gid;
			private title;

			private v = Views.ViewBase.currentView;

			constructor(codePairs: CodePair[], title, gid) {

					this.flightDetails = new FlightDetails();

					this.gid = gid;
					this.title = title;
			}

			public destroyLayout() {
					$(".city-deal").remove();
			}

			public createLayout($lastBox) {
					this.destroyLayout();

					var cityDealLayout = this.v.registerTemplate("city-deals-weekend-template");
					var context = {
							gid: this.gid,
							title: this.title
					};
					this.$layout = $(cityDealLayout(context));

					$lastBox.after(this.$layout);
					
					this.$layout.find(".close").click((e) => {
							e.preventDefault();
							this.destroyLayout();
					});
			}

			public init(flights: Flight[]) {
					flights = _.sortBy(flights, "price");

					this.flightDetails.genFlights(this.$layout.find(".flights"), flights);					
			}
	}


	export class CityDetail {

		public flightDetails: FlightDetails;
		private v = Views.ViewBase.currentView;

		public codePairs: CodePair[];

		private cityName;
		private gid;
		private title;

		public scoreLevel;

		private slider: RangeSlider;
		private monthsSel: MonthsSelector;
		private airSel: AirportSelector;

		private classicSearch: CityClassicSearch;

		public $layout;

		constructor(scoreLevel, codePairs: CodePair[], title, cityName, gid) {
				
		this.flightDetails = new FlightDetails();

			this.scoreLevel = scoreLevel;

			this.codePairs = codePairs;			
			this.cityName = cityName;
			this.gid = gid;
			this.title = title;
		}

		public init(flights: Flight[]) {
			flights = _.sortBy(flights, "price");

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
				title: this.title				
			};
			this.$layout = $(cityDealLayout(context));

			$lastBox.after(this.$layout);

			this.initDeals();


			this.initTabs(this.$layout.find(".search-tabs"), (t) => {
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

			if (this.codePairs.length > 1) {
				this.airSel = new AirportSelector($tmp.find(".airpairs-filter"), this.codePairs);
				this.airSel.onChange = () => {
					this.genMonthFlights();
				}
				this.airSel.init();
				$(".multi-conn-cont").show();
			}

			this.slider = new RangeSlider($tmp.find(".days-range"), "daysRange");
			this.slider.genSlider(1, 21);
			this.slider.setVals(5,7);
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
				["daysFrom", days.from.toString()],
				["daysTo", days.to.toString()],
				["monthNo", this.monthsSel.month.toString()],
				["yearNo", this.monthsSel.year.toString()],
				["scoreLevel", this.scoreLevel.toString()]
			];

			var codePairs = (this.codePairs.length > 1) ? this.airSel.getActive() : this.codePairs;
			codePairs.forEach((cp) => {
					var cps = ["codePairs", AirportSelector.toString(cp)];
					prms.push(cps);
			});

			this.genFlights(prms);
		}

		public genFlights(prms, callback: Function = null) {
			var $ofCont = this.$layout.find(".other-flights-cont");
			$ofCont.empty();

			this.preloader(true);

			this.v.apiGet("SkypickerCity", prms, (fs) => {

				 var flights = FlightConvert.cFlights(fs);

					if (callback) {
							callback(flights);
					}

					//fs = _(fs).chain()
					//		.sortBy("FlightScore").reverse()
					//		.sortBy("Price")
					//		.value();		

					flights = _(flights)
						.chain()
						.sortBy("price")
						.reverse()
						.sortBy("score")
						.reverse()
						.value();

					this.flightDetails.genFlights($ofCont, flights);

					this.preloader(false);
				});

		}

	}

}