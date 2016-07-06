﻿module TravelB {

		export enum CheckinType { Now, City }

	export class CheckinWin {

		private $html;

		private nowTabConst = "nowTab";
		private futureTabConst = "futureTab";


		private checkinWindowDialog;
		private dlgNow;
		private dlgCity;
		private ddReg;

		private wpCombo;
		private wcCombo;

		private tabs: Tabs;

		constructor() {
			this.registerTemplates();
			this.ddReg = new Common.DropDown();
		}

			public showCityCheckin(editId) {

					var isEdit = (editId != null);
					if (isEdit) {
						
					}

					this.createWin(isEdit, CheckinType.City);
					this.createWinCity();

			}

		public showNowCheckin() {

				Views.ViewBase.currentView.apiGet("CheckinNow", [["me", "true"]], (r) => {

						var hasStatus = r !== null;

						this.createWin(hasStatus, CheckinType.Now);
						this.createWinNow();

						if (hasStatus) {

								this.selectRadio("wantDo", r.wantDo);
								this.selectRadio("wantMeet", r.wantMeet);

								$("#multiPeopleAllowed").prop("checked", r.multiPeopleAllowed);

								var diffMins = TravelBUtils.waitingMins(r.waitingUntil);
								this.$html.find("#minsWaiting").val(diffMins);

								this.setCombo(this.$html.find("#fromAge"), r.fromAge);
								this.setCombo(this.$html.find("#toAge"), r.toAge);

								this.wpCombo.initValues({
										sourceId: r.waitingAtId,
										sourceType: r.waitingAtType,
										lastText: r.waitingAtText,
										coord: r.waitingCoord
								});

						}

				});
		}

		private initWantDo() {
				var items = TravelBUtils.wantDoDB();

			var $c = this.$html.find("#wantDoCont");

			items.forEach((i) => {
					var $h = $(`<input id="wd_${i.id}" type="checkbox" /><label for="wd_${i.id}">${i.text}</label>`);
				$c.append($h);
			});
		}

		private createWin(edit: boolean, type: CheckinType) {
				//temp fix
				$(".popup").remove();

			var btnTxt = edit ? "Update checkin" : "Checkin";
			var context = { sumbitText: btnTxt };

			this.$html = $(this.checkinWindowDialog(context));
				
			$("body").append(this.$html);
			this.$html.fadeIn();

			this.initWantDo();

			this.ddReg.registerDropDown(this.$html.find("#fromAge"));
			this.ddReg.registerDropDown(this.$html.find("#toAge"));

			this.$html.find("#submitCheckin").click((e) => {
				e.preventDefault();
				if (type === CheckinType.Now) {
					this.callNow();
				}
				if (type === CheckinType.City) {
					this.callCity();
				}
			});

			this.$html.find(".cancel").click((e) => {
				e.preventDefault();
				this.$html.fadeOut();
				this.$html.remove();
			});

			this.fillAgeCombo("fromAge");
			this.fillAgeCombo("toAge");
		}

		private createWinNow() {
			var $d = $(this.dlgNow());
			this.$html.find("#dlgSpec").html($d);

			this.wpCombo = this.initPlaceDD("1,0,4", this.$html.find("#waitingPlace"));
		}

		private createWinCity() {
			var $d = $(this.dlgCity());
			this.$html.find("#dlgSpec").html($d);

			this.wcCombo = this.initPlaceDD("2", this.$html.find("#waitingCity"));

			var fromDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 2));
			var toDate = DateUtils.jsDateToMyDate(DateUtils.addDays(Date.now(), 5));
				
			DateUtils.initDatePicker(this.$html.find("#fromDate"), fromDate);
			DateUtils.initDatePicker(this.$html.find("#toDate"), toDate);
		}

		private setCombo($combo, value) {
			$combo.find("input").val(value);
			$combo.find("span").html(value);
		}

		private selectRadio(group, val) {
			$(`input[name=${group}][value=${val}]`).prop("checked", true);
		}

		private fillAgeCombo(id) {
			var $ul = $(`#${id}`).find("ul");;
			var ageStart = 18;
			var ageEnd = 70;
			for (var act = ageStart; act <= ageEnd; act++) {
				$ul.append(`<li data-value="${act}">${act}</li>`);
			}
		}

		private getRequestObj() {
			var data = {
				wantDo: this.getWantDos(),
				wantMeet: $('input[name=wantMeet]:checked').val(),
				multiPeopleAllowed: $("#multiPeopleAllowed").prop("checked"),
				fromAge: $("#fromAge input").val(),
				toAge: $("#toAge input").val()				
			};
			return data;
		}

		private getWantDos() {
			var res = [];
			var items = $("#wantDoCont").children().toArray();
			items.forEach((i) => {
				var $i = $(i);
				if ($i.prop("checked")) {
					var id = $i.attr("id");
					var val = id.split("_")[1];
					res.push(val);
				}
			});
			return res;
		}


		private callNow() {

			var data = this.getRequestObj();
			data = $.extend(data, {
				waitingAtId: this.wpCombo.sourceId,
				waitingAtType: this.wpCombo.sourceType,
				waitingAtText: this.wpCombo.lastText,
				waitingCoord: this.wpCombo.coord,
				minsWaiting: $("#minsWaiting").val()
			});

			Views.ViewBase.currentView.apiPost("CheckinNow", data, (r) => {
				this.refreshStat();
			});

		}

		private callCity() {
			var data = this.getRequestObj();
			data = $.extend(data, {
				waitingAtId: this.wcCombo.sourceId,
				waitingAtType: this.wcCombo.sourceType,
				waitingAtText: this.wcCombo.lastText,
				waitingCoord: this.wcCombo.coord,
				fromDate: $("#fromDate").data("myDate"),
				toDate: $("#toDate").data("myDate")
			});

			Views.ViewBase.currentView.apiPost("CheckinCity", data, (r) => {

			});
		}

		private refreshStat() {
			var status = new Status();
			status.refresh();
			this.$html.fadeOut();
			this.$html.remove();
		}

		private registerTemplates() {
			this.checkinWindowDialog = Views.ViewBase.currentView.registerTemplate("checkinDialog-template");

			this.dlgNow = Views.ViewBase.currentView.registerTemplate("dlgNow-template");
			this.dlgCity = Views.ViewBase.currentView.registerTemplate("dlgCity-template");
		}

		private initPlaceDD(providers, selObj) {
			var c = new Common.PlaceSearchConfig();
			c.providers = providers;
			c.selOjb = selObj;
			c.minCharsToSearch = 1;
			c.clearAfterSearch = false;

			var combo = new Common.PlaceSearchBox(c);
			return combo;
		}


	}
}