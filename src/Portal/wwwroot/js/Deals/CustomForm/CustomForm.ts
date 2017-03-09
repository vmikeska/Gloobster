module Planning {
		
	export class CustomForm {
			public get v(): Views.ViewBase {
					return Views.ViewBase.currentView;
			}

		private slider: RangeSlider;
			
		
		private airTagger;

		private dataLoader: SearchDataLoader;
		
		private dpDep: Common.MyCalendar;
		private dpArr: Common.MyCalendar;

		private search;

		private depDate;
		private arrDate;

		private $formCont;
		private searchId;

		constructor($cont, searchId) {
			this.searchId = searchId;

			this.dataLoader = new SearchDataLoader();

			this.$formCont = $cont.find(".cat-drop-cont .cont");

			this.create();
		}


		private create() {
			this.getSearch(() => {
				this.init();
			});
		}

		private init() {
			if (this.search.started) {
					var t2 = this.v.registerTemplate("custom-setting-2-template");

					var context = {
						customId: this.search.id
					};

					var $t2 = $(t2(context));
					this.$formCont.html($t2);

					this.initFreq();
				  this.initAirTagger();
					this.initStandardAir();
					this.loadSearch2();
			} else {
					var t1 = this.v.registerTemplate("custom-setting-1-template");
					var $t1 = $(t1());
					this.$formCont.html($t1);

					this.initDaysRange();
					this.initDateRange();
					this.initDatesClosing();
					this.loadSearch1();				
			}
		}

		private getSearch(callback: Function) {

				this.dataLoader.getSearch(this.searchId, (search) => {
					this.search = search;
						callback();
				});

		}
			
		
		private initDaysRange() {
			this.slider = new RangeSlider(this.$formCont.find(".days-range-cont"), "daysRange");
			this.slider.genSlider(1, 21);
			this.slider.onRangeChanged = (from, to) => {

				var caller = new PropsDataUpload(this.searchId, "daysRange");
				caller.addVal("from", from);
				caller.addVal("to", to);
				caller.send();
			}
		}

		private initDateRange() {

				var depOpts = { minDate: moment().add(1, "days").toDate() };

				this.dpDep = new Common.MyCalendar(this.$formCont.find(".dp-dep-cont"));
				this.dpDep.onChange = (date) => {

						this.depDate = date;

						var md = TravelB.DateUtils.momentDateToMyDate(this.depDate);
						var td = TravelB.DateUtils.myDateToTrans(md);

						var caller = new PropsDataUpload(this.searchId, "dep");
						caller.setVal(td);
						caller.send();
				}

				this.dpArr = new Common.MyCalendar(this.$formCont.find(".dp-arr-cont"));
				this.dpArr.onChange = (date) => {

						this.arrDate = date;

						var md = TravelB.DateUtils.momentDateToMyDate(this.arrDate);
						var td = TravelB.DateUtils.myDateToTrans(md);

						var caller = new PropsDataUpload(this.searchId, "arr");
						caller.setVal(td);
						caller.send();
				}

		}

		private initDatesClosing() {
			this.$formCont.find(".finish-dates-btn").click((e) => {
					e.preventDefault();
					
					this.updateStarted(true, () => {
							this.create();
					});

				});
		}

		private initFreq() {
			var items = [{ days: 1, text: "Daily" }, { days: 7, text: "Weekly" }, { days: 30, text: "Monthly" }];

			var $c = this.$formCont.find(".freq-cont .itbl");

			var lg = Common.ListGenerator.init($c, "freq-item-template");

			lg.evnt(".item", (e, $item, $target, item) => {					
					this.updateFreq(item.days, () => {
						this.setFreq(item.days);
					});
			});

			lg.generateList(items);
		}

		private setFreq(days) {
				var $c = this.$formCont.find(".freq-cont");

				$c.find(".item").removeClass("active");

				var $item = $c.find(`[data-d="${days}"]`);
				$item.addClass("active");
		}

		private updateFreq(days, callback) {
				var pdu = new PropsDataUpload(this.searchId, "freq");
				pdu.setVal(days);
				pdu.send(() => {
						callback();
				});
		}


		private updateStarted(started, callback) {
				var pdu = new PropsDataUpload(this.searchId, "started");
				pdu.setVal(started);
				pdu.send(() => {
						callback();
				});
		}
			
		private initStandardAir() {

			var $cb = this.$formCont.find(".cb-standard");

			$cb.change(() => {
					var state = $cb.prop("checked");
					var caller = new PropsDataUpload(this.searchId, "stdAir");
					caller.setVal(state);
					caller.send();
			});
				
		}
	
		private loadSearch1() {
			
			this.depDate = TravelB.DateUtils.myDateToMomentDate(this.search.deparature);
			this.arrDate = TravelB.DateUtils.myDateToMomentDate(this.search.arrival);

			this.dpDep.setDate(this.depDate);
			this.dpArr.setDate(this.arrDate);
				
			this.slider.setVals(this.search.daysFrom, this.search.daysTo);
				
		}


		private loadSearch2() {
				this.$formCont.find(".cb-standard").prop("checked", this.search.standardAirs);

				var airs = this.getAirs(this.search);
				this.airTagger.setSelectedItems(airs);

				this.setFreq(this.search.freq);
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
			config.containerId = `airTagger_${this.searchId}`;
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

