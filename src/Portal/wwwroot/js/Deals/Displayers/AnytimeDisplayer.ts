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
						
					var $wrap1 = this.$section.find(".cat-res");
					var $cont1 = ResultsItemsGenerator.addCont($wrap1);
					var dis1 = new AnytimeCityResultsItemsGenerator($cont1, results, DealsLevelFilter.currentScore);
					dis1.generate(agg1.cities);
				}

				if (grouping === LocationGrouping.ByCountry) {
					var agg2 = new AnytimeByCountryAgg(this.queries);

					agg2.exe(DealsLevelFilter.currentStars);

					var $wrap2 = this.$section.find(".cat-res");
					var $cont2 = ResultsItemsGenerator.addCont($wrap2);
					var dis2 = new AnytimeCountryResultsItemsGenerator($cont2, results, DealsLevelFilter.currentScore);
					dis2.generate(agg2.countries);						
				}

				if (grouping === LocationGrouping.ByContinent) {
					var agg3 = new AnytimeByContinentAgg(this.queries);

					agg3.exe(DealsLevelFilter.currentStars);

					var dis3 = new AnytimeContinentResultsItemsGenerator(this.$section, results, DealsLevelFilter.currentScore);
					dis3.render(agg3.getAllConts());						
				}


			}

		}

		export interface IResultsConfig {
				groupTemplate: string,
				itemTemplate: string,
				expanderTemplate: string,
				collapserTemplate: string,
				groupClass: string,

				limitOffers: boolean,

				groupLimitCnt: number,
				groupLimitMoreTmp: string,
				groupLimitLessTmp: string,
				
		}

		export class ResultConfigs {
				public static bigCity: IResultsConfig;
				public static smallCity: IResultsConfig;

				public static bigCountry: IResultsConfig;
				public static smallCountry: IResultsConfig;

				public static init() {
						this.bigCity = {
							groupTemplate: "result-box-city-template",
							groupClass: "flight-result",

							groupLimitLessTmp: "flights-list-less-tmp",
							groupLimitMoreTmp: "flights-list-more-tmp",
							groupLimitCnt: 4,

							itemTemplate: "one-offer-airports-template",
							collapserTemplate: "offers-collapser-template",
							expanderTemplate: "offers-expander-template",
							limitOffers: true

						};

						this.smallCity = {
							groupTemplate: "result-box-city-small-template",
							groupClass: "flight-result-small",

							groupLimitLessTmp: "flights-list-less-small-tmp",
							groupLimitMoreTmp: "flights-list-more-small-tmp",
							groupLimitCnt: 4,

							itemTemplate: "one-offer-airports-template",
							collapserTemplate: "",
							expanderTemplate: "",
							limitOffers: false
							
						};

						this.bigCountry = {
								groupTemplate: "result-box-country-template",
								groupClass: "flight-result",
								
								groupLimitLessTmp: "flights-list-less-tmp",
								groupLimitMoreTmp: "flights-list-more-tmp",
								groupLimitCnt: 4,
								
								itemTemplate: "one-offer-city-template",
								collapserTemplate: "offers-collapser-template",
								expanderTemplate: "offers-expander-template",
								limitOffers: true

						};

						this.smallCountry = {
								groupTemplate: "result-box-country-small-template",
								groupClass: "flight-result-small",

								groupLimitLessTmp: "flights-list-less-small-tmp",
								groupLimitMoreTmp: "flights-list-more-small-tmp",
								groupLimitCnt: 4,

								itemTemplate: "one-offer-city-template",
								collapserTemplate: "",
								expanderTemplate: "",
								limitOffers: false

						};
				}
		}

		export class ResultsItemsGenerator {

				protected get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				protected bigConfig: IResultsConfig;
				protected smallConfig: IResultsConfig;

				protected $section;
				protected results;
				protected scoreLevel;

				protected type: FlightCacheRecordType;

				protected  $cont;

				constructor(bigConfig: IResultsConfig, smallConfig: IResultsConfig, $cont, results, scoreLevel) {
						this.bigConfig = bigConfig;
						this.smallConfig = smallConfig;
						this.$cont = $cont;
						this.results = results;
						this.scoreLevel = scoreLevel;						
				}

				public static addCont($wrap) {						
						var $cont = $(`<div class="cont"></div>`);
						$wrap.html($cont);
					return $cont;
				}

				public generate(groups) {
						groups = _.sortBy(groups, "fromPrice");

						var lg = Common.ListGenerator.init(this.$cont, this.config.groupTemplate);
						
						lg.listLimit = this.config.groupLimitCnt;
						lg.listLimitMoreTmp = this.config.groupLimitMoreTmp;
						lg.listLimitLessTmp = this.config.groupLimitLessTmp;
						lg.listLimitLast = false;

						lg.clearCont = true;
						lg.emptyTemplate = "no-destinations-tmp";

						lg.customMapping = (group) => {
								var g = this.groupMapping(group);
							return g;
						}

						lg.onItemAppended = ($group, group) => {								
								this.generateItems($group, group);
						};

						lg.beforeItemAppended = ($group, group) => {

								if (Views.DealsView.listSize === ListSize.Big) {

									var id = "";
										
									if (this.type === FlightCacheRecordType.City) {
										id = $group.data("gid").toString();
									}

									if (this.type === FlightCacheRecordType.Country) {
											id = $group.data("cc").toString();
									}
										
									ImagesCache.getImageById(id, this.type, Views.DealsView.listSize, $group);	
								}
								
						};

						lg.generateList(groups);
				}

				protected generateItems($group, group) {
						var $itemsCont = $group.find("table");

						var items = this.getItems(group);

						var lgi = Common.ListGenerator.init($itemsCont, this.config.itemTemplate);

						lgi.customMapping = (item) => {
								var i = this.itemMapping(item);
								return i;
							}

						if (this.config.limitOffers) {
								lgi.listLimit = 2;
								lgi.listLimitMoreTmp = "offers-expander-template";
								lgi.listLimitLessTmp = "offers-collapser-template";
						}

						lgi.evnt("td", (e, $item, $td, item) => {
								this.regEvent($group, $item, group, item);								
						});

						lgi.generateList(items);
				}

				protected groupMapping(group) {
					return group;
				}

				protected itemMapping(item) {
					return item;
				}
				
				protected getItems(data) {
						return data;
				}

				protected regEvent($group, $item, group, item) {
					
				}

				get config(): IResultsConfig {
						return Views.DealsView.listSize === ListSize.Big ? this.bigConfig : this.smallConfig;
				}


		}

		export class AnytimeCityResultsItemsGenerator extends ResultsItemsGenerator {

				constructor($cont, results, scoreLevel) {					
						super(ResultConfigs.bigCity, ResultConfigs.smallCity, $cont, results, scoreLevel);
						this.type = FlightCacheRecordType.City;
				}

				public getItems(data) {
					return data.bestFlights;
				}

				public regEvent($group, $item, group, item) {
						var from = $item.data("f");
						var to = $item.data("t");
						var gid = $group.data("gid");
						var name = $group.data("name");
						
						var result = _.find(this.results, (r) => { return r.from === from && r.to === to });

						var flights = FlightConvert2.cFlights(result.fs);
						
						var title = `${this.v.t("DealsFor", "jsDeals")} ${name}`;

						var pairs: CodePair[] = [{ from: from, to: to }];

						var cd = new CityDetail(this.scoreLevel, pairs, title, name, gid);


						cd.createLayout();
						cd.init(flights);
				}

				protected groupMapping(group) {
						return {
								gid: group.gid,
								title: group.name,
								price: group.fromPrice
						};
				}				
		}

		export class AnytimeCountryResultsItemsGenerator extends ResultsItemsGenerator {
				constructor($cont, results, scoreLevel) {
						super(ResultConfigs.bigCountry, ResultConfigs.smallCountry, $cont, results, scoreLevel);
						this.type = FlightCacheRecordType.Country;
				}

				public getItems(data) {
						return data.cities;
				}

				protected groupMapping(group) {
						return {
								cc: group.cc,
								title: group.name,
								price: group.fromPrice
						};
				}

				protected itemMapping(item) {
						return {
								gid: item.gid,
								name: item.name,
								price: item.fromPrice
						};
				}

				protected regEvent($group, $item, group, item) {
						var gid = $item.data("gid");
						
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
						
						var title = `${this.v.t("DealsFor", "jsDeals")} ${name}`;

						var cd = new CityDetail(this.scoreLevel, pairs, title, name, gid);
						cd.createLayout();
						cd.init(flights);
				}
		}

		export class AnytimeContinentResultsItemsGenerator {
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
				lg.clearCont = true;
					
				lg.onItemAppended = ($continent, continent) => {
					this.genCountries($continent, continent.countries);
				};

				lg.evnt(".visi", (e, $item, $target, item) => {
						var oc = "opened";
						var $cont = $item.find(".cont");
						var isOpened = $item.hasClass(oc);

					$cont.slideToggle(!isOpened, () => {
						$item.toggleClass(oc, !isOpened);
					});
						
					});

				lg.generateList(this.continents);
			}

			private genCountries($continent, countries) {
					var bc = new AnytimeCountryResultsItemsGenerator($continent.find(".cont"), this.results, this.scoreLevel);
					bc.generate(countries);					
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