module Planning {

		export interface ISectionConfig {
				//setQueries(queries);
				//init(callback: Function);
				type: PlanningType;
				getGrouping();
				catId;
				getCustomId();
		}

		export class AnytimeConfig implements ISectionConfig {
			public getCustomId() {
				return null;
			}
			public catId;

			public getGrouping() {
				return [LocationGrouping.ByCity, LocationGrouping.ByCountry, LocationGrouping.ByContinent];
			}

			type = PlanningType.Anytime;
		}

		export class OrderCombo {
				private $sect;
				private $cmb;
				private $win;

				private ocls = "opened";

				public selected = LocationGrouping.ByCity;

			public init($sect, groupings) {
				this.$sect = $sect;

				this.$cmb = this.$sect.find(".order-combo");
				this.$win = this.$sect.find(".order-sel");

				this.$cmb.click((e) => {
					var opened = this.isOpened();
					this.setState(!opened);
				});

				var items = [];
				groupings.forEach((i) => {
					var item = {
						id: i,
						icon: "",
						txt: ""
					};

					if (i === LocationGrouping.ByCity) {
						item.icon = "city";
						item.txt = "By city";
					}

					if (i === LocationGrouping.ByCountry) {
							item.icon = "country";
							item.txt = "By country";
					}

					if (i === LocationGrouping.ByContinent) {
							item.icon = "continent";
							item.txt = "By continent";
					}

					items.push(item);
				});

				var lg = Common.ListGenerator.init(this.$win.find(".items"), "grouping-itm-tmp");
				lg.evnt(null, (e, $item, $target, item) => {
						this.selected = item.id;
						this.setState(false);
						this.setCmb(item.icon, item.txt);
				});

				lg.generateList(items);
				
			}

			public isOpened() {
				return this.$cmb.hasClass(this.ocls);
			}

				private setCmb(ico, txt) {
						this.$cmb.find(".sel-ico").attr("class", `icon-${ico} sel-ico`);
					this.$cmb.find(".txt").html(txt);
				}

			private setState(opened) {
				if (opened) {
					this.$win.removeClass("hidden");
					this.$cmb.addClass(this.ocls);
				} else {
					this.$win.addClass("hidden");
					this.$cmb.removeClass(this.ocls);
				}
			}


		}

	export class SectionBlock {
		public get v(): Views.ViewBase {
			return Views.ViewBase.currentView;
		}

		private sectConfig: ISectionConfig;
		private resultsEngine: ResultsManager;

		private planningMap: PlanningMap;
		private planningTags: PlanningTags;

		private type: PlanningType;

		private $cont;
		private $parentCont;			
		private $placesTagSel;
		private $placesMapSel;

		public init(type: PlanningType, $parentCont, catId, titleName) {
			this.$parentCont = $parentCont;
			this.type = type;

			this.createLayout(catId, titleName);

			this.initConfig(catId);

			var oc = new OrderCombo();
			oc.init(this.$parentCont, this.sectConfig.getGrouping());

			this.initEditBtns();

			this.planningTags = new PlanningTags(this.$parentCont, this.type);			
			this.planningMap = new PlanningMap(this.sectConfig);
				
			//init just at the beginning, coz you want to dispaly it
			this.editMap();
		}

		private initConfig(catId) {
			if (this.type === PlanningType.Anytime) {
				this.sectConfig = new AnytimeConfig();
			}

			this.sectConfig.catId = catId;
		}

		private initEditBtns() {
				this.$placesTagSel = this.$cont.find(".places-tag-sel");
				this.$placesMapSel = this.$cont.find(".places-map-sel");
				
				this.$cont.find(".edit-list").click((e) => { this.editList(); });
				this.$cont.find(".edit-map").click((e) => { this.editMap(); });				
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

		export class PlanningTags {

				public get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				private $cont;
				private type: PlanningType;

			constructor($cont, type) {
				this.$cont = $cont;
				this.type = type;
			}

			public init() {
				this.getPlaces((places) => {
					this.genPlaces(places);
				});


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
										id: item.code,
										name: item.name,
										type: item.type
								};
						}

					lgc.evnt(".close", (e, $item, $target, item) => {
							if (item.type === FlightCacheRecordType.City) {
									this.changeCitySel(item.code, false, () => {
										$item.remove();
									});	
							}

							if (item.type === FlightCacheRecordType.Country) {
									this.changeCountrySel(item.code, false, () => {
											$item.remove();
									});
							}

							
						});

						lgc.generateList(places);
				}


		}


}