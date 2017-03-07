module Views {
	
	export class DealsView extends ViewBase {
		public get v(): Views.ViewBase {
			return Views.ViewBase.currentView;
		}
			
		private tabs: Common.Tabs;

		private $dealsCont = $(".deals-search-cont");
		private $classicCont = $(".classic-search-cont");

		private $catsCont = $("#catsCont");

		//private initSettings: Planning.DealsInitSettings;
		private settings: Planning.LocationSettingsDialog;

		public hasCity;
		public hasAirs;

		private anytimeCat;
		private weekendCat;

		private classicSearch: Planning.ClassicSearch;

		public allSections = [];

		public static listSize = ListSize.None;

		constructor() {
			super();

			this.loginButtonsManager.onAfterCustom = () => {
					this.allSections.forEach((s: Planning.SectionBlock) => {
						window.location.reload(true);
					});
			};
		}

		private tabDealsId = "tabDeals";
		private tabClassicsId = "tabClassics";

		public init() {				
				Planning.ResultConfigs.init();
				
				this.decideSize();

			this.initTopBar();

			this.initDeals();

			this.classicSearch = new Planning.ClassicSearch();
			this.classicSearch.init();

			this.initMainTabs();

			this.initResize();
			
		}

		private initTopBar() {

			this.settings = new Planning.LocationSettingsDialog(this);

			this.settings.initTopBar(this.hasCity, this.hasAirs);

			$(".top-all .dlg-btn-wrap")
				.click((e) => {
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
					ViewBase.scrollTo($("#catsCont"));
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
			$("#addCustom")
				.click((e) => {
					e.preventDefault();
					var sdl = new Planning.SearchDataLoader();
					sdl.createNewSearch((s) => {
						this.initDealCustom(s);
					});
				});
		}


		private initMainTabs() {
			this.tabs = new Common.Tabs($("#categoryNavi"), "category");
			this.tabs.initCall = false;

			this.tabs.addTab(this.tabDealsId,
				"Deals search",
				() => {
					this.setTab(true);
				});

			this.tabs.addTab(this.tabClassicsId,
				"Classic search",
				() => {
					this.setTab(false);
					this.classicSearch.stateChanged();
				});

			this.tabs.create();

			var type = this.getUrlParam("type");
			if (type) {
				if (type === "0") {
					this.setTab(true);
				}
				if (type === "1") {
					this.setTab(false);
					this.tabs.activateTab($(`#${this.tabClassicsId}`));
					this.classicSearch.initComps();
				}
			} else {
				this.setTab(true);
			}
		}

		private setTab(deals) {
			if (deals) {
				this.$dealsCont.removeClass("hidden");
				this.$classicCont.addClass("hidden");
				window.history.replaceState("", `gloobster.com`, "/deals?type=0");
			} else {
				this.$classicCont.removeClass("hidden");
				this.$dealsCont.addClass("hidden");
			}

			this.settings.showRatingFilter(deals);

		}

			private resizeTimeout;

		private initResize() {
				
			$(window).resize(() => {					
					this.decideSize();					
				});

		}

		private onListSizeChange() {
				this.allSections.forEach((s: Planning.SectionBlock) => {
					s.refreshResults();
				});
		}

		private getNewListSize(currentWidth) {
			var s = currentWidth > 650 ? ListSize.Big : ListSize.Small;
			return s;
		}

		private decideSize() {
			var currentWidth = $(window).width();

			var newListSize = this.getNewListSize(currentWidth);

			if (DealsView.listSize === ListSize.None) {
					DealsView.listSize = newListSize;
				return;
			}

			if (DealsView.listSize !== newListSize) {
					DealsView.listSize = newListSize;
				
					this.onListSizeChange();
				
			}
		}

	}

}