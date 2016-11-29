module Planning {

	export class PropsDataUpload {

		private searchId;
		private value;
		private values = [];
		private propName;

		constructor(searchId, propName) {
			this.searchId = searchId;
			this.propName = propName;
		}

		public setVal(val) {
			this.value = val;
		}

		public addVal(name, val) {
			this.values.push({ name: name, val: val });
		}


		public send(callback: Function = null) {

			var req = {
				id: this.searchId,
				name: this.propName,
				value: this.value,
				values: this.values
			};

			Views.ViewBase.currentView.apiPut("CustomSearch",
				req,
				(res) => {
					if (callback) {
						callback(res);
					}
				});
		}
	}

	export class SearchDataLoader {

		public getInitData(callback: Function) {

			var prms = [["actionName", "init"]];

			Views.ViewBase.currentView.apiGet("CustomSearch",
				prms,
				(res) => {
					callback(res);
				});
		}

		public getSearch(id, callback: Function) {
			var prms = [["actionName", "search"], ["id", id]];

			Views.ViewBase.currentView.apiGet("CustomSearch",
				prms,
				(res) => {
					callback(res);
				});
		}

		public createNewSearch(callback: Function) {

			var data = {
				actionName: "new"
			};

			Views.ViewBase.currentView.apiPost("CustomSearch",
				data,
				(res) => {
					callback(res);
				});
		}

		public deleteSearch(id, callback: Function) {
			Views.ViewBase.currentView.apiDelete("CustomSearch",
				[["actionName", "search"], ["id", id]],
				(res) => {
					callback(res);
				});
		}

		public removeAirport(searchId, origId, callback: Function) {

			var prms = [["actionName", "air"], ["id", searchId], ["paramId", origId]];

			Views.ViewBase.currentView.apiDelete("CustomSearch",
				prms,
				(res) => {
					callback(res);
				});
		}


	}

	export class CustomMenu {

		public onSearchChange: Function;

		private $cont;

		private actCls = "state-active";

		private headers;

		private dataLoader: SearchDataLoader;

		constructor($cont) {
			this.dataLoader = new SearchDataLoader();
			this.$cont = $cont;
		}

		public addItem(id, name) {
			this.headers.push({ id: id, name: name });
			this.init(this.headers, id);
		}

		public init(headers, initId = null) {
			this.headers = headers;

			this.$cont.find(".item").remove();

			var activeId = "";
			if (this.headers.length > 0) {
					activeId = this.headers[0].id;
			}
			if (initId) {
				activeId = initId;
			}


			var lg = Common.ListGenerator.init(this.$cont.find(".adder"), "custom-menu-btn-template");
			lg.appendStyle = "before";
				
			lg.activeItem = (item) => {
				var obj = {
					isActive: item.id === activeId,
					cls: this.actCls
				};
					
				return obj;
			}

			lg.evnt(null,
				(e, $item, $target, item) => {
					this.itemClicked($item);
				});

			lg.evnt(".delete",
				(e, $item, $target, item) => {
					this.delClicked(item.id);
				});

			lg.evnt(".edit",
				(e, $item, $target, item) => {
					this.editClicked($item);
				});

			lg.evnt(".edit-save",
				(e, $item, $target, item) => {
					this.saveClicked($item);
				});

			lg.evnt(".name-edit",
					(e, $item, $target, item) => {
						this.keyPressed(e, $item);
					})
				.setEvent("keyup");

			lg.generateList(headers);
		}

		private keyPressed(e, $item) {
			if (e.keyCode === 13) {
				this.saveClicked($item);
			}
		}

		private saveClicked($item) {
			var id = $item.data("id");
			var name = $item.find(".name-edit").val();

			var header = _.find(this.headers, (h) => { return h.id === id });
			header.name = name;

			var pdu = new PropsDataUpload(id, "name");
			pdu.setVal(name);
			pdu.send(() => {
				$item.find(".name-txt").html(name);
				$item.removeClass("state-editing");
				$item.addClass("state-active");
			});
		}

		private editClicked($item) {
			$item.removeClass("state-active");
			$item.addClass("state-editing");
		}

		private delClicked(id) {

			var cd = new Common.ConfirmDialog();

			cd.create("Search removal",
				"Do you want to remove the search?",
				"Cancel",
				"Delete",
				() => {

					this.dataLoader.deleteSearch(id,
						() => {
							$(`#${id}`).remove();
						});

				});

		}

		private itemClicked($item) {

			var id = $item.data("id");

			var $items = this.$cont.find(".item");
			$items.removeClass(this.actCls);

			$item.addClass(this.actCls);

			if (this.onSearchChange) {
				this.onSearchChange(id);
			}
		}


	}


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