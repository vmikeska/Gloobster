module Planning {

		export interface ISectionConfig {
				//setQueries(queries);
				
				type: PlanningType;
				getGrouping();
				catId;
				customId;
		}

		export class AnytimeConfig implements ISectionConfig {
			public customId = null;
			public catId;

			public getGrouping() {
				return [LocationGrouping.ByCity, LocationGrouping.ByCountry, LocationGrouping.ByContinent];
			}

			type = PlanningType.Anytime;
		}

		export class WeekendConfig implements ISectionConfig {
				public customId = null;
				public catId;

				public getGrouping() {
						return [LocationGrouping.ByCity, LocationGrouping.ByCountry];
				}

				type = PlanningType.Weekend;
				
		}

		export class CustomConfig implements ISectionConfig {
				constructor(customId) {
					this.customId = customId;
				}

				public customId;

				public getGrouping() {
						return [LocationGrouping.ByCity, LocationGrouping.ByCountry, LocationGrouping.ByContinent];
				}

			
			public type = PlanningType.Custom;
			public catId: any;
				
		}

	export class SectionBlock {
		public get v(): Views.ViewBase {
			return Views.ViewBase.currentView;
		}

		public sectConfig: ISectionConfig;
		private resultsEngine: ResultsManager;

		private planningMap: PlanningMap;
		private planningTags: PlanningTags;

		private type: PlanningType;

		private displayer: IDisplayer;

		private grouping: GroupCombo;

		public $cont;
		private $parentCont;			
		private $placesTagSel;
		private $placesMapSel;

		public init(type: PlanningType, $parentCont, catId, titleName, customId = null) {
			this.$parentCont = $parentCont;
			this.type = type;

			this.createLayout(catId, titleName);

			this.initConfig(catId, customId);

			this.initFilter();

			this.initGroupingCombo();

			this.initBtns();

			this.planningTags = new PlanningTags(this.$cont, this.type);			
			this.planningMap = new PlanningMap(this.sectConfig);

			this.initDisplayer();

			this.initResultMgr();



			//init just at the beginning, coz you want to dispaly it
			//this.editMap();
		}

			private initGroupingCombo() {
					this.grouping = new GroupCombo();
					this.grouping.init(this, this.$cont, this.sectConfig.getGrouping());
					this.grouping.onChange = () => {
						if (this.displayer) {
							this.displayer.refresh(this.grouping.selected);
						}
					}
			}

		private initConfig(catId, customId) {
			if (this.type === PlanningType.Anytime) {
				this.sectConfig = new AnytimeConfig();
				}

			if (this.type === PlanningType.Weekend) {
					this.sectConfig = new WeekendConfig();
			}

			if (this.type === PlanningType.Custom) {
				this.sectConfig = new CustomConfig(customId);
			}
				
			this.sectConfig.catId = catId;
		}

		private initDisplayer() {
			if (this.type === PlanningType.Anytime) {
				this.displayer = new AnytimeDisplayer(this.$cont);
				}

			if (this.type === PlanningType.Weekend) {
					this.displayer = new WeekendDisplayer(this.$cont.find(".cat-res"), this.filter);
			}

			if (this.type === PlanningType.Custom) {
					this.displayer = new AnytimeDisplayer(this.$cont);
			}
		}

			private filter;

		private initFilter() {
			var $f = this.$cont.find(".cat-filter");

			if (this.type === PlanningType.Weekend) {
				var t = this.v.registerTemplate("filtering-weekend-template");
				var $t = $(t());
				$f.html($t);

				this.filter = new DaysFilter($f.find("#cbUseDaysFilter"), $f.find(".days-filter"));

				this.filter.onFilterChange = () => {
					this.displayer.refresh(this.grouping.selected);
				};

				this.filter.init(false);

			}
		}

		private initResultMgr() {
				this.resultsEngine = new ResultsManager();

				this.resultsEngine.onDrawQueue = () => {
				var qv = new QueueVisualize(this.$cont);

				if (any(this.resultsEngine.queue)) {
					qv.draw(this.resultsEngine.timeType, this.resultsEngine.queue);
				} else {
					qv.hide();
				}
			}

			this.resultsEngine.onResultsChanged = (queries) => {

						if (this.displayer) {//remove when all implemented
							this.displayer.showResults(queries, this.grouping.selected);
						}

						//var de = new Planning.DelasEval(this.resultsEngine.timeType, queries);
							//de.dispayDeals();
					};

					//this.planningMap = new Planning.PlanningMap(this);

					this.planningMap.onMapLoaded = () => {
							//this.changeSetter(PlanningType.Anytime);
					}

					this.planningMap.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {

							var customId = this.sectConfig.customId;
							this.resultsEngine.selectionChanged(id, newState, type, customId);
					}

					this.resultsEngine.initalCall(this.type, this.sectConfig.customId);
			}

		private showData() {
				
					//this.v.apiGet("DealsPlaces", data, (places) => {
					//		callback(places);
					//});
			}


		private initBtns() {
			this.$placesTagSel = this.$cont.find(".places-tag-sel");
			this.$placesMapSel = this.$cont.find(".places-map-sel");

			this.$cont.find(".edit-list").click((e) => { this.editList(); });
			this.$cont.find(".edit-map").click((e) => { this.editMap(); });

			if (this.type === PlanningType.Custom) {
				var t = this.v.registerTemplate("custom-bar-icons-tmp");
				var $t = $(t());

				var $c = this.$cont.find(".icons-wrap");
				$c.prepend($t);

				$c.find(".settings").click((e) => {						
					  var cf = new CustomForm(this.$cont, this.sectConfig.customId);
						
						this.setMenuContVisibility(true);
				});
					
				$c.find(".delete").click((e) => {
						var cd = new Common.ConfirmDialog();
						cd.create("Search removal", "Would you like to delete this search?", "Cancel", "Delete", () => {
								var sdl = new SearchDataLoader();
								sdl.deleteSearch(this.sectConfig.customId, () => {
									this.$cont.remove();
								});
						});
				});

			}

			var $menuCont = this.$cont.find(".cat-drop-cont");
			$menuCont.find(".form-close").click((e) => {
					this.setMenuContVisibility(false);
					this.grouping.reset();
			});

		}

		public setMenuContVisibility(state) {
			var $c = this.$cont.find(".cat-drop-cont");
			var $fc = $c.find(".form-close");

			if (state) {
				$c.slideDown(() => {
						$fc.show();
				});
			} else {
					$fc.hide();
				$c.slideUp(() => {
					
				});
			}
		}


		private editList() {
			if (this.$placesTagSel.hasClass("hidden")) {
				this.$placesMapSel.addClass("hidden");
				this.$placesTagSel.removeClass("hidden");

				this.planningTags.init();
			} else {
				this.$placesTagSel.addClass("hidden");
			}
		}

		private editMap() {
			if (this.$placesMapSel.hasClass("hidden")) {
				this.$placesTagSel.addClass("hidden");
				this.$placesMapSel.removeClass("hidden");

				this.planningMap.init();
			} else {
				this.$placesMapSel.addClass("hidden");
			}
		}

		private createLayout(catId, titleName) {
			var t = this.v.registerTemplate("category-block-template");
			var context = {
				catId: catId,
				titleName: titleName
			};
			this.$cont = $(t(context));
			this.$parentCont.append(this.$cont);
		}

		
		}
}