module Planning {
		
	export class CustomFrom {

		private slider: RangeSlider;

		private v: Views.FlyView;

		private $form;
		private airTagger;

		private dataLoader: SearchDataLoader;
		private menu: CustomMenu;

		private $dpDep;
		private $dpArr;

		public searchId;

		constructor(v: Views.FlyView) {
			this.v = v;

			this.create();

			this.dataLoader = new SearchDataLoader();
			this.menu = new CustomMenu(this.$form.find(".searches-menu"));				
		}

		private initDaysRange() {
			this.slider = new RangeSlider(this.$form.find(".days-range-cont"), "daysRange");
			this.slider.genSlider(1, 21);
			this.slider.onRangeChanged = (from, to) => {

				var caller = new PropsDataUpload(this.searchId, "daysRange");
				caller.addVal("from", from);
				caller.addVal("to", to);
				caller.send();
			}
		}

		private datepicker($dp, opts = {}, callback) {
			$dp.datepicker(opts);
			$dp.change((e) => {
				var $this = $(e.target);
				var date = $this.datepicker("getDate");

				callback(date);
			});
		}

		private create() {
			var tmp = this.v.registerTemplate("custom-template");
			this.$form = $(tmp());
			$("#tabContent").html(this.$form);

			this.$dpDep = this.$form.find("#dpDep");
			this.$dpArr = this.$form.find("#dpArr");
		}

		private initFreq() {
			var items = [{ days: 1, text: "Daily" }, { days: 7, text: "Weekly" }, { days: 30, text: "Monthly" }];

			var $c = this.$form.find(".freq-cont .itbl");

			var lg = Common.ListGenerator.init($c, "freq-item-template");

			lg.evnt(".item", (e, $item, $target, item) => {					
					this.updateFreq(item.days, () => {
						this.setFreq(item.days);
					});
			});

			lg.generateList(items);
		}

		private updateFreq(days, callback) {
			var pdu = new PropsDataUpload(this.searchId, "freq");
			pdu.setVal(days);
			pdu.send(() => {
				callback();
			});
		}

		private setFreq(days) {
			var $c = this.$form.find(".freq-cont");

			$c.find(".item").removeClass("active");

			var $item = $c.find(`[data-d="${days}"]`);
			$item.addClass("active");
		}

		private initDateRange() {

			var depOpts = { minDate: moment().add(1, "days").toDate() };

			this.datepicker(this.$dpDep, depOpts, (date) => { 
					var md = TravelB.DateUtils.jsDateToMyDate(date);
					var td = TravelB.DateUtils.myDateToTrans(md);

					var caller = new PropsDataUpload(this.searchId, "dep");
					caller.setVal(td);
					caller.send();
				});

			this.datepicker(this.$dpArr, {}, (date) => {
					var md = TravelB.DateUtils.jsDateToMyDate(date);
					var td = TravelB.DateUtils.myDateToTrans(md);

					var caller = new PropsDataUpload(this.searchId, "arr");
					caller.setVal(td);
					caller.send();
				});
		}
	
		private initStandardAir() {

			var $cb = this.$form.find("#cbStandard");

			$cb.change(() => {
					var state = $cb.prop("checked");
					var caller = new PropsDataUpload(this.searchId, "stdAir");
					caller.setVal(state);
					caller.send();
			});
				
		}

		public init(callback: Function) {
			
			this.dataLoader.getInitData((data) => {
				  this.searchId = data.first.id;

					this.menu.init(data.headers);

					this.initFormControls();

					this.loadSearch(data.first);

					callback();
			});

			this.menu.onSearchChange = (id) => {
					this.dataLoader.getSearch(id, (search) => {
							this.loadSearch(search);
							this.searchId = id;
							this.v.planningMap.loadCategory(PlanningType.Custom);
							//this.v.planningMap.map.mapCities.callToLoadCities();
					});
			}

			this.$form.find(".adder").click((e) => {
				e.preventDefault();
				this.dataLoader.createNewSearch((search) => {
						this.menu.addItem(search.id, search.name);
						this.loadSearch(search);
					this.searchId = search.id;
				});
				});

		}

		private initFormControls() {
			this.initDaysRange();
			this.initAirTagger();
			this.initDateRange();
			this.initStandardAir();
			this.initFreq();
		}

		private loadSearch(search) {
			this.$form.find("#cbStandard").prop("checked", search.standardAirs);

			var depDate = TravelB.DateUtils.myDateToJsDate(search.deparature);
			var arrDate = TravelB.DateUtils.myDateToJsDate(search.arrival);

			this.$dpDep.datepicker("setDate", depDate);
			this.$dpArr.datepicker("setDate", arrDate);

			this.slider.setVals(search.daysFrom, search.daysTo);

			var airs = this.getAirs(search);
			this.airTagger.setSelectedItems(airs);

			this.setFreq(search.freq);
		}

		private getAirs(search) {
				var si = [];
				search.customAirs.forEach((a) => {
						si.push({ kind: "airport", value: a.origId, text: a.text });
				});

				return si;
		}

		private initAirTagger() {
			var config = new TaggingFieldConfig();
			config.containerId = "airTagger";
			config.localValues = false;
			config.listSource = "TaggerAirports";
			config.clientMatch = false;

			this.airTagger = new TaggingField(config);
			this.airTagger.onItemClickedCustom = ($target, callback) => {
				var val = $target.data("vl");
				var kind = $target.data("kd");
				var text = $target.text();

				var pdu = new PropsDataUpload(this.searchId, "custAir");
				pdu.addVal("text", text);
				pdu.addVal("origId", val);
				pdu.send(() => {
					callback();
				});
			}

				this.airTagger.onDeleteCustom = (val, callback) => {
						this.dataLoader.removeAirport(this.searchId,
						val, () => {
								callback();
						});
				}

		}


	}
		
}