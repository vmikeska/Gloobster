module Views {
		
		export class PeopleFilter {
				public defaults = [0];
				public onChange: Function;

				private acls = "active";
				private blockName = "data-set";
				private itemTemplate;

				private $block;

				constructor() {
						this.itemTemplate = ViewBase.currentView.registerTemplate("item-template");
						this.$block = $(`.${this.blockName}`);
				}

				public init() {

						this.initFriendsCmb();

						this.defaults.forEach((v) => {
								this.setSelection(v, true);
						});

						this.$block.find("a").click((e) => {
								e.preventDefault();
								var $a = $(e.target).closest("a");

								var isActive = $a.hasClass(this.acls);
								$a.toggleClass(this.acls);
								var val = $a.data("gv");

								this.setForm(val, !isActive);

								this.onChange();
						});
				}

				private initFriendsCmb() {
						var $cmbBtn = $("#friendsCmb");
						var $cmb = $cmbBtn.closest(".cmb_all");
						var $list = $cmb.find(".list");
						var $clear = $list.find(".clear");
						
						$cmbBtn.click((e) => {
								e.preventDefault();
								$list.toggle();
						});

						$clear.find("a").click((e) => {
							e.preventDefault();
							this.setAllFriends(false);
						});
				}

				private setForm(val, checked) {

						if (val === 0 && checked) {
								this.setSelection(2, false);
						}

						if (val === 1 && checked) {
								this.setSelection(2, false);
						}

						if (val === 2 && checked) {
								this.setSelection(0, false);
								this.setSelection(1, false);
						}
				}

				public initFriends(friends) {
						var $list = this.$block.find(".list");
						var $clear = $list.find(".clear");
						var $cont = $list.find(".cont");

						friends.forEach((f) => {
								var $item = $(this.itemTemplate(f));

								var $chb = $item.find("input");
								$chb.change((e) => {
										var checked = this.getCheckedFriends().length > 0;
										$clear.toggle(checked);

										this.onChange();
								});

								$cont.append($item);
						});						
				}

			private getCheckedFriends() {
				var $list = this.$block.find(".list");
				var $cont = $list.find(".cont");
				var chbs = $cont.find("input").toArray();

				var result = [];
				chbs.forEach((cb) => {
					var $cb = $(cb);
					var checked = $cb.prop("checked");
					if (checked) {
						result.push($cb.data("val"));
					}
				});

				return result;
			}

			private setAllFriends(checked) {
				var $list = this.$block.find(".list");
				var $clear = $list.find(".clear");
				var $cont = $list.find(".cont");
				var chbs = $cont.find("input").toArray();

				chbs.forEach((cb) => {
					var $cb = $(cb);
					$cb.prop("checked", checked);
				});

				if (!checked) {
					$clear.toggle(false);
				}
			}

			public getSeletedVals() {
						var $asel = _.filter(this.$block.find("a").toArray(), (a) => {
								var $aa = $(a);
								return $aa.hasClass(this.acls);
						});

						var acts = _.map($asel, (a) => {
								return $(a).data("gv");
						});

						return acts;
				}

				private hasValue(val) {
						var vals = this.getSeletedVals();
						return _.contains(vals, val);
				}

				public justMeSelected() {
						var sel = this.getSelection();
						return sel.me && !sel.everybody && !sel.friends && (sel.singleFriends.length === 0);
				}

				private getIcoByVal(val) {
						var $a = this.$block.find(`a[data-gv="${val}"]`);
						return $a;
				}

				public setSelection(val, selected) {
						var $a = this.getIcoByVal(val);

						if (selected) {
								$a.addClass(this.acls);
						} else {
								$a.removeClass(this.acls);
						}
				}

				public getSelection(): Maps.PeopleSelection {
						var evnt = new Maps.PeopleSelection();
						evnt.me = this.hasValue(0);
						evnt.friends = this.hasValue(1);
						evnt.everybody = this.hasValue(2);
						evnt.singleFriends = this.getCheckedFriends();

						return evnt;
				}
		}
}