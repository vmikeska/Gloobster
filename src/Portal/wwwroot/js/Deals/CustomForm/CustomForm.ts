module Planning {
		
	export class CustomFrom {

		private slider: RangeSlider;

		private v: Views.FlyView;

		private $form;
		private airTagger;

		private dataLoader: SearchDataLoader;
		private menu: CustomMenu;

		private dpDep: Common.MyCalendar;
		private dpArr: Common.MyCalendar;

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

		private initDatesClosing() {
			this.$form.find("#datesDoneBtn").click((e) => {
					e.preventDefault();

				this.updateStarted(true, () => {

						this.setFormState(true);
						
					});
					
				});

			this.$form.find("#resetDates").click((e) => {
					e.preventDefault();

					this.updateStarted(false, () => {
							this.setFormState(false);
					});
				});
		}

		private initDateRange() {

				var depOpts = { minDate: moment().add(1, "days").toDate() };

				this.dpDep = new Common.MyCalendar($("#dpDepCont"));
				this.dpDep.onChange = (date) => {

						this.depDate = date;
						
						var md = TravelB.DateUtils.momentDateToMyDate(this.depDate);
						var td = TravelB.DateUtils.myDateToTrans(md);

						var caller = new PropsDataUpload(this.searchId, "dep");
						caller.setVal(td);
						caller.send();
				}

				this.dpArr = new Common.MyCalendar($("#dpArrCont"));
				this.dpArr.onChange = (date) => {
						
						this.arrDate = date;
						
						var md = TravelB.DateUtils.momentDateToMyDate(this.arrDate);
						var td = TravelB.DateUtils.myDateToTrans(md);

						var caller = new PropsDataUpload(this.searchId, "arr");
						caller.setVal(td);
						caller.send();
					}
				
		}

		private create() {
			var tmp = this.v.registerTemplate("custom-template");
			this.$form = $(tmp());
			$("#tabContent").html(this.$form);
				
			this.initShowHide();
		}

		private initShowHide() {
			var $cont = $(".form-cont");
			var $btn = this.$form.find(".show-hide");
			this.setShowHideBtn($cont, $btn, false);
			$btn.click((e) => {
				e.preventDefault();

				var isHidden = $cont.hasClass("hidden");
				this.setShowHideBtn($cont, $btn, !isHidden);

			});
		}

		private setShowHideBtn($cont, $btn, hide) {
			if (hide) {
				$btn.html("show");
				$cont.addClass("hidden");
			} else {
				$btn.html("hide");
				$cont.removeClass("hidden");
			}
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

		private updateStarted(started, callback) {
				var pdu = new PropsDataUpload(this.searchId, "started");
				pdu.setVal(started);
				pdu.send(() => {
						callback();
				});
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
							this.v.resultsEngine.initalCall(PlanningType.Custom, this.searchId);
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
			this.initDatesClosing();
		}

		private depDate;
		private arrDate;
		
		private loadSearch(search) {
			this.$form.find("#cbStandard").prop("checked", search.standardAirs);

			this.depDate = TravelB.DateUtils.myDateToMomentDate(search.deparature);
			this.arrDate = TravelB.DateUtils.myDateToMomentDate(search.arrival);

			this.dpDep.setDate(this.depDate);
			this.dpArr.setDate(this.arrDate);
				
			this.slider.setVals(search.daysFrom, search.daysTo);

			var airs = this.getAirs(search);
			this.airTagger.setSelectedItems(airs);

			this.setFreq(search.freq);

			this.setFormState(search.started);
		}


			private setFormState(started) {

					var $datesStatic = this.$form.find(".dates-static");
					var $flexPart = this.$form.find(".flexible-part");
				  var $fixedPart = this.$form.find(".fixed-part");

					if (started) {
							var days = this.slider.getRange();

							var dep = this.depDate.format("l");
							var arr = this.arrDate.format("l");

							$(".earliest-dep").html(dep);
							$(".latest-arr").html(arr);
							$(".days-from").html(days.from);
							$(".days-to").html(days.to);
							
							$flexPart.removeClass("disabled-block");
							$datesStatic.removeClass("hidden");
							$fixedPart.addClass("hidden");
						  this.v.enableMap(true);
					} else {
							$flexPart.addClass("disabled-block");
							$datesStatic.addClass("hidden");
							$fixedPart.removeClass("hidden");
							this.v.enableMap(false);
					}

					
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
						this.v.resultsEngine.refresh();
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