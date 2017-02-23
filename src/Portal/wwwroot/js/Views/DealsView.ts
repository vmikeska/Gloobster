module Views {

	export class DealsView extends ViewBase {
			public get v(): Views.ViewBase {
					return Views.ViewBase.currentView;
			}

			private tabs;

				private $dealsCont = $(".deals-search-all");
				private $classicCont = $(".classic-search-all");

				private $catsCont = $("#catsCont");

				private initSettings: Planning.DealsInitSettings;
				private settings: Planning.LocationSettingsDialog;

				public hasCity;
				public hasAirs;
			
				private anytimeCat;
			  private weekendCat;

			  private allSections = [];

				constructor() {
						super();						
				}

				public init() {
						var cs = new Planning.ClassicSearch();
						cs.init();
						
						this.initMainTabs();
						
						this.settings = new Planning.LocationSettingsDialog();

					  this.initDeals();
				}


		private initDeals() {
			var ds = new Planning.DealsInitSettings(this.settings);
			ds.init(this.hasCity, this.hasAirs);
				ds.onThirdStep = () => {
					this.allSections.forEach((s) => {
							s.planningMap.enableMap(true);
							$("html, body").animate({ scrollTop: $("#topContDeals").offset().top }, "slow");							
					});
				}

			var df = new Planning.DealsLevelFilter();

			this.anytimeCat = new Planning.SectionBlock();
			this.anytimeCat.init(PlanningType.Anytime, this.$catsCont, "catAnytime", "Anytime deals", this.hasAirs);
			this.allSections.push(this.anytimeCat);

			this.weekendCat = new Planning.SectionBlock();
			this.weekendCat.init(PlanningType.Weekend, this.$catsCont, "catWeekend", "Weekend deals", this.hasAirs);
			this.allSections.push(this.weekendCat);
			
			this.initDealsCustom();

			this.initAddCustomBtn();
		}

		private initDealsCustom() {
			var sdl = new Planning.SearchDataLoader();

			sdl.getInitData((searches) => {
				searches.forEach((s) => {
					this.initDealCustom(s);
				});
			});

		}
			
		private initDealCustom(s) {
			var cs = new Planning.SectionBlock();
			cs.init(PlanningType.Custom, this.$catsCont, `catCustom_${s.id}`, s.name, this.hasAirs, s.id);
			this.allSections.push(cs);

			if (!s.started) {
				cs.setMenuContVisibility(true);
				var cf = new Planning.CustomForm(cs.$cont, s.id);
			}
		}


		private initAddCustomBtn() {
					$("#addCustom").click((e) => {
						e.preventDefault();
						var sdl = new Planning.SearchDataLoader();
						sdl.createNewSearch((s) => {
							this.initDealCustom(s);
						});
				});
			}


				private initMainTabs() {
						this.tabs = new Common.Tabs($("#categoryNavi"), "category");

						this.tabs.addTab("tabDeals", "Deals search", () => {
								this.setTab(true);								
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