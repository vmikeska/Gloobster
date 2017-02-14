module Views {

	export class SectionBlock {
		public get v(): Views.ViewBase {
			return Views.ViewBase.currentView;
		}

		private type: PlanningType;
		private $cont;

		private $placesTagSel;
		private $placesMapSel;

		public init(type: PlanningType, $cont) {
			this.$cont = $cont;
			this.type = type;

			this.$placesTagSel = this.$cont.find(".places-tag-sel");
			this.$placesMapSel = this.$cont.find(".places-map-sel");

			this.$cont.find(".edit-list").click((e) => {

					this.$placesTagSel.toggleClass("hidden");

					if (!this.$placesTagSel.hasClass("hidden")) {
							this.getPlaces((places) => {
									this.genPlaces(places);
							});	
					}
					
				});

			this.initPlaceTagSearch();
		}

			private initPlaceTagSearch() {
					var placeSearch = new Common.AllPlacesSearch(this.$cont.find(".place-search"), this.v);
					placeSearch.onPlaceSelected = (r) => {
							if (r.SourceType === SourceType.City) {
									this.changeCitySel(r.SourceId, true, () => {
											this.getPlaces((places) => {
													this.genPlaces(places);
											});	
									});
							}

							if (r.SourceType === SourceType.Country) {
									this.changeCountrySel(r.SourceId, true, () => {
											this.getPlaces((places) => {
													this.genPlaces(places);
											});	
									});
							}							
					};
		}

			private changeCountrySel(cc: string, state: boolean, callback: Function = null) {					
				var data = {
					type: this.type,
					cc: cc,
					selected: state,
					customId: null
					};

					this.v.apiPut("SelCountry", data, () => {
						callback();
					});
			}


			private changeCitySel(gid, state: boolean, callback: Function = null) {
					var data = {
							type: this.type,
							gid: gid,
							selected: state,
							customId: null
					};

					this.v.apiPut("SelCity", data, () => {
							callback();
					});
			}

		private getPlaces(callback: Function) {
			var data = [["type", this.type.toString()]];

			this.v.apiGet("DealsPlaces", data, (places) => {
				callback(places);
			});
		}

		private genPlaces(places) {
				
				var lgc = Common.ListGenerator.init(this.$cont.find(".places-cont"), "map-place-item");
				lgc.clearCont = true;
				lgc.customMapping = (item) => {
					return {
							id: item.conde,
							name: item.name,
							type: item.type
					};						
				}

				lgc.generateList(places);
			}


	}


	export class DealsView extends ViewBase {
				private tabs;

				private $dealsCont = $(".deals-search-all");
				private $classicCont = $(".classic-search-all");

				private initSettings: Planning.DealsInitSettings;
				private settings: Planning.LocationSettingsDialog;

				public hasCity;
				public hasAirs;


				constructor() {
						super();						
				}

				public init() {
						var cs = new Planning.ClassicSearch();
						cs.init();
						
						this.initMainTabs();
						
						this.settings = new Planning.LocationSettingsDialog();

						var ds = new Planning.DealsInitSettings(this.settings);
						ds.init(this.hasCity, this.hasAirs);

						var sb = new SectionBlock();
						sb.init(PlanningType.Anytime, $("#placesWinAnytime"));
				}


				private initMainTabs() {
						this.tabs = new Common.Tabs($("#categoryNavi"), "category");

						this.tabs.addTab("tabDeals", "Deals search", () => {
								this.setTab(true);

								//var deals = new Planning.DealsSearch();
								//deals.init();
						});

						this.tabs.addTab("tabClassics", "Classic search", () => {
								this.setTab(false);
						});
						
						this.tabs.create();
				}

				private setTab(deals) {
						if (deals) {
								this.$dealsCont.removeClass("hidden");
								this.$classicCont.addClass("hidden");
						} else {
								this.$classicCont.removeClass("hidden");
								this.$dealsCont.addClass("hidden");
						}

				}
		}

}