module Planning {

	export class LastItem {
		public static getLast($rootCont, itemClass, blockNo) {

			var $lastBlock;

			var can = true;
			var curBlockNo = blockNo;

			while (can) {
				var nextBlockNo = curBlockNo + 1;

				var $i = this.findByNo($rootCont, itemClass, curBlockNo);
				var $ni = this.findByNo($rootCont, itemClass, nextBlockNo);

				var hasNext = $ni != null;
				if (hasNext) {
					var currentTop = $i.offset().top;
					var nextTop = $ni.offset().top;

					if (currentTop < nextTop) {
						$lastBlock = $i;
						can = false;
					}
				} else {
					$lastBlock = $i;
					can = false;
				}

				curBlockNo++;
			}

			return $lastBlock;
		}

		private static findByNo($rootCont, itemClass, no) {
			var $found = null;
			$rootCont.find(`.${itemClass}`).toArray().forEach((i) => {
				var $i = $(i);
				if (parseInt($i.data("no")) === no) {
					$found = $i;
				}
			});

			return $found;
		}
	}

	export class AnytimeDisplay {
		private aggr: AnytimeAggregator;

		private $cont;
		private $filter;

		private connections = [];

		constructor($cont) {
			this.aggr = new AnytimeAggregator();
			this.$cont = $cont;
			this.$filter = $("#tabsCont");

			this.genDaysSlider(1, 20);
		}

		public render(connections, daysFrom = null, daysTo = null) {

			this.connections = connections;

			var cities = this.aggr.aggregate(connections, daysFrom, daysTo);
				
			cities = _.sortBy(cities, "fromPrice");

			var lg = Common.ListGenerator.init(this.$cont, "resultGroupItem-template");
			lg.clearCont = true;

			lg.customMapping = (i) => {
				return {
					gid: i.gid,
					title: i.name,
					price: i.fromPrice
				};
			}

			lg.onItemAppended = ($cityBox, item) => {
				this.generateCityGroupedOffers($cityBox, item);
			};
				
			lg.generateList(cities);
		}

			private daysRangeChanged(daysFrom, daysTo) {
					this.render(this.connections, daysFrom, daysTo);
			}

			public genDaysSlider(daysMin, daysMax) {
					var tmp = Views.ViewBase.currentView.registerTemplate("anytime-timeSlider-template");

					this.$filter.html(tmp());

					var slider = document.getElementById("daysSlider");

					var $daysFrom = $("#daysFrom");					
					var $daysTo = $("#daysTo");

					$daysFrom.val(daysMin);
					$daysTo.val(daysMax);

					var si = noUiSlider.create(slider, {
							start: [daysMin + 1, daysMax - 1],
							connect: true,
							step: 1,							
							range: {
									'min': daysMin,
									'max': daysMax
							}
					});

					var fromCall = new Common.DelayedCallback($daysFrom);
					fromCall.delay = 500;
					fromCall.callback = (val) => {

							var fixedVal = val;
							if (val < daysMin) {
									fixedVal = daysMin;
								$daysFrom.val(fixedVal);
							}
							
							si.set([fixedVal, null]);

						this.daysRangeChanged(fixedVal, $daysTo.val());
					}

					var toCall = new Common.DelayedCallback($daysTo);
					toCall.delay = 500;
					toCall.callback = (val) => {

							var fixedVal = val;
							if (val > daysMax) {
									fixedVal = daysMax;
									$daysTo.val(fixedVal);
							}

							si.set([null, fixedVal]);

							this.daysRangeChanged($daysFrom.val(), fixedVal);
					}
					
					si.on("slide", (range) => {
						var from = parseInt(range[0]);
						var to = parseInt(range[1]);
						$daysFrom.val(from);
						$daysTo.val(to);

						this.daysRangeChanged(from, to);
					});
			}

		private generateCityGroupedOffers($cityBox, item) {
			var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
				lgi.customMapping = (i) => {
					return {
						from: i.fromAirport,
						to: i.toAirport,
						price: i.fromPrice
					};
				};

				lgi.evnt("td", (e, $connection, $td, eItem) => {
					var from = $connection.data("f");
					var to = $connection.data("t");
					var gid = $cityBox.data("gid");

					var $lastConnInRow = LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));
					
					this.displayOffer($lastConnInRow, eItem);
				});

