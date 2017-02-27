module Views {

	export class DealsView extends ViewBase {
		public get v(): Views.ViewBase {
				return Views.ViewBase.currentView;
		}

		private tabs;

		private $dealsCont = $(".deals-search-cont");
		private $classicCont = $(".classic-search-cont");

		private $catsCont = $("#catsCont");

		//private initSettings: Planning.DealsInitSettings;
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

			this.initTopBar();

			this.initMainTabs();
				
			this.initDeals();
				
		}

			private initTopBar() {

					this.settings = new Planning.LocationSettingsDialog();

					this.settings.initTopBar(this.hasCity, this.hasAirs);

					$(".top-all .edit").click((e) => {
							e.preventDefault();
							this.settings.initDlg();
					});
			}
			
			private countDelasCnt() {
					var res = { Excellent: 0, Good: 0, Standard: 0 };

					this.allSections.forEach((s) => {
							res.Excellent += s.dealsEval.res.Excellent;
							res.Good += s.dealsEval.res.Good;
							res.Standard += s.dealsEval.res.Standard;
					});

					$("#delasEx").html(res.Excellent);
					$("#delasGo").html(res.Good);
					$("#delasSt").html(res.Standard);
			}


		private initDeals() {
			var ds = new Planning.DealsInitSettings(this.settings);
			ds.init(this.hasCity, this.hasAirs);
			ds.onThirdStep = () => {
				this.allSections.forEach((s) => {					
					$("html, body").animate({ scrollTop: $("#catsCont").offset().top }, "slow");
				});
			}

			var df = new Planning.DealsLevelFilter();
			df.stateChanged = () => {
				this.allSections.forEach((s) => {
					s.refreshResults();
				});
			}

			this.anytimeCat = new Planning.SectionBlock();
			this.anytimeCat.init(PlanningType.Anytime, this.$catsCont, "catAnytime", "Anytime deals", this.hasAirs);
			this.anytimeCat.onResultChange = () => {
					this.countDelasCnt();
			};
			this.allSections.push(this.anytimeCat);

			this.weekendCat = new Planning.SectionBlock();
			this.weekendCat.init(PlanningType.Weekend, this.$catsCont, "catWeekend", "Weekend deals", this.hasAirs);
			this.weekendCat.onResultChange = () => {
					this.countDelasCnt();
			};
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
			cs.onResultChange = () => {
					this.countDelasCnt();
			};
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

						this.tabs.addTab("tabClassics", "Classic search", () => {
								this.setTab(false);
						});

						this.tabs.addTab("tabDeals", "Deals search", () => {
								this.setTab(true);								
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

					  this.settings.showRatingFilter(deals);

				}
		}

}