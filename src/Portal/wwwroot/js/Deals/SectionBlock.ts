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

		public onResultChange: Function;

		public sectConfig: ISectionConfig;
		public resultsEngine: ResultsManager;

		public planningMap: PlanningMap;
		private planningTags: PlanningTags;

		private type: PlanningType;

		private displayer: IDisplayer;

		private grouping: GroupCombo;

		public dealsEval: DelasEval;

		private filter;
			
		public $cont;
		private $parentCont;			
		private $placesTagSel;
		private $placesMapSel;

		public init(type: PlanningType, $parentCont, catId, titleName, hasAirs, customId = null) {
			this.$parentCont = $parentCont;
			this.type = type;

			this.createLayout(catId, titleName);

			this.initConfig(catId, customId);

			this.initFilter();

			this.initGroupingCombo();

			this.initBtns();

			this.planningTags = new PlanningTags(this.$cont, this.type, customId);
			this.planningMap = new PlanningMap(this.sectConfig, this.$cont);

			this.initDisplayer();

			this.initResultMgr();

			this.regInfo();

			this.initNameEdit();

			this.hasAnyPlaces((hasPlaces) => {
				if (!hasPlaces) {
					this.editMap();

					if (!hasAirs) {
						this.planningMap.enableMap(false);
						this.initMapDisabler();
					}
				}
			});

		}

		public refreshResults() {
				this.displayer.refresh(this.grouping.selected);
			}

			private regInfo() {

				this.$cont.find(".info-btn").click((e) => {						
					var $c = $(`<div class="info-txt-wrap"></div>`);
					this.$cont.find(".cat-drop-cont .cont").html($c);

					var txt = this.getInfoTxt();
					$c.html(txt);

					this.setMenuContVisibility(true);
				});


				
			}

		private initMapDisabler() {
				this.$cont.find(".map-disabler").click((e) => {
						$("html,body").animate({ scrollTop: 0 }, "slow");
				});
		}
			
		private hasAnyPlaces(callback: Function) {
				var data = [["type", this.type.toString()], ["customId", this.sectConfig.customId], ["justCount", "true"]];

				this.v.apiGet("DealsPlaces", data, (hasPlaces) => {
						callback(hasPlaces);
				});
		}

		private initGroupingCombo() {
			this.grouping = new GroupCombo();
			this.grouping.init(this, this.$cont, this.sectConfig.getGrouping());
			this.grouping.onChange = () => {
				if (this.displayer) {
					this.displayer.refresh(this.grouping.selected);
					}
					this.setMenuContVisibility(false);
			}
		}

		private getInfoTxt() {
					if (this.type === PlanningType.Anytime) {
						return "By this type of search, we will be looking for any kind of deal defined by your cities and countries you'd like to visit. Deparature, arrival or how many days you'd like to stay is here not a thing.";
					}

					if (this.type === PlanningType.Weekend) {
							return "By this type of search, we will find best deals for following weekends of cities and countries defined by you.";
					}

					if (this.type === PlanningType.Custom) {
							return "Make completly custom defined search. Setup frequency of email notifications and we will keep you updated on the best deals.";
					}
			}

		private initNameEdit() {

			if (this.type === PlanningType.Custom) {
				var $penBtn = this.$cont.find(".name-edit-btn");
				var $editGroup = this.$cont.find(".name-edit");
				var $titleName = this.$cont.find(".title-name");

				$penBtn.removeClass("hidden");

				$penBtn.click((e) => {
					$editGroup.removeClass("hidden");
					$penBtn.addClass("hidden");
					$titleName.addClass("hidden");
				});

				$editGroup.find(".save").click((e) => {
						e.preventDefault();

						var name = $editGroup.find(".input").val();
						var data = {
							id: this.sectConfig.customId,
							name: "name",
							value: name
						};

						this.v.apiPut("CustomSearch",
							data,
							() => {
								$titleName.html(name);
								$editGroup.addClass("hidden");
								$penBtn.removeClass("hidden");
								$titleName.removeClass("hidden");
							});
					});
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

			private initEmptyResultsBtns() {
					this.$cont.find(".no-dests .ico-map").click((e) => { this.editList(); });
					this.$cont.find(".no-dests .ico-search").click((e) => { this.editMap(); });
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
					
					this.displayer.showResults(queries, this.grouping.selected);
				this.initEmptyResultsBtns();
				
				this.dealsEval = new DelasEval(this.resultsEngine.timeType, queries);
				this.dealsEval.countDeals();

				this.callOnResultChange();				
			};

			//this.planningMap = new Planning.PlanningMap(this);

			this.planningMap.onMapLoaded = () => {
				//this.changeSetter(PlanningType.Anytime);
			}

			this.planningMap.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {
				var customId = this.sectConfig.customId;
				this.resultsEngine.selectionChanged(id, newState, type, customId);
			}

			this.planningTags.onSelectionChanged = (id: string, newState: boolean, type: FlightCacheRecordType) => {
					var customId = this.sectConfig.customId;
					this.resultsEngine.selectionChanged(id, newState, type, customId);
			}

			this.resultsEngine.initalCall(this.type, this.sectConfig.customId);
		}

			private callOnResultChange() {
					if (this.onResultChange) {
						this.onResultChange();
					}
			}

		private initBtns() {
			this.$placesTagSel = this.$cont.find(".places-tag-sel");
			this.$placesMapSel = this.$cont.find(".places-map-sel");

			this.$placesTagSel.find(".form-close").click(() => {
				this.$placesTagSel.addClass("hidden");
			});

			this.$placesMapSel.find(".form-close").click(() => {
					this.$placesMapSel.addClass("hidden");
			});

			this.$cont.find(".edit-list").click((e) => { this.editList(); });
			this.$cont.find(".edit-map").click((e) => { this.editMap(); });

			if (this.type === PlanningType.Custom) {
				var t = this.v.registerTemplate("custom-bar-icons-tmp");
				var $t = $(t());

				var $c = this.$cont.find(".custom-icons");
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


			private hideAllPlaceEdits() {
					this.$placesMapSel .addClass("hidden");
					this.$placesTagSel.removeClass("hidden");
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