				lgi.generateList(item.conns);
		}

		private displayOffer($lastBox, offer) {

			$(".flight-conns").remove();

			$lastBox.after(`<div class="flight-conns"><div class="conns"></div></div>`);

			var lg = Common.ListGenerator.init($(".flight-conns .conns"), "connection-flight-template");
			lg.clearCont = true;
			lg.customMapping = (i) => {
				return {
					price: i.Price
				};
			};

			lg.onItemAppended = ($flightAll, flight) => {
				this.genFlight($flightAll.find(".left"), flight);
			};

			lg.generateList(offer.flights);
		}

		private genFlight($cont, flight) {

			var majorFlights = [];
			if (flight.thereParts.length === 1) {
				majorFlights.push(flight.thereParts[0]);
			} else {
				var vt = this.viewForMultiFlight(flight.thereParts);
				majorFlights.push(vt);
			}

			if (flight.backParts.length === 1) {
				majorFlights.push(flight.backParts[0]);
			} else {
				var vb = this.viewForMultiFlight(flight.backParts);
				majorFlights.push(vb);
			}

			var lgi = Common.ListGenerator.init($cont, "connection-single-flight-template");
			lgi.customMapping = (f) => {

				if (f.isMulti) {
					return f;
				} else {
					return this.mapSingleFlight(f);
				}
			};

			lgi.evnt(".stops-btn", (e, $multiFlight, $btn, multiFlight) => {

				var $arrow = $btn.find(".icon-dropdown-arrow");

				if (multiFlight.subList) {
					multiFlight.subList.destroy();
					multiFlight.subList = null;
					$arrow.removeClass("opened");
				} else {
					var subFlightsLg = this.genMultiFlightFlights($multiFlight, multiFlight);
					multiFlight.subList = subFlightsLg;
					$arrow.addClass("opened");
				}
			});

			lgi.generateList(majorFlights);
		}

		private genMultiFlightFlights($multiFlight, multiFlight) {
			var lg = Common.ListGenerator.init($multiFlight, "connection-single-flight-template");
			lg.appendStyle = "after";
			lg.customMapping = (f) => {
				var res = this.mapSingleFlight(f);
				res.customClass = "sub-part";
				return res;
			};

			lg.generateList(multiFlight.parts);

			return lg;
		}

		private viewForMultiFlight(parts) {

			var first = _.first(parts);
			var last = _.last(parts);

			var airName = "Multi airlines";
			//todo: change to multi
			var logoLink = "/images/n/Examples/SwissAir.svg";

			var allAirSame = _.every(parts, (p) => { return p.Airline === first.Airline });
			if (allAirSame) {
				airName = AirlineCodes.getName(first.Airline);
				logoLink = this.getLogoLink(first.Airline);
			}

			var dur = this.getDurationMulti(new Date(first.DeparatureTime), new Date(last.ArrivalTime));

			var res = {
				isMulti: true,
				parts: parts,
				customClass: "",
				
				airName: airName,
				logoLink: logoLink,
				codeFrom: first.From,
				codeTo: last.To,
				flightNo: "",
				date: this.getDate(first.DeparatureTime),
				timeFrom: this.getTime(first.DeparatureTime),
				timeTo: this.getTime(last.ArrivalTime),
				durHours: dur.hours,
				durMins: dur.mins,
				stops: parts.length - 1
			};

			return res;
		}

		private mapSingleFlight(f) {

			var dur = this.getDuration(f.MinsDuration);

			var context = {		
					customClass: "",
								
				airName: AirlineCodes.getName(f.Airline),
				logoLink: this.getLogoLink(f.Airline),
				codeFrom: f.From,
				codeTo: f.To,
				flightNo: f.Airline + f.FlightNo,
				date: this.getDate(f.DeparatureTime),
				timeFrom: this.getTime(f.DeparatureTime),
				timeTo: this.getTime(f.ArrivalTime),
				durHours: dur.hours,
				durMins: dur.mins,
				stops: 0				
			};

			return context;
		}

		private getDurationMulti(from, to) {
			var diffMs = to - from;
			var diffMins = diffMs / 1000 / 60;
			return this.getDuration(diffMins);
		}


		private getDuration(mins) {
			var h = Math.floor(mins / 60);
			var m = mins % 60;
			return { hours: h, mins: m };
		}

		private getDate(str) {
			var res = moment().utc(str).format("ddd D MMM");
			return res;
		}

		private getTime(str) {
			var m = moment.utc(str);
			//keep this, de, for example has international fly format
			m.locale("de");
			var res = m.format("LT");
			return res;
		}

		private getLogoLink(code) {

				var airs = ["FR", "A6"];
				if (!_.contains(airs, code)) {
					code = "default-airline";
				}

				return `/images/n/${code}.svg`;
		}

		private getCombo() {
			var from = 2;
			var to = 14;
			var $combo = $(`<select id="days"><select>`);

			var $oe = $(`<option value="-">Days uspecified</option>`);
			$combo.append($oe);

			for (var act = from; act <= to; act++) {
				var $o = $(`<option value="${act}">${act} Days</option>`);
				$combo.append($o);
			}

			$combo.change((e) => {
				e.preventDefault();
				var val = $combo.val();
				this.daysFilterChange(val);
			});

			return $combo;
		}

		private daysFilterChange(val) {
			var days = (val === "-") ? null : parseInt(val);
			this.render(this.connections, days);
		}
			
	}



}