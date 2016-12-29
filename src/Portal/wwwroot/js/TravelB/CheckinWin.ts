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

				public showCityCheckin(editId, callback: Function = null) {
						
						this.editId = editId;

						var isEdit = (editId != null);

						this.createWin(isEdit, CheckinType.City);
						this.createWinCity();

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

								this.initDatePickers(DateUtils.myDateToMomentDate(r.fromDate), DateUtils.myDateToMomentDate(r.toDate));

								var $msg = this.$html.find("#chckMsg");
								$msg.val(r.message);

								this.createValidations(CheckinType.City);
							});
						} else {
								this.initDatePickers();

								this.createValidations(CheckinType.City);
						}
						
					if (callback) {
								callback();
						}
				}
				
				public showNowCheckin(callback: Function = null) {

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
						this.wantDos.create($c, "checkin", data, this.view.t("ActivitesEmptyText", "jsTravelB"));
				}

				

				private createWin(isEdit: boolean, type: CheckinType) {
						
						var btnTxt = isEdit ? this.view.t("UpdateCheckin", "jsTravelB") : this.view.t("Checkin", "jsTravelB");
						var context = { sumbitText: btnTxt };

						this.$html = $(this.checkinWindowDialog(context));
						
						this.initWantDo();

						Common.DropDown.registerDropDown(this.$html.find("#fromAge"));
						Common.DropDown.registerDropDown(this.$html.find("#toAge"));

						this.$html.find("#submitCheckin").click((e) => {
								e.preventDefault();
								
								this.view.hasFullReg(() => {

										if (type === CheckinType.Now) {
												this.callNow(isEdit);
										}
										if (type === CheckinType.City) {
												this.callCity(isEdit);
										}

							});								
						});						
				}

				private createWinNow() {
						var $d = $(this.dlgNow());
						this.$html.find("#dlgSpec").html($d);

						this.placeCombo = this.initPlaceDD("1,4", this.$html.find("#placeCombo"));

						Common.DropDown.registerDropDown(this.$html.find("#minsWaiting"));
				}

				private createWinCity() {
						var $d = $(this.dlgCity());
						this.$html.find("#dlgSpec").html($d);

						this.placeCombo = this.initPlaceDD("2", this.$html.find("#placeCombo"));						
				}

				private fdCal;
				private tdCal;


				private initDatePickers(fromDate = null, toDate = null) {
						if (!fromDate) {
							fromDate = moment().add(2, "days");
						}

						if (!toDate) {
								toDate = moment().add(5, "days");
						}

						this.fdCal = new Common.MyCalendar(this.$html.find("#fromDateCont"), fromDate);						
						this.tdCal = new Common.MyCalendar(this.$html.find("#toDateCont"), toDate);						
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

						if (!this.valids.isAllValid()) {
								var id = new Common.InfoDialog();
								id.create(this.view.t("InvalidMsgTitle", "jsTravelB"), this.view.t("InvalidMsgBody", "jsTravelB"));
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
										this.view.refreshMap();
								});
						} else {
								Views.ViewBase.currentView.apiPost("CheckinNow", data, (r) => {
										this.refreshStat();
										this.view.checkinMenu.hideWin();
										this.view.refreshMap();
								});
						}						
				}

				private callCity(isEdit: boolean) {

						if (!this.valids.isAllValid()) {
								var id = new Common.InfoDialog();
								id.create(this.view.t("InvalidMsgTitle", "jsTravelB"), this.view.t("InvalidMsgBody", "jsTravelB"));
								return;
						}
						
						//var origFromDate = $("#fromDate").data("myDate");
						//var origToDate = $("#toDate").data("myDate");
						var fromDateTrans = DateUtils.momentDateToMyDate(this.fdCal.date);
						var toDateTrans = DateUtils.momentDateToMyDate(this.tdCal.date);

						if (this.fdCal.date.isAfter(this.tdCal.date)) {
								fromDateTrans = DateUtils.momentDateToMyDate(this.tdCal.date);
								toDateTrans = DateUtils.momentDateToMyDate(this.fdCal.date);
						}

						//if (DateUtils.myDateToJsDate(origFromDate) > DateUtils.myDateToJsDate(origToDate)) {
						//		fromDate = origToDate;
						//		toDate = origFromDate;
						//}
						
						var data = this.getRequestObj();
						data = $.extend(data, {
								waitingAtId: this.placeCombo.sourceId,
								waitingAtType: this.placeCombo.sourceType,
								waitingAtText: this.placeCombo.lastText,
								waitingCoord: this.placeCombo.coord,
								fromDate: fromDateTrans,
								toDate: toDateTrans,
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
				
				private initPlaceDD(providers, $selObj) {
						var c = new Common.PlaceSearchConfig();
						c.providers = providers;
						c.selOjb = $selObj;
						c.minCharsToSearch = 1;
						c.clearAfterSearch = false;

						var combo = new Common.PlaceSearchBox(c);

						var loc = UserLocation.currentLocation;
						if (loc) {
								combo.setCoordinates(loc.lat, loc.lng);
						}

						return combo;
				}		

				private valids: FormValidations;

				private createValidations(type: CheckinType) {
						var $msg = this.$html.find("#chckMsg");

						this.valids = new FormValidations();
						this.valids.valMessage($msg, $msg);

						this.valids.valWantDo(this.wantDos, this.$html.find("#wantDoCont .wantDosMain"));
						
						this.valids.valPlace(this.placeCombo, this.$html.find("#placeCombo"), this.$html.find("#placeCombo input"));
						
				}
		}
}