module Views {

	export class DealsView extends ViewBase {
				private tabs;

				private $dealsCont = $(".deals-search-all");
				private $classicCont = $(".classic-search-all");

				private $catsCont = $("#catsCont");

				private initSettings: Planning.DealsInitSettings;
				private settings: Planning.LocationSettingsDialog;

				public hasCity;
				public hasAirs;


			  private anytimeCat;

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

					var df = new Planning.DealsLevelFilter();

					this.anytimeCat = new Planning.SectionBlock();
					this.anytimeCat.init(PlanningType.Anytime, this.$catsCont, "catAnytime", "Anytime deals");
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