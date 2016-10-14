module TravelB {

		export class CheckinWin {

				public $html;

				private nowTabConst = "nowTab";
				private futureTabConst = "futureTab";

				private checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");
				private dlgNow = Views.ViewBase.currentView.registerTemplate("dlgNow-template");
				private dlgCity = Views.ViewBase.currentView.registerTemplate("dlgCity-template");

				public placeCombo: Common.PlaceSearchBox;
				
				private tabs: Tabs;
				private wantDos: CategoryTagger;

				private view: Views.TravelBView;

				private editId;

				constructor(view: Views.TravelBView) {
						this.view = view;
				}

				public showCityCheckin(editId, callback = null) {

						this.editId = editId;

						var isEdit = (editId != null);
						if (isEdit) {
							var data = [["type", "id"], ["id", editId]];

							Views.ViewBase.currentView.apiGet("CheckinCity", data, (r) => {
								this.wantDos.initData(r.wantDo);

								this.selectRadio("wantMeet", r.wantMeet);

								$("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);


								this.setCombo(this.$html.find("#fromAge"), r.fromAge);
								this.setCombo(this.$html.find("#toAge"), r.toAge);

								this.placeCombo.initValues({
									sourceId: r.waitingAtId,
									sourceType: r.waitingAtType,
									lastText: r.waitingAtText,
									coord: r.waitingCoord
								});

								this.initDatePickers(r.fromDate, r.toDate);

								var $msg = this.$html.find("#chckMsg");
								$msg.val(r.message);

								this.createValidations(CheckinType.City);
							});
						} else {
								this.createValidations(CheckinType.City);
						}

						this.createWin(isEdit, CheckinType.City);
						this.createWinCity();

					if (!isEdit) {
						this.initDatePickers();
					}

					if (callback) {
								callback();
						}
				}
				
				public showNowCheckin(callback = null) {

						Views.ViewBase.currentView.apiGet("CheckinNow", [["type", "me"]], (r) => {

								var hasStatus = r !== null;

								this.createWin(hasStatus, CheckinType.Now);
								this.createWinNow();

								if (hasStatus) {

									this.editId = r.id;

									this.wantDos.initData(r.wantDo);

									this.selectRadio("wantMeet", r.wantMeet);

									$("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);

									var diffMins = TravelBUtils.waitingMins(r.waitingUntil);
									this.$html.find("#minsWaiting").val(diffMins);

									this.setCombo(this.$html.find("#fromAge"), r.fromAge);
									this.setCombo(this.$html.find("#toAge"), r.toAge);

									this.placeCombo.initValues({
										sourceId: r.waitingAtId,
										sourceType: r.waitingAtType,
										lastText: r.waitingAtText,
										coord: r.waitingCoord
									});

									this.$html.find("#chckMsg").val(r.message);										
								} 

								this.createValidations(CheckinType.Now);

								if (callback) {
										callback();
								}

						});
				}

				private initWantDo() {
						var $c = this.$html.find("#wantDoCont");

						this.wantDos = new CategoryTagger();
						var data = TravelBUtils.getWantDoTaggerData();
						this.wantDos.create($c, "checkin", data, "Pick activities you'd like to do");
				}

				private createWin(isEdit: boolean, type: CheckinType) {
						
						var btnTxt = isEdit ? "Update checkin" : "Checkin";
						var context = { sumbitText: btnTxt };

						this.$html = $(this.checkinWindowDialog(context));
						
						this.initWantDo();

						Common.DropDown.registerDropDown(this.$html.find("#fromAge"));
						Common.DropDown.registerDropDown(this.$html.find("#toAge"));

						this.$html.find("#submitCheckin").click((e) => {
								e.preventDefault();
								if (type === CheckinType.Now) {
										this.callNow(isEdit);
								}
								if (type === CheckinType.City) {
										this.callCity(isEdit);
								}
						});						
				}

				private createWinNow() {
						var $d = $(this.dlgNow());
						this.$html.find("#dlgSpec").html($d);

						this.placeCombo = this.initPlaceDD("1,4", this.$html.find("#waitingPlace"));

						Common.DropDown.registerDropDown(this.$html.find("#minsWaiting"));
				}

				private createWinCity() {
						var $d = $(this.dlgCity());
						this.$html.find("#dlgSpec").html($d);

						this.placeCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));						
				}

				private initDatePickers(fromDate = null, toDate = null) {
						if (!fromDate) {
								fromDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 2));
						}

						if (!toDate) {
								toDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 5));
						}

						DateUtils.initDatePicker(this.$html.find("#fromDate"), fromDate);
						DateUtils.initDatePicker(this.$html.find("#toDate"), toDate);
				}

				private setCombo($combo, value) {
						$combo.find("input").val(value);
						$combo.find("span").html(value);
				}

				private selectRadio(group, val) {
						this.$html.find(`input[name=${group}][value=${val}]`).prop("checked", true);
				}

				private getRequestObj() {
						var data = {
								wantDo: this.getWantDos(),
								wantMeet: $('input[name=wantMeet]:checked').val(),
								multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
								fromAge: $("#fromAge input").val(),
								toAge: $("#toAge input").val(),
								message: $("#chckMsg").val()
						};
						return data;
				}

				private getWantDos() {
						var res = this.wantDos.getSelectedIds();
						return res;
				}
				
				private callNow(isEdit: boolean) {

						if (!this.valids.isAllValid(CheckinType.Now)) {
								var id = new Common.InfoDialog();
								id.create("Validation message", "Some required fields are not filled out.");
								return;
						}

						var data = this.getRequestObj();
						data = $.extend(data, {
								waitingAtId: this.placeCombo.sourceId,
								waitingAtType: this.placeCombo.sourceType,
								waitingAtText: this.placeCombo.lastText,
								waitingCoord: this.placeCombo.coord,
								minsWaiting: $("#minsWaiting input").val(),
								checkinType: CheckinType.Now,
								id: this.editId
						});

						if (isEdit) {
								Views.ViewBase.currentView.apiPut("CheckinNow", data, (r) => {
										this.view.checkinMenu.hideWin();
										this.view.status.refresh();
								});
						} else {
								Views.ViewBase.currentView.apiPost("CheckinNow", data, (r) => {
										this.refreshStat();
										this.view.checkinMenu.hideWin();
								});
						}						
				}

				private callCity(isEdit: boolean) {

						if (!this.valids.isAllValid(CheckinType.City)) {
								var id = new Common.InfoDialog();
								id.create("Validation message", "Some required fields are not filled out.");
								return;
						}

						var data = this.getRequestObj();
						data = $.extend(data, {
								waitingAtId: this.placeCombo.sourceId,
								waitingAtType: this.placeCombo.sourceType,
								waitingAtText: this.placeCombo.lastText,
								waitingCoord: this.placeCombo.coord,
								fromDate: $("#fromDate").data("myDate"),
								toDate: $("#toDate").data("myDate"),
								checkinType: CheckinType.City,
								id: this.editId
						});

						if (isEdit) {
								Views.ViewBase.currentView.apiPut("CheckinCity", data, (r) => {
										this.view.checkinMenu.hideWin();										
								});
						} else {
								Views.ViewBase.currentView.apiPost("CheckinCity", data, (r) => {
										this.view.checkinMenu.hideWin();										
								});	
						}

						
				}

				private refreshStat() {
						this.view.status.refresh();
				}
				
				private initPlaceDD(providers, selObj) {
						var c = new Common.PlaceSearchConfig();
						c.providers = providers;
						c.selOjb = selObj;
						c.minCharsToSearch = 1;
						c.clearAfterSearch = false;

						var combo = new Common.PlaceSearchBox(c);

						var loc = UserLocation.currentLocation;
						if (loc) {
								combo.setCoordinates(loc.lat, loc.lng);
						}

						return combo;
				}		

				private valids: CheckinValidations;

				private createValidations(type: CheckinType) {
						var $msg = this.$html.find("#chckMsg");

						this.valids = new CheckinValidations();
						this.valids.valMessage($msg, $msg);

						this.valids.valWantDo(this.wantDos, this.$html.find("#wantDoCont .wantDosMain"));

						this.valids.valPlace(this.placeCombo, this.$html.find("#waitingPlace input"));

						if (type === CheckinType.City) {
								this.valids.valCalendar($("#fromDate"), $("#toDate"), $("#fromDate"), $("#toDate"));
						}
				}
		}

	export class CheckinValidations {

		public isValid = false;

		private ic = "invalid";

		private messageValid = false;
		private wantDoValid = false;
		private placeValid = false;
		private dateValid = false;

		public isAllValid(type: CheckinType) {

			var baseValid = this.messageValid && this.wantDoValid && this.placeValid;

			if (type === CheckinType.Now) {
				return baseValid;
			}

			return this.dateValid;
		}

		public valCalendar($fromDate, $toDate, $fromFrame, $toFrame) {

			this.valCalendarBody($fromDate, $toDate, $fromFrame, $toFrame);

			$fromDate.change((e) => {
					this.valCalendarBody($fromDate, $toDate, $fromFrame, $toFrame);
			});

		}

	  private valCalendarBody($fromDate, $toDate, $fromFrame, $toFrame) {

				var fromDate = $fromDate.datepicker("getDate");
				var toDate = $toDate.datepicker("getDate");

				var rangeOk = toDate >= fromDate;

				this.visual(rangeOk, $fromFrame);
				this.visual(rangeOk, $toFrame);

				this.dateValid = rangeOk;
		}	

		public valPlace(box: Common.PlaceSearchBox, $frame) {
				this.valPlaceBody(box, $frame);

				box.onPlaceSelected = () => {
						this.valPlaceBody(box, $frame);
				}
		}

		private valPlaceBody(box: Common.PlaceSearchBox, $frame) {
				var isSelected = box.sourceId != null;

				this.visual(isSelected, $frame);

				this.placeValid = isSelected;
		}

		public valWantDo(tagger: CategoryTagger, $frame) {				
				this.valWantDoBody(tagger, $frame);

				tagger.onFilterChange = () => {
					this.valWantDoBody(tagger, $frame);
				}
		}

		private valWantDoBody(tagger: CategoryTagger, $frame) {
			var anySelected = tagger.getSelectedIds().length > 0;

			this.visual(anySelected, $frame);

			this.wantDoValid = anySelected;
		}

		public valMessage($txt, $frame) {

				this.valMessageBody($txt, $frame);

				var dc = new Common.DelayedCallback($txt);
				dc.callback = (val) => {
					this.valMessageBody($txt, $frame);
				};				
		}

		private valMessageBody($txt, $frame) {
				var val = $txt.val();
				var hasText = val.length > 0;
				this.visual(hasText, $frame);
				
				this.messageValid = hasText;
		}

		private visual(isValid: boolean, $frame) {
				if (isValid) {
						$frame.removeClass(this.ic);
				} else {
						$frame.addClass(this.ic);
				}
		}

	}
}