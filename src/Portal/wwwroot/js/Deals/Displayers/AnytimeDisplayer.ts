module Planning {

		export interface IDisplayer {
				showResults(queries, grouping: LocationGrouping);
				refresh(grouping: LocationGrouping);
		}
		
		export class AnytimeDisplayer implements IDisplayer {

		private queries;
		private $section;

		constructor($section) {
				this.$section = $section;		
		}
				
			public refresh(grouping: LocationGrouping) {
				this.showResults(this.queries, grouping);
			}

			public showResults(queries, grouping: LocationGrouping) {
				this.queries = queries;

				var results = FlightsExtractor.getResults(this.queries);

				if (grouping === LocationGrouping.ByCity) {
					var agg1 = new AnytimeByCityAgg(this.queries);

					agg1.exe(DealsLevelFilter.currentStars);

					var dis = new AnytimeByCityDis(this.$section, results, DealsLevelFilter.currentScore);
					dis.render(agg1.cities);
				}

				if (grouping === LocationGrouping.ByCountry) {
					var agg2 = new AnytimeByCountryAgg(this.queries);

					agg2.exe(DealsLevelFilter.currentStars);

					var $res = this.$section.find(".cat-res");
					var dis2 = new AnytimeByCountryDis($res, results, DealsLevelFilter.currentScore);
					dis2.render(agg2.countries);
				}

				if (grouping === LocationGrouping.ByContinent) {
					var agg3 = new AnytimeByContinentAgg(this.queries);

					agg3.exe(DealsLevelFilter.currentStars);

					var dis3 = new AnytimeByContinentDis(this.$section, results, DealsLevelFilter.currentScore);
					dis3.render(agg3.getAllConts());
				}


			}

		}

	export class AnytimeByCityDis {
			private $section;
			private $cont;

		private results;
		private scoreLevel;

		constructor($section, results, scoreLevel) {
			this.$section = $section;
			this.results = results;
			this.scoreLevel = scoreLevel;

			var $res = this.$section.find(".cat-res");
			this.$cont = $(`<div class="cont"></div>`);
			$res.html(this.$cont);
		}

		public render(cities) {
			cities = _.sortBy(cities, "fromPrice");
				
			var lg = Common.ListGenerator.init(this.$cont, "resultGroupItem-template");
			AnytimeAggUtils.enrichMoreLess(lg);
			lg.clearCont = true;
			lg.emptyTemplate = "no-destinations-tmp";

			lg.customMapping = (i) => {
				return {
					gid: i.gid,
					title: i.name,
					price: i.fromPrice
				};
			}

			lg.onItemAppended = ($cityBox, item) => {
				this.genOffers($cityBox, item.bestFlights);
			};

			lg.generateList(cities);
		}

		private genOffers($cityBox, bestFlights) {
			var lgi = Common.ListGenerator.init($cityBox.find("table"), "resultGroup-priceItem-template");
			lgi.listLimit = 2;
			lgi.listLimitMoreTmp = "offers-expander-template";
			lgi.listLimitLessTmp = "offers-collapser-template";

			lgi.evnt("td", (e, $connection, $td, eItem) => {
					var from = $connection.data("f");
					var to = $connection.data("t");
					var gid = $cityBox.data("gid");
					var name = $cityBox.data("name");

					var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));

					var result = _.find(this.results, (r) => { return r.from === from && r.to === to });

					var flights = FlightConvert2.cFlights(result.fs);

					var v = Views.ViewBase.currentView;
					var title = `${v.t("DealsFor", "jsDeals")} ${name}`;
					
					var pairs: CodePair[] = [{ from: from, to: to }];

					var cd = new CityDetail(this.scoreLevel, pairs, title, name, gid);
					cd.createLayout($lc);
					cd.init(flights);
				});

			lgi.generateList(bestFlights);
		}

	}

	export class AnytimeByCountryDis {			
			private $res;
			private $cont;

			private results;
			private scoreLevel;

			constructor($res, results, scoreLevel) {
					this.$res = $res;
					this.results = results;
					this.scoreLevel = scoreLevel;
					
					this.$cont = $(`<div class="cont"></div>`);
					$res.html(this.$cont);
			}

			public render(countries) {
					
					countries = _.sortBy(countries, "fromPrice");
					
					var lg = Common.ListGenerator.init(this.$cont, "resultGroupItemCountry-template");
					AnytimeAggUtils.enrichMoreLess(lg);
					lg.clearCont = true;
					
					lg.customMapping = (i) => {
							return {
									cc: i.cc,
									title: i.name,
									price: i.fromPrice
							};
					}

					lg.onItemAppended = ($country, country) => {
							this.genOffers($country, country.cities);
					};

					lg.generateList(countries);
			}

			private genOffers($cityBox, cities) {
					cities = _.sortBy(cities, "fromPrice");

					var lgi = Common.ListGenerator.init($cityBox.find("table"), "grouped-country-city-template");
					lgi.customMapping = (i) => {
						return {
							gid: i.gid,
							name: i.name,
							price: i.fromPrice
						};
					}

					lgi.listLimit = 2;
					lgi.listLimitMoreTmp = "offers-expander-template";
					lgi.listLimitLessTmp = "offers-collapser-template";

					lgi.evnt(null, (e, $tr, $target, item) => {														
							var gid = $tr.data("gid");
						  
							var $lc = Common.LastItem.getLast(this.$cont, "flight-result", $cityBox.data("no"));
							
							var results = _.filter(this.results, (r) => { return r.gid === gid });
							var first = _.first(results);
							var name = first.name;
							
							var flights = [];
							var pairs: CodePair[] = [];

							results.forEach((r) => {
									pairs.push({ from: r.from, to: r.to });

									r.fs.forEach((f) => {
									var flight = FlightConvert2.cFlight(f);
									flights.push(flight);
								});
							});

							var v = Views.ViewBase.currentView;
							var title = `${v.t("DealsFor", "jsDeals")} ${name}`;
							
							var cd = new CityDetail(this.scoreLevel, pairs, title, name, gid);
							cd.createLayout($lc);
							cd.init(flights);
					});

					lgi.generateList(cities);
			}
	}

		export class AnytimeByContinentDis {
				private $res;

			private results;
			private continents = [];
			private scoreLevel;

			constructor($section, results, scoreLevel) {
					this.results = results;
					this.scoreLevel = scoreLevel;

					this.$res =$section.find(".cat-res");
			}

			public render(conts) {

				this.mapContObjs(conts);

				var lg = Common.ListGenerator.init(this.$res, "continent-group-template");
				AnytimeAggUtils.enrichMoreLess(lg);
				lg.clearCont = true;
					
				lg.onItemAppended = ($continent, continent) => {
					this.genCountries($continent, continent.countries);
				};

				lg.evnt(".visi", (e, $item, $target, item) => {
						var vis = Boolean($target.data("v"));

						var txt = vis ?  "expand" : "collapse";
						$target.html(txt);

						$item.find(".cont").toggle(!vis);
						
						$target.data("v", !vis);
					});

				lg.generateList(this.continents);
			}

			private genCountries($continent, countries) {
					var bc = new AnytimeByCountryDis($continent.find(".cont"), this.results, this.scoreLevel);
					bc.render(countries);
			}

			private mapContObjs(conts) {

					var v = Views.ViewBase.currentView;
					
				if (conts.europe.length > 0) {
						this.addCont(v.t("Europe", "jsDeals"), conts.europe);
				}

				if (conts.nAmerica.length > 0) {
						this.addCont(v.t("NorthAmerica", "jsDeals"), conts.nAmerica);
				}

				if (conts.sAmerica.length > 0) {
						this.addCont(v.t("SouthAmerica", "jsDeals"), conts.sAmerica);
				}

				if (conts.asia.length > 0) {
						this.addCont(v.t("Asia", "jsDeals"), conts.asia);
				}

				if (conts.australia.length > 0) {
						this.addCont(v.t("Australia", "jsDeals"), conts.australia);
				}

				if (conts.africa.length > 0) {
						this.addCont(v.t("Africa", "jsDeals"), conts.africa);
				}
			}

			private addCont(name, countries) {
				var cont = {
					name: name,
					countries: countries
				}
				this.continents.push(cont);
			}


		}

}