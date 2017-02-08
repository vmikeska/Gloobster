module Planning {
		
		export class DealsPlaceSearch {
				private $cont;
				private $input;
				private $results;
				private $ico;
				private $close;
				private $preload;

				public selectedItem = null;

				public get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				public hasSelected() {
					return (this.selectedItem != null);
				}

				constructor($cont, placeholder) {
				this.$cont = $cont;

				this.$cont.addClass("city-airport-search");

				this.init(placeholder);
			}

			private init(placeholder) {
				var tmp = this.v.registerTemplate("city-air-search-template");
				var $t = $(tmp({ placeholder: placeholder}));
				this.$cont.html($t);

				this.$input = this.$cont.find(".input-txt");
				this.$results = this.$cont.find(".results");
				this.$ico = this.$cont.find(".ico");
				this.$close = this.$cont.find(".close");
				this.$preload = this.$cont.find(".preload-wheel");

				this.regCall();
			}

			private regCall() {
				this.$input.on("input", (e) => {
						var txt = this.$input.val();

						var data = [["txt", txt], ["max", "10"]];

						this.preloader(true);
						this.v.apiGet("DealsPlace", data, (items) => {
								this.preloader(false);
								this.genItems(items);
							});

					});

				this.$input.on("focusin", (e) => {
					this.$input.val("");
				});

				this.$input.on("focusout", (e) => {
						this.$input.val("");

						if (this.selectedItem) {
								var itxt = `${this.selectedItem.name}${this.codeStrForItem(this.selectedItem)}`;
								this.$input.val(itxt);					
						}
				});

				this.$close.click((e) => {
						this.selectedItem = null;
						this.$input.val("");
						this.$ico.attr("class", `icon-logo-pin ico`);
				});
			}

			

				private itemClicked(item) {
					var itxt = `${item.name}${this.codeStrForItem(item)}`;
					this.$input.val(itxt);					
					this.$ico.attr("class", `icon-${this.iconForItem(item.type)} ico`);
					this.selectedItem = item;
					this.showRes(false);
			}

				private preloader(show) {
					if (show) {
							this.$close.addClass("hidden");
							this.$preload.removeClass("hidden");
					} else {
							this.$close.removeClass("hidden");
							this.$preload.addClass("hidden");
					}
				}
				

				private showRes(show) {
					if (show) {
							this.$results.removeClass("hidden");
					} else {
							this.$results.addClass("hidden");
					}
				}

			private codeStrForItem(item) {
				if (item.type === 0) {
					return `, ${item.cc}`;
				}

				if (item.type === 1) {
					var hasSubCities = (item.type === 1) && any(item.childern);
					var ac = hasSubCities ? "All" : item.air;
					return `, ${item.cc ? item.cc : ""} (${ac})`;
				}

				if (item.type === 2) {
					return `, (${item.air})`;
				}

				return "";
			}

			private iconForItem(type) {
				if (type === 0) {
					return "country";
				}

				if (type === 1) {
					return "logo-pin";
				}

				if (type === 2) {
					return "airplane";
				}
				return "";
			}

			private itemMapping(i) {
				var r = {
					icon: this.iconForItem(i.type),
					txt: i.name,
					code: this.codeStrForItem(i),
					cls: i.type === 2 ? "sub" : ""
				};
				return r;
			}

			private genItems(items) {

					this.showRes(any(items));

						var lg = Common.ListGenerator.init(this.$results, "city-air-item-template");
						lg.clearCont = true;
					  lg.appendStyle = "append";
						lg.evnt(null, (e, $item, $target, item) => { this.itemClicked(item); });
						lg.customMapping = (i) => { return this.itemMapping(i); };

							lg.onItemAppended = ($item, item) => {

								var hasSubCities = (item.type === 1) && any(item.childern);
								if (hasSubCities) {
									var lgt = Common.ListGenerator.init(this.$results, "city-air-item-template");
									lgt.appendStyle = "append";
									lgt.evnt(null, (e, $item, $target, item) => { this.itemClicked(item); });
									lgt.customMapping = (i) => { return this.itemMapping(i) };
									lgt.generateList(item.childern);
								}
							};

						lg.generateList(items);

				}
		}
		
